import { File as MulterFile } from 'multer';
import { join, parse } from 'path';
import * as fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';
import { FileHandlerInterface, FileHandlerResponse } from '../interface/helpers.interface';

export default class ICreateFileDTO implements FileHandlerInterface {
  public async handle(file: MulterFile): Promise<FileHandlerResponse> {
    const inputPath = file.path;
    const { name, ext } = parse(file.filename);
    const compressedFilename = `${name}_low${ext}`;
    const outputPath = join('./uploads', compressedFilename);

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
          .on('end', () => {
            resolve();
          })
          .on('error', (err) => {
            reject(err);
          })
          .save(outputPath);
      });

      fs.unlinkSync(inputPath);

      return {
        filename: compressedFilename,
        url: outputPath,
      };
    } catch (error) {
      throw error;
    }
  }
}