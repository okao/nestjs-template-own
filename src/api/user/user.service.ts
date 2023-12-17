import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/service_modules/prisma/prisma.service';
import { UserResponse } from './class/response.class';

@Injectable()
export class UserService {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async getUser(id: string): Promise<UserResponse> {
    try {
      const users = await this.prisma.user.findFirst({
        where: {
          id: id,
        },
        select: {
          id: true,
          username: true,
          email: true,
          createdAt: true,
        },
      });

      return users;
    } catch (error) {
      throw new HttpException(
        {
          status: 501,
          errors: {
            message: 'Something went wrong',
          },
        },
        501,
      );
    }
  }
}
