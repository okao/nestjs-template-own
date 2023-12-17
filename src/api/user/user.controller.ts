import {
  Body,
  Controller,
  Get,
  HttpException,
  Inject,
  Post,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { UserService } from './user.service';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiHeader,
  ApiTags,
} from '@nestjs/swagger';
import { CreateUser } from '../../dtos/user.dto';
import { PrismaService } from 'src/service_modules/prisma/prisma.service';
import { RolesDecorator } from 'src/decorators/roles.decorator';
import { RolesEnum } from '../../dtos/user_and_role.enum';
import { AccessTokenGuard } from 'src/api/auth/guards/accessToken.guard';
import { RoleGuard } from '../auth/guards/roles.guard';
import { OnEvent } from '@nestjs/event-emitter';
import { UserCreatedEvent } from 'src/events/user-created.event';

@ApiHeader({
  name: 'User API',
  description: 'The user API description',
})
@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
  ) {}

  @Get('/me')
  @UseGuards(AccessTokenGuard)
  async getMe(@AuthUser() user: User): Promise<User> {
    try {
      return user;
    } catch (error) {
      throw new HttpException(
        {
          status: error.status,
          errors: {
            message: error.message,
          },
        },
        error.status,
      );
    }
  }

  @Post('create_user')
  @ApiCreatedResponse({
    description: 'User successfully logged in',
  })
  @ApiBody({
    type: CreateUser,
  })
  @UseGuards(AccessTokenGuard, RoleGuard)
  @RolesDecorator(RolesEnum.ADMIN)
  async createUser(@Body() createUserDto: CreateUser): Promise<User> {
    try {
      const user = await this.userService.createUser(createUserDto);
      return user;
    } catch (error) {
      throw new HttpException(
        {
          status: error?.status || 500,
          errors: {
            message: error?.message,
          },
        },
        error.status,
      );
    }
  }

  @OnEvent('user.created')
  handleUserCreatedEvent(payload: UserCreatedEvent) {
    console.log(
      'UserCreatedEvent',
      payload.id,
      payload.username,
      payload.email,
      payload.createdAt,
    );

    const { id, username, email, createdAt } = payload;

    //add this redis que to send email
    this.userService.sendEmail(id, username, email, createdAt);
  }
}
