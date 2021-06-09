import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getProductInfo(): string {
    return 'OrgaMan';
  }
}
