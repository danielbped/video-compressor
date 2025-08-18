/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, Request } from '@nestjs/common';

@Injectable()
export class AppService {
  compressVideo(_req: Request): string {
    return 'Compressing...!';
  }
}
