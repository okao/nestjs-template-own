import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DashboardService {
  constructor(private configService: ConfigService) {
    this.configService = configService;
  }

  getHello = () => {
    const port = this.configService.get<number>('port');

    return `Server is running on port ${port}!`;
  };
}
