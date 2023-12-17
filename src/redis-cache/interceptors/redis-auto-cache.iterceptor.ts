import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
// import { RedisCacheService } from '../redis-cache.service';

@Injectable()
export class RedisAutoCacheInterceptor implements NestInterceptor {
  constructor(
    private reflector: Reflector,
    // private redisCacheService: RedisCacheService,
    private readonly logger: Logger,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();

    const redisKey =
      this.reflector.get<string>('redisCacheKeyType', context.getHandler()) ??
      '';

    return next.handle().pipe(
      tap((data) => {
        const checkedRedisKey = redisKey['key'];
        const checkedData = redisKey['value'];
        const checkedTime = redisKey['time'];
        const checkedMain = redisKey['main'];
        const toRedisCache = {};
        let toRedisCacheKeyAppend = '';
        checkedData.forEach((key) => {
          //corresponding value in data
          //if arary key exists in data then set redis cache
          //if not exists then do nothing
          if (data[key]) {
            const value = data[key];
            toRedisCache[key] = value;

            //append key to redis cache key
            if (checkedMain == key) {
              toRedisCacheKeyAppend = `${checkedRedisKey}[${checkedMain}]-${value}`;
            }
          }
        });

        //add to redis cache
        //check if redis cache key is not empty
        // const checkedRedisCacheKeyExists = this.redisCacheService.get(
        //   toRedisCacheKeyAppend,
        // );
        // if (checkedRedisCacheKeyExists) {
        //   //delete redis cache key
        //   this.redisCacheService.del(toRedisCacheKeyAppend);
        //   //and now set new redis cache key
        //   this.redisCacheService.set(
        //     toRedisCacheKeyAppend,
        //     toRedisCache,
        //     checkedTime,
        //   );
        // } else {
        //   //set new redis cache key
        //   // this.redisCacheService.set(
        //   //   toRedisCacheKeyAppend,
        //   //   toRedisCache,
        //   //   checkedTime,
        //   // );
        // }

        // console.log("Total-Excution-Time: ", `${Date.now() - now}ms`);
        this.logger.log(`Total-Excution-Time: ${Date.now() - now}ms`);
        return;
        ({
          data,
          statusCode: context.switchToHttp().getResponse().statusCode,
          message: `FromRedisCache: ${toRedisCacheKeyAppend}`,
        });
      }),
    );
  }
}
