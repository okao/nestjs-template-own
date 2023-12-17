import { Module } from '@nestjs/common';
import { DashboardModule } from './api/dashboard/dashboard.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SettingModule } from './api/setting/setting.module';
import configuration from './config/configuration';
import { RouterModule } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';
import { GatewayModule } from './ws-gateway/gateway/gateway.module';
// import * as redisStore from 'cache-manager-redis-store';
import * as redisStore from 'cache-manager-redis-store';
import { AuthModule } from './api/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './api/user/user.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './service_modules/prisma/prisma.module';
// import { RedisCacheModule } from './redis-cache/redis-cache.module';
// import { forwardRef } from '@nestjs/common';

@Module({
  imports: [
    ThrottlerModule.forRoot(),
    JwtModule.register({
      global: true,
    }),
    PrismaModule,
    // CacheModule.register({
    //   isGlobal: true,
    //   store: redisStore,
    //   host: process.env.REDIS_HOST,
    //   port: process.env.REDIS_PORT,
    // }),
    // RedisCacheModule,
    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        isGlobal: true,
        store: redisStore,
        host: await configService.get('redis.host'),
        port: await configService.get('redis.port'),
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
      load: [configuration],
    }),
    RouterModule.register([
      {
        path: 'dashboard',
        module: DashboardModule,
        children: [
          {
            path: 'setting',
            module: SettingModule,
          },
        ],
      },
    ]),
    UserModule,
    AuthModule,
    DashboardModule,
    SettingModule,
    GatewayModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
