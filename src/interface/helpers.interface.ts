import { File as MulterFile } from 'multer';
import User from '../entity/user.entity';
import { Request } from 'express'

export interface FileHandlerResponse {
  filename: string;
  url: string;
}

export interface FileHandlerInterface {
  handle(file: MulterFile): Promise<FileHandlerResponse>;
}

export interface RequestWithUser extends Request {
  user?: User
}