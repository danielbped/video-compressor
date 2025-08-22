import { File as MulterFile } from 'multer';
import { join, parse } from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { FileHandlerInterface, FileHandlerResponse } from '../interface/helpers.interface';
import { GCSProvider } from '../provider/googleCloud.provider';
import { createReadStream, unlinkSync, statSync } from 'fs';

export default class FileHandler implements FileHandlerInterface {
  private gcsProvider: GCSProvider;

  constructor(gcsProvider: GCSProvider) {
    this.gcsProvider = gcsProvider;
  }

  public async create(file: MulterFile): Promise<FileHandlerResponse> {
    const inputPath = file.path;
    const { name, ext } = parse(file.filename);
    const originalFilename = file.filename;
    const compressedFilename = `${name}_compressed${ext}`;
    const tempOutputPath = join('/tmp', compressedFilename);

    try {
      const originalStats = statSync(inputPath);
      const originalSize = originalStats.size;

      const originalStream = createReadStream(inputPath);
      const originalGcsFile = await this.gcsProvider.uploadFile(originalStream, originalFilename);

      await new Promise<void>((resolve, reject) => {
        ffmpeg(inputPath)
          .outputOptions([
            '-vcodec libx264',
            '-crf 28',
            '-preset veryfast',
            '-acodec aac',
            '-b:a 128k',
          ])
          .on('end', () => resolve())
          .on('error', reject)
          .save(tempOutputPath);
      });

      const compressedStats = statSync(tempOutputPath);
      const compressedSize = compressedStats.size;

      const compressionPercentage = Math.round(((originalSize - compressedSize) / originalSize) * 100);

      const compressedStream = createReadStream(tempOutputPath);
      const compressedGcsFile = await this.gcsProvider.uploadFile(compressedStream, compressedFilename);

      unlinkSync(inputPath);
      unlinkSync(tempOutputPath);

      return {
        original_filename: originalFilename,
        compressed_filename: compressedFilename,
        original_url: originalGcsFile.url,
        compressed_url: compressedGcsFile.url,
        original_path: originalGcsFile.path,
        compressed_path: compressedGcsFile.path,
        original_size: originalSize,
        compressed_size: compressedSize,
        compression_percentage: compressionPercentage,
      };
    } catch (error) {
      try {
        unlinkSync(inputPath);
        unlinkSync(tempOutputPath);
      } catch (cleanupError) {
      }
      throw error;
    }
  }

  public async delete(originalPath: string, compressedPath?: string): Promise<void> {
    try {
      await this.gcsProvider.deleteFile(originalPath);
      
      if (compressedPath) {
        await this.gcsProvider.deleteFile(compressedPath);
      }
    } catch (error) {
      throw new Error(`Failed to delete files: ${error.message}`);
    }
  }

  private formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + ' ' + sizes[i];
  }

  public getCompressionInfo(response: FileHandlerResponse): {
    originalSizeFormatted: string;
    compressedSizeFormatted: string;
    spaceSaved: string;
  } {
    return {
      originalSizeFormatted: this.formatFileSize(response.original_size),
      compressedSizeFormatted: this.formatFileSize(response.compressed_size),
      spaceSaved: this.formatFileSize(response.original_size - response.compressed_size),
    };
  }
}
