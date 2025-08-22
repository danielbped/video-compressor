/* eslint-disable prettier/prettier */
import User from '../entity/user.entity';

export interface HealthResponse {
  message: string;
}

export interface LoginResponse {
  token: string;
  user: Partial<User>;
}

export interface CreateUserResponse {
  user: Partial<User>;
  token: string;
}

export interface CreateFileResponse {
  id: string;
  user: Partial<User>;
  createdAt: Date;
  updatedAt: Date;
  original_url: string;
  compressed_url: string;
  compression_percentage: number;
  original_size: number;
  compressed_size: number;
}
