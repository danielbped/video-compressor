import { File as MulterFile } from 'multer';
import { join, parse } from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { FileHandlerInterface, FileHandlerResponse } from '../interface/helpers.interface';
import { GCSProvider } from '../provider/googleCloud.provider';
import { createReadStream, unlinkSync } from 'fs';

export default class FileHandler implements FileHandlerInterface {
  private gcsProvider: GCSProvider;

  constructor(gcsProvider: GCSProvider) {
    this.gcsProvider = gcsProvider;
  }

  public async handle(file: MulterFile): Promise<FileHandlerResponse> {
    const inputPath = file.path;
    const { name, ext } = parse(file.filename);
    const compressedFilename = `${name}_low${ext}`;
    const tempOutputPath = join('/tmp', compressedFilename);

    try {
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

      const stream = createReadStream(tempOutputPath);
      const gcsUrl = await this.gcsProvider.uploadFile(stream, compressedFilename);

      unlinkSync(inputPath);
      unlinkSync(tempOutputPath);

      return {
        filename: compressedFilename,
        url: gcsUrl,
      };
    } catch (error) {
      throw error;
    }
  }
}