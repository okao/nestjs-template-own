import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
// import { PrismaClient } from '../../lib/db/client/index';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(private configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: configService.get<string>('POSTGRES_URL'),
        },
      },
    });
  }

  async onModuleInit() {
    console.log('PrismaService initialized');
    await this.$connect();
  }

  async onModuleDestroy() {
    console.log('PrismaService destroyed');
    await this.$disconnect();
  }
}
