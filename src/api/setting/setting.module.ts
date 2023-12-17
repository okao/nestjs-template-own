import { Module } from '@nestjs/common';
import { SettingController } from './setting.controller';
import { SettingService } from './setting.service';
// import { PrismaModule } from 'src/service_modules/prisma/prisma.module';

@Module({
  imports: [],
  controllers: [SettingController],
  providers: [SettingService],
})
export class SettingModule {}
