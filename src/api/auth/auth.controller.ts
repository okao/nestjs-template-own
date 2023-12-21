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
  Logger,
  Res,
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
import { RefreshTokenType, SignIn, SignUp } from '../../dtos/auth';
import { User } from '@prisma/client';
import { AccessTokenGuard } from './guards/accessToken.guard';
import { IncomingHttpHeaders } from 'http2';
import { Response } from 'express';
import { RefreshTokenGuard } from './guards/refreshToken.guard';

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

  private logger = new Logger(AuthController.name);

  @Post('login')
  @ApiCreatedResponse({
    description: 'User successfully logged in',
    type: SignIn,
  })
  @ApiBody({
    type: SignIn,
  })
  async auth(
    @Body() signin: SignIn,
    @Res() res: Response,
  ): Promise<// Readonly<{
  //   token: string;
  //   refreshToken: string;
  //   tokenExpiresIn: string;
  //   user: PassedUserAuth;
  // }>
  any> {
    const login = await this.authService.validateLogin(signin);
    //add refresh token to cookie
    //add refresh token to cookie
    res?.cookie('andy-rft', login.refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: 'none',
    });

    return res.json(login).status(HttpStatus.ACCEPTED).end();
  }

  //sign up
  @Post('register')
  @ApiCreatedResponse({
    description: 'User successfully signed up',
  })
  @ApiBody({
    type: SignUp,
  })
  async signup(@Body() signup: SignUp, @Res() res: Response): Promise<any> {
    const signupResult = await this.authService.validateSignup(signup);
    //add refresh token to cookie
    res?.cookie('andy-rft', signupResult.refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      sameSite: 'none',
    });
    return res.json(signupResult).status(HttpStatus.CREATED).end();
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
  @UseGuards(RefreshTokenGuard)
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
