import { Global, Module } from '@nestjs/common';
import { RedisCacheService } from './redis-cache.service';
// import { RedisCacheResolver } from './redis-cache.resolver';

@Global()
@Module({
  // providers: [RedisCacheService, RedisCacheResolver],
  providers: [RedisCacheService],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}
