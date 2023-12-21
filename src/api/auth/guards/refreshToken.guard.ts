import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/service_modules/prisma/prisma.service';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private prismaservice: PrismaService,
  ) {}

  private logger = new Logger(RefreshTokenGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.logger.log('RefreshTokenGuard');
    const request = context.switchToHttp().getRequest();
    const refreshToken = request.cookies['andy-rft'];

    if (!refreshToken) {
      return false;
    }

    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.configService.get<string>('auth.refreshTokenSecret'),
    });

    let NewUser;

    //check if user exists in db and is active
    const userCheck = await this.prismaservice.user
      .findFirst({
        where: {
          id: payload?.id,
          status: {
            name: 'active',
          },
        },
        include: {
          status: true,
          roles: {
            select: {
              role: true,
            },
          },
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
        delete user.defaultAuthProviderId;
        delete user.createdAt;
        delete user.updatedAt;

        user.roles.map((role_delete) => {
          delete role_delete.role.createdAt;
          delete role_delete.role.updatedAt;
          delete role_delete.role.id;
          delete role_delete.role.defaultType;
          return role_delete;
        });

        NewUser = user;

        return NewUser;
      });

    if (!userCheck) {
      throw new UnauthorizedException();
    }

    request['user'] = userCheck;

    return true;

    // const user = await this.authService.validateRefreshToken(refreshToken);
    // if (user) {
    //   request.user = user;
    //   return true;
    // }
    return false;
  }
}
