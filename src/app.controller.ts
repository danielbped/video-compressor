/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { File as MulterFile } from 'multer';
import { join, parse } from 'path';
import * as fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';

@Controller('api')
export class AppController {
  @Post('videos')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: MulterFile) {
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
            console.log('Compressão concluída:', outputPath);
            resolve();
          })
          .on('error', (err) => {
            console.error('Erro durante a compressão:', err);
            reject(err);
          })
          .save(outputPath);
      });

      fs.unlinkSync(inputPath);

      return {
        message: 'Vídeo comprimido com sucesso!',
        filename: compressedFilename,
        path: outputPath,
      };
    } catch (error) {
      console.error('Erro no processamento do vídeo:', error);
      throw error;
    }
  }
}
