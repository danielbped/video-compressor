import { File as MulterFile } from 'multer';
import User from '../entity/user.entity';
import { Request } from 'express'

export interface FileHandlerResponse {
  filename: string;
  url: string;
  path: string;
}

export interface FileHandlerInterface {
  create(file: MulterFile): Promise<FileHandlerResponse>;
  delete(filePath: string): Promise<void>;
}

export interface RequestWithUser extends Request {
  user?: User
  files: File[]
}