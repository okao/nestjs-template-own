import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/service_modules/prisma/prisma.service';
import { Cache } from 'cache-manager';

@Injectable()
export class SettingService {
  constructor(
    private prisma: PrismaService,
    // @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getSettings() {
    const settings = await this.prisma.siteSetting.findMany({
      select: {
        id: false,
        name: true,
        value: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return settings;
  }

  async testNotmalCache() {
    // const cachedData = await this.cacheManager.get('github_data');
    // console.log('cachedData: ', cachedData);
    // if (cachedData) {
    //   return cachedData;
    // }

    const response = await fetch('https://api.github.com/users/okao');
    const data = await response.json();

    // await this.cacheManager.set('github_data', data);

    //sleep for 3 seconds
    await new Promise((resolve) => setTimeout(resolve, 3000));

    return data;
  }

  async testCacheInterceptor() {
    const response = await fetch('https://api.github.com/users/okao');
    const data = await response.json();

    //sleep for 3 seconds
    await new Promise((resolve) => setTimeout(resolve, 3000));

    return data;
  }
}
