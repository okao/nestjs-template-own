import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { PrismaService } from 'src/service_modules/prisma/prisma.service';
import { Cache } from 'cache-manager';
import { SignIn } from './classes/auth';
import {
  HttpException,
  HttpStatus,
  Injectable,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
// import { RedisCacheService } from 'src/redis-cache/redis-cache.service';

@Injectable()
export class AuthService {
  private CacheKey = 'auth';
  private BlacklistCacheKey = 'authBlacklist';

  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private jwtService: JwtService,
    // private redisCacheService: RedisCacheService,
  ) {
    this.configService = configService;
    this.prisma = prisma;
    this.cacheManager = cacheManager;
    // this.redisCacheService = redisCacheService;
  }

  validateLogin = async (signin: SignIn) => {
    const user = await this.prisma.user.findFirst({
      where: {
        email: {
          contains: signin.email,
        },
      },
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'notFound',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const isValidPassword = await bcrypt.compare(
      signin.password,
      user.password,
    );

    //make user with only email, username, id
    const passedUser: { id: string; username: string; email: string } = {
      id: user?.id,
      username: user?.username,
      email: user?.email,
    };

    if (!isValidPassword) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            password: 'incorrectPassword',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    const { token, refreshToken, tokenExpiresIn, refreshTokenExpiresIn } =
      await this.getTokensData({
        id: user?.id,
      });

    return {
      token,
      refreshToken,
      tokenExpiresIn,
      user: passedUser,
    };
  };

  async refreshToken(userId: string, refreshTokenString: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'notFound',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    // const isValidRefreshToken = await bcrypt.compare(
    //   refreshToken,
    //   user.refreshToken,
    // );
    //get the refresh token from cache and compare it with the refresh token from the request
    // const cachedRefreshToken = await this.cacheManager.get<string>(
    //   `refreshToken:${user?.id}`,
    // );

    // const cachedRefreshToken = await this.redisCacheService.get(
    //   `refreshToken:${user?.id}`,
    // );

    // if (!cachedRefreshToken) {
    //   throw new UnauthorizedException();
    // }

    // console.log('cachedRefreshToken: ', cachedRefreshToken);
    // console.log('refreshTokenString: ', refreshTokenString);

    // //check if both refresh tokens are the same
    // if (cachedRefreshToken !== refreshTokenString) {
    //   throw new UnauthorizedException();
    // }
    // const isValidRefreshToken = await bcrypt.compare(
    //   refreshToken,
    //   cachedRefreshToken,
    // );

    // if (!isValidRefreshToken) {
    //   throw new UnauthorizedException();
    // }
    const { token, refreshToken, tokenExpiresIn, refreshTokenExpiresIn } =
      await this.getTokensData({
        id: user?.id,
      });

    //delete the refresh token from cache
    // await this.cacheManager.del(`refreshToken:${user?.id}`);

    //save the refresh token in cache
    // await this.cacheManager.set(
    //   `refreshToken:${user?.id}`,
    //   refreshToken,
    //   this.convertToSeconds(refreshTokenExpiresIn),
    // );

    const passedUser: { id: string; username: string; email: string } = {
      id: user?.id,
      username: user?.username,
      email: user?.email,
    };

    return {
      token,
      refreshToken,
      tokenExpiresIn,
      user: passedUser,
    };
  }

  logout = async (id: string, accessToken: string): Promise<boolean> => {
    const user = await this.prisma.user.findFirst({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new HttpException(
        {
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'notFound',
          },
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    //delete the refresh token from cache
    // await this.cacheManager.del(`refreshToken:${id}`);
    // const now = new Date();
    const tokenExpiresIn = (await this.configService.get<string>(
      'auth.accessTokenExpiresIn',
      {
        infer: true,
      },
    )) as string;

    const convertToMilli = this.convertToSeconds(tokenExpiresIn);

    const addString = `${user?.id}:blacklist:accessToken:${Date.now()}`;
    const getKeysPattern = `${user?.id}:blacklist:accessToken*`;
    await this.cacheManager.set(addString, accessToken, convertToMilli);

    // //look for all keys with prefix
    // for (const key of await this.cacheManager.store.keys(getKeysPattern)) {
    //   // console.log('key: ', key);
    //   const value = await this.cacheManager.get(key);
    //   console.log('value: ', value);
    // }

    //get all keys with prefix
    // console.log('getKeysPattern: ', getKeysPattern);
    // const allKeys = await this.cacheManager.store.keys(getKeysPattern);

    // console.log('allKeys: ', allKeys);

    return true;
  };

  private async getTokensData(data: { id: string }) {
    const { id } = data;

    const tokenExpiresIn = (await this.configService.get<string>(
      'auth.accessTokenExpiresIn',
      {
        infer: true,
      },
    )) as string;

    const refreshTokenExpiresIn = this.configService.get<string>(
      'auth.refreshTokenExpiresIn',
      {
        infer: true,
      },
    );

    const accessTokenSecret = this.configService.get<string>(
      'auth.accessTokenSecret',
      { infer: true },
    );
    const refreshTokenSecret = this.configService.get<string>(
      'auth.refreshTokenSecret',
      { infer: true },
    );
    const [token, refreshToken] = await Promise.all([
      this.generateToken(id, tokenExpiresIn, accessTokenSecret),
      this.generateToken(id, refreshTokenExpiresIn, refreshTokenSecret),
    ]);

    const refreshTokenExpiresInMilliSeconds = this.convertToSeconds(
      refreshTokenExpiresIn,
    );

    //save the refresh token in cache
    // await this.cacheManager.set(
    //   `refreshToken:${id}`,
    //   refreshToken,
    //   refreshTokenExpiresInMilliSeconds,
    // );

    return {
      token,
      refreshToken,
      tokenExpiresIn,
      refreshTokenExpiresIn,
    };
  }

  private async generateToken(
    id: string,
    expiresIn: string,
    secret: string,
  ): Promise<string> {
    const token = await this.jwtService.signAsync(
      {
        id: id,
      },
      {
        secret: secret,
        expiresIn: expiresIn,
      },
    );

    return token;
  }

  private convertToSeconds(tokenExpiresInString: string): number {
    const tokenExpiresInLastLetter = tokenExpiresInString.slice(-1);
    //take the other letters of tokenExpiresIn
    const tokenExpiresValue = tokenExpiresInString.slice(
      0,
      tokenExpiresInString.length - 1,
    );

    const tokenExpiresInLastLetterIsSeconds = tokenExpiresInLastLetter === 's';
    const tokenExpiresInLastLetterIsMinutes = tokenExpiresInLastLetter === 'm';
    const tokenExpiresInLastLetterIsHours = tokenExpiresInLastLetter === 'h';
    const tokenExpiresInLastLetterIsDays = tokenExpiresInLastLetter === 'd';
    const tokenExpiresInLastLetterIsWeeks = tokenExpiresInLastLetter === 'w';
    const tokenExpiresInLastLetterIsMonths = tokenExpiresInLastLetter === 'M';
    let tokenExpiresIn: number = 0;
    if (tokenExpiresInLastLetterIsSeconds) {
      tokenExpiresIn = parseInt(tokenExpiresValue);
    } else if (tokenExpiresInLastLetterIsMinutes) {
      //convert minutes to seconds
      tokenExpiresIn = parseInt(tokenExpiresValue) * 60;
    } else if (tokenExpiresInLastLetterIsHours) {
      //convert hours to seconds
      tokenExpiresIn = parseInt(tokenExpiresValue) * 60 * 60;
    } else if (tokenExpiresInLastLetterIsDays) {
      //convert days to seconds
      tokenExpiresIn = parseInt(tokenExpiresValue) * 60 * 60 * 24;
    } else if (tokenExpiresInLastLetterIsWeeks) {
      //convert weeks to seconds
      tokenExpiresIn = parseInt(tokenExpiresValue) * 60 * 60 * 24 * 7;
    } else if (tokenExpiresInLastLetterIsMonths) {
      //convert months to seconds
      tokenExpiresIn = parseInt(tokenExpiresValue) * 60 * 60 * 24 * 30;
    } else {
      tokenExpiresIn = parseInt(tokenExpiresInString);
    }

    return tokenExpiresIn * 1000;
  }
}
