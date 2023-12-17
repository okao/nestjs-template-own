import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/service_modules/prisma/prisma.service';
import { UserResponse } from '../../dtos/user_response.class';
import { CreateUser } from '../../dtos/user.dto';
import { User } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { USER_CREATED_QUEUE } from './consumer.constants';

@Injectable()
export class UserService {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
    @InjectQueue(USER_CREATED_QUEUE) private readonly userQueue: Queue,
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

  async createUser(user: CreateUser): Promise<User> {
    const { username, email, role, password } = user;

    const hashedPassword = await bcrypt.hash(password, 10).then((hash) => hash);

    const countUser = await this.prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }],
      },
    });

    if (countUser) {
      throw new BadRequestException(
        'Username or email already exist. Please try again.',
      );
    }

    const createUser = await this.prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: {
          connect: {
            name: role,
          },
        },
      },
      include: {
        role: true,
      },
    });

    this.eventEmitter.emit('user.created', createUser);

    delete createUser.password;
    delete createUser.defaultAuthProviderId;
    delete createUser.roleId;
    delete createUser.statusId;
    delete createUser.createdAt;
    delete createUser.updatedAt;
    delete createUser.role.createdAt;
    delete createUser.role.updatedAt;
    delete createUser.role.id;
    delete createUser.role.defaultType;

    return createUser;
  }

  async sendEmail(
    id: string,
    username: string,
    email: string,
    createdAt: Date,
  ) {
    await this.userQueue.add({ id, username, email, createdAt });
    // {
    //   attempts: 50,
    //   removeOnComplete: true,
    //   removeOnFail: true,
    //   repeat: {
    //     every: 10000,
    //   },
    // },

    console.log('user created event sent to queue');
  }
}
