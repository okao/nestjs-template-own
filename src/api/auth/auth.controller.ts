import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiHeader,
  ApiParam,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { RefreshTokenType, SignIn } from '../../dtos/auth';
import { User } from '@prisma/client';
import { AccessTokenGuard } from './guards/accessToken.guard';
import { IncomingHttpHeaders } from 'http2';

type PassedUserAuth = {
  id: string;
  username: string;
  email: string;
};

@ApiHeader({
  name: 'Auth API',
  description: 'The auth API description',
})
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiCreatedResponse({
    description: 'User successfully logged in',
    type: SignIn,
  })
  @ApiBody({
    type: SignIn,
  })
  async auth(
    @Body() signin: { email: string; password: string; username: string },
  ): Promise<
    Readonly<{
      token: string;
      refreshToken: string;
      tokenExpiresIn: string;
      user: PassedUserAuth;
    }>
  > {
    const login = await this.authService.validateLogin(signin);
    return login;
  }

  //token refresh
  @Post('refresh')
  @ApiBody({
    type: RefreshTokenType,
  })
  @ApiCreatedResponse({
    description: 'Token successfully refreshed',
  })
  @ApiBearerAuth()
  @UseGuards(AccessTokenGuard)
  async refreshToken(
    @Req() req: { user: User },
    @Body() refreshToken: { refreshToken: string },
  ): Promise<
    Readonly<{
      token: string;
      refreshToken: string;
      tokenExpiresIn: string;
      user: PassedUserAuth;
    }>
  > {
    const refresh = await this.authService.refreshToken(
      req?.user?.id,
      refreshToken.refreshToken,
    );
    return refresh;
  }

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  @ApiBearerAuth()
  async logout(
    @Req() req: { user: User; headers: IncomingHttpHeaders },
  ): Promise<boolean> {
    //take bearer token from headers
    const tokenArray = req.headers?.authorization?.split(' ') ?? [];
    const token = tokenArray.length > 1 ? tokenArray[1] : null;

    if (!token) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            message: 'No token provided',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    await this.authService.logout(req?.user?.id, token);
    return true;
  }
}
