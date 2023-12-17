import {
  Controller,
  Get,
  HttpException,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { ApiHeader, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AccessTokenGuard } from 'src/api/auth/guards/accessToken.guard';
import { UserService } from './user.service';
import { AuthUser } from 'src/decorators/auth-user.decorator';
import { UserResponse } from './class/response.class';

@ApiHeader({
  name: 'User API',
  description: 'The user API description',
})
@ApiTags('user')
@ApiBearerAuth()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
}
