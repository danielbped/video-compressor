/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import User from '../entity/user.entity';
import { sign, verify } from 'jsonwebtoken';
import { config } from 'dotenv';
import ErrorMessage from '../utils/ErrorMessage';

const { SECRET_KEY_JWT } = process.env;

config();

export default class Token {
  public generate(user: User | null): string | null {
    if (!user) { return null };
    try {
      return sign({ ...user }, String(SECRET_KEY_JWT), {
        expiresIn: '24h',
      });
    } catch (error) {
      console.error(ErrorMessage.EncodeError, error);
      return null;
    }
  }

  public compare(token: string): User | null {
    try {
      const decodedToken = verify(token, String(SECRET_KEY_JWT)) as User;

      return decodedToken;
    } catch (error) {
      console.error(ErrorMessage.DecodeError, error);
      return null;
    }
  }
}
