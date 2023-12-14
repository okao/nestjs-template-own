import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { SettingService } from './setting.service';
import { CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import { ApiCreatedResponse, ApiHeader } from '@nestjs/swagger';
import { SiteSetting } from '../dashboard/classes';

@ApiHeader({
  name: 'Setting API',
  description: 'The setting API description',
})
@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  @Get('/')
  @ApiCreatedResponse({
    description: 'The settings has been successfully returned.',
    type: [SiteSetting],
  })
  async getSettings(): Promise<SiteSetting[]> {
    try {
      return await this.settingService.getSettings();
    } catch (error) {
      Error(error);
    }
  }

  @Get('/test-cache-normal')
  async testCache(): Promise<any> {
    //logi to check request time taken
    const start = Date.now();
    const response = await this.settingService.testNotmalCache();
    const end = Date.now();

    console.log('Time taken: ', (end - start) / 1000, ' seconds');

    return response;
  }

  @Get('/test-cache-interceptor')
  @UseInterceptors(CacheInterceptor)
  @CacheKey('github_data') // override default cache key
  @CacheTTL(60000) // override default TTL value
  async testCacheInterceptor(): Promise<any> {
    //logi to check request time taken
    const start = Date.now();
    const response = await this.settingService.testCacheInterceptor();
    const end = Date.now();

    console.log('Time taken: ', (end - start) / 1000, ' seconds');

    return response;
  }
}
