import { Injectable, Global, Inject, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class RedisCacheService implements OnModuleDestroy {
  // private PREFIX = this.configService.get<string>('redis.prefix');
  // @Inject(REDIS_CONNECTION)
  // protected connection: REDIS_CONNECTION;

  constructor(
    // @Inject('RedisClient') private readonly redisClient: Redis,
    private configService: ConfigService,
  ) {
    // @Inject('RedisClient') private readonly redisClient: Redis, // private configService: ConfigService,
    // this.configService = configService;
    // this.redisClient = new Redis({
    //   host: this.configService.get<string>('redis.host'),
    //   port: this.configService.get<number>('redis.port'),
    //   // password: this.configService.get<string>('redis.password'),
    // });
    // this.connection = new Redis({
    //   host: this.configService.get<string>('redis.host'),
    //   port: this.configService.get<number>('redis.port'),
    //   // password: this.configService.get<string>('redis.password'),
    // });
    // th;
  }

  onModuleDestroy() {
    throw new Error('Method not implemented.');
  }

  async get(prefix: string, key: string): Promise<string | null> {
    // return this.redisClient.get(`${prefix}:${key}`);
    return;
  }

  async set(prefix: string, key: string, value: string): Promise<void> {
    // await this.redisClient.set(`${prefix}:${key}`, value);
    return;
  }

  async del(prefix: string, key: string): Promise<void> {
    // await this.redisClient.del(`${prefix}:${key}`);
    return;
  }

  async setWithExpiry(
    prefix: string,
    key: string,
    value: string,
    expiry: number,
  ): Promise<void> {
    // await this.redisClient.set(`${prefix}:${key}`, value, 'EX', expiry);
    return;
  }

  // async get(key): Promise<any> {
  //   const client = await this.connect();
  //   const valueJSON = await client.get(`${this.PREFIX}:${key}`);
  //   const value = this.parseWithDate(valueJSON);
  //   client.quit();
  //   return value;
  // }

  // async set(key, value, ttl) {
  //   const client = await this.connect();
  //   const valueJSON = JSON.stringify(value);
  //   await client.set(`${this.PREFIX}:${key}`, valueJSON, { EX: ttl });
  //   client.quit();
  // }

  // async set(key, value, ttl = 60) {
  //   try {
  //     const valueJSON = JSON.stringify(value);
  //     await this.redisClient.zadd(`${this.PREFIX}:${key}`, valueJSON, ttl);
  //     // this.redisClient.disconnect();

  //     return true;
  //   } catch (error) {
  //     console.log('error: ', error);
  //   }
  // }

  // async get(key) {
  //   const valueJSON = await this.redisClient.zrange(
  //     `${this.PREFIX}:${key}`,
  //     0,
  //     -1,
  //   );
  //   const value = this.parseWithDate(valueJSON);
  //   this.redisClient.disconnect();
  //   return value;
  // }

  // //del
  // async del(key) {
  //   await this.redisClient.del(`${this.PREFIX}:${key}`);
  //   this.redisClient.disconnect();
  // }

  // async setFor10Sec(key, value) {
  //   await this.set(key, value, 10);
  // }

  // async setForDay(key, value) {
  //   const secondsInDay = 24 * 60 * 60;
  //   await this.set(key, value, secondsInDay);
  // }

  // async setForMonth(key, value) {
  //   const secondsInMonth = 30 * 24 * 60 * 60;
  //   await this.set(key, value, secondsInMonth);
  // }

  // async setInMinutes(key, value, minutes) {
  //   const seconds = minutes * 60;
  //   await this.set(key, value, seconds);
  // }

  // async getKeys() {
  //   const client = await this.connect();
  //   const keysWithPrefix = await client.keys(`${this.PREFIX}:*`);
  //   client.quit();
  //   return keysWithPrefix.map((k) => k.split(`${this.PREFIX}:`)[1]);
  // }

  // async getKeysPattern(pattern: string) {
  //   const client = await this.connect();
  //   const keysWithPrefix = await client.keys(`${this.PREFIX}:${pattern}`);
  //   client.quit();
  //   return keysWithPrefix.map((k) => k.split(`${this.PREFIX}:`)[1]);
  // }

  // async getKeysWithPrefix() {
  //   const client = await this.connect();
  //   const keysWithPrefix = await client.keys(`${this.PREFIX}:*`);
  //   client.quit();
  //   return keysWithPrefix;
  // }

  // async getWithPrefixPattern(pattern_key: string) {
  //   const client = await this.connect();
  //   const valueJSON = await client.keys(`${this.PREFIX}:*`);
  //   // console.log('valueJSON: ', valueJSON);
  //   const allValues = [] as any[];

  //   //split keys by ':' and get the second last element
  //   for (const key of valueJSON) {
  //     try {
  //       const splitedKey = key.split(':');
  //       if (splitedKey.length < 2) {
  //         continue;
  //       }
  //       const lastElement = splitedKey[splitedKey.length - 2];

  //       // console.log('pattern_key: ', pattern_key);
  //       // console.log('lastElement: ', lastElement);

  //       if (pattern_key !== lastElement) {
  //         continue;
  //       }

  //       const valueJSONString = (await client.get(key)) as string;
  //       // console.log('valueJSONString: ', valueJSONString);
  //       //remove " from valueJSONString"
  //       // const valueJSONStringRemoved = valueJSONString.slice(
  //       //   1,
  //       //   valueJSONString.length - 1,
  //       // );
  //       // const valueJSON = JSON.parse(`{
  //       //   key: ${key},
  //       //   value: ${valueJSONString},
  //       // }`);

  //       // console.log('valueJSON: ', valueJSON);

  //       // const value = this.parseWithDate(valueJSON);

  //       // console.log('valueJSON: ', value);
  //       allValues.push(valueJSONString);
  //     } catch (error) {
  //       // console.log('error: ', error);
  //       continue;
  //     }
  //   }
  //   // const value = this.parseWithDate(valueJSON);
  //   // console.log('valueJSON: ', value);
  //   client.quit();
  //   return allValues;
  // }

  // async del(key) {
  //   const client = await this.connect();
  //   await client.del(`${this.PREFIX}:${key}`);
  //   client.quit();
  // }

  // async delPattern(pattern: string) {
  //   const keys = await this.getKeysPattern(pattern);
  //   for (const key of keys) {
  //     await this.del(key);
  //   }
  // }

  // async deleteAll() {
  //   const keys = await this.getKeys();
  //   keys.forEach(async (key) => {
  //     await this.del(key);
  //   });
  //   console.log('Redis cache flushed.');
  // }

  // async seachKeys(pattern: string) {
  //   const client = await this.connect();
  //   const keysWithPrefix = await client.keys(`${this.PREFIX}:${pattern}`);
  //   client.quit();
  //   return keysWithPrefix;
  // }
}
