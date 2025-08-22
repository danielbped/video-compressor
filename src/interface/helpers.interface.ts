import { File as MulterFile } from 'multer';
import User from '../entity/user.entity';
import { Request } from 'express'

export interface FileHandlerResponse {
  original_filename: string;
  compressed_filename: string;
  original_url: string;
  compressed_url: string;
  original_path: string;
  compressed_path: string;
  original_size: number;
  compressed_size: number;
  compression_percentage: number;
}

export interface FileHandlerInterface {
  create(file: MulterFile): Promise<FileHandlerResponse>;
  delete(filePath: string): Promise<void>;
}

export interface RequestWithUser extends Request {
  user?: User
  files: File[]
}