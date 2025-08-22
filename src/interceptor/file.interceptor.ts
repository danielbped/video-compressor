import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import ErrorMessage from '../utils/ErrorMessage';

@Injectable()
export class FileValidationInterceptor implements NestInterceptor {
  private readonly filesInterceptor: NestInterceptor;

  constructor() {
    this.filesInterceptor = new (FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }))();
  }

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();

    const result = await this.filesInterceptor.intercept(context, next);

    const files = request.files;
    const maxFileSizeInMB = 10;
    const maxFileSize = maxFileSizeInMB * 1024 * 1024;
    const maxFilesQuantity = 5;

    if (!files || files.length === 0) {
      throw new BadRequestException(ErrorMessage.NoFileProvided);
    }

    if (files.length > maxFilesQuantity) {
      throw new BadRequestException(ErrorMessage.MaxFileQuantityReached);
    }

    if (files.some(file => file.size > maxFileSize)) {
      throw new BadRequestException(ErrorMessage.MaxFileSizeReached);
    }

    const allowedMimeTypes = [
      'video/mp4', 
      'video/avi', 
      'video/mov', 
      'video/wmv', 
      'video/flv',
      'video/webm',
      'video/mkv'
    ];

    const invalidFiles = files.filter(file => 
      !allowedMimeTypes.includes(file.mimetype)
    );

    if (invalidFiles.length > 0) {
      throw new BadRequestException(ErrorMessage.InvalidFileType);
    }

    return result;
  }
}
