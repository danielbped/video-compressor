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
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  url: string;
}
