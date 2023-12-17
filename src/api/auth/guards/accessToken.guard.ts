import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Inject,
} from '@nestjs/common';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt } from 'passport-jwt';
import { RedisCacheService } from 'src/redis-cache/redis-cache.service';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { PrismaService } from 'src/service_modules/prisma/prisma.service';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    private prisma: PrismaService,
    // private redisCacheService: RedisCacheService,

    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('auth.accessTokenSecret'),
    });

    this.jwtService = jwtService;
    this.configService = configService;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = await this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('auth.accessTokenSecret'),
      });

      const getKeysPattern = `${payload?.id}:blacklist:accessToken*`;
      const blackListedUserTokens = [];
      for (const key of await this.cacheManager.store.keys(getKeysPattern)) {
        const value = await this.cacheManager.get(key);
        blackListedUserTokens.push(value);
      }

      if (blackListedUserTokens.includes(token)) {
        throw new UnauthorizedException();
      }

      let NewUser;

      //check if user exists in db and is active
      const userCheck = await this.prisma.user
        .findFirst({
          where: {
            id: payload?.id,
            status: {
              name: 'active',
            },
          },
          include: {
            status: true,
            role: true,
          },
        })
        .then((user) => {
          if (!user) {
            throw new UnauthorizedException();
          }

          delete user.password;
          delete user.status.createdAt;
          delete user.status.updatedAt;
          delete user.status.id;
          delete user.statusId;
          delete user.roleId;
          delete user.defaultAuthProviderId;
          delete user.createdAt;
          delete user.updatedAt;
          delete user.role.createdAt;
          delete user.role.updatedAt;
          delete user.role.id;
          delete user.role.defaultType;

          NewUser = user;

          return NewUser;
        });

      if (!userCheck) {
        throw new UnauthorizedException();
      }

      request['user'] = userCheck;

      return true;
    } catch (error) {
      // console.debug('error: ', error);
      // throw new UnauthorizedException();
      return false;
    }

    return false;
  }

  private async extractTokenFromHeader(
    request: Request,
  ): Promise<string | undefined> {
    const [type, token] = request.headers?.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
