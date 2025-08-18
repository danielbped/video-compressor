/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */

import * as bcrypt from 'bcrypt';

export default class PasswordHandler {
  private readonly saltRounds: number;

  public constructor(saltRounds: number = 10) {
    this.saltRounds = saltRounds;
  }

  public encode = (password: string): string | null => {
    try {
      return bcrypt.hashSync(password, this.saltRounds);
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  public compare = (
    password: string,
    hash: string,
  ): Promise<boolean> | null => {
    try {
      return bcrypt.compare(password, hash);
    } catch (err) {
      return null;
    }
  };
}
