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
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
// import { BullModule } from '@nestjs/bull';
// import { RedisCacheModule } from './redis-cache/redis-cache.module';
// import { forwardRef } from '@nestjs/common';
import { QueueModule } from './queue_manager/queue.module';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { BullModule } from '@nestjs/bullmq';
import { DrizzleModule } from './drizzle/drizzle.module';

@Module({
  imports: [
    // ThrottlerModule.forRoot([
    //   {
    //     name: 'auth',
    //     ttl: 60,
    //     limit: 10,
    //   },
    // ]),
    JwtModule.register({
      global: true,
    }),
    //for Queing jobs
    BullModule.forRootAsync({
      imports: [ConfigModule],
      // useFactory: async (configService: ConfigService) => ({
      //   global: true,
      //   redis: {
      //     host: await configService.get('redis.host'),
      //     port: await configService.get('redis.port'),
      //   },
      // }),
      useFactory: async (configService: ConfigService) => ({
        global: true,
        connection: {
          host: await configService.get('redis.host'),
          port: await configService.get('redis.port'),
        },
      }),
      inject: [ConfigService],
    }),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
    PrismaModule,
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
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
    QueueModule.register(),
    DrizzleModule,
    // QueueModule,
    // BullBoardModule.forRoot({
    //   route: '/queue',
    //   adapter: ExpressAdapter,
    // }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
