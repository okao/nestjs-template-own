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
import { QueueService } from 'src/queue_manager/queue.service';
import {
  IinitilQueue,
  SendEmailQueue,
} from 'src/queue_manager/queue.constants';

@Injectable()
export class UserService {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
    private queueService: QueueService,
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
        roles: {
          create: [
            {
              role: {
                connect: {
                  name: role,
                },
              },
            },
          ],
        },
      },
      include: {
        roles: {
          select: {
            role: true,
          },
        },
      },
    });

    this.eventEmitter.emit('user.created', createUser);

    // this.queueService.addJob({
    //   name: IinitilQueue.name,
    //   data: {
    //     id: createUser.id,
    //     username: createUser.username,
    //     email: createUser.email,
    //     createdAt: createUser.createdAt,
    //   },
    // });

    //meaning attempt for 50 times for every 10 seconds
    //remove after complete
    this.queueService.addJob({
      name: SendEmailQueue.name,
      data: createUser,
      options: {
        delay: 9000,
        removeOnComplete: false,
        removeOnFail: false,
        attempts: 1,
      },
    });

    delete createUser.password;
    delete createUser.defaultAuthProviderId;
    delete createUser.statusId;
    delete createUser.createdAt;
    delete createUser.updatedAt;
    // delete createUser.role.createdAt;
    // delete createUser.role.updatedAt;
    // delete createUser.role.id;
    // delete createUser.role.defaultType;
    createUser.roles.map((role_delete) => {
      delete role_delete.role.createdAt;
      delete role_delete.role.updatedAt;
      delete role_delete.role.id;
      delete role_delete.role.defaultType;
      return role_delete;
    });

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
