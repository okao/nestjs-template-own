import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
// import { PrismaModule } from 'src/service_modules/prisma/prisma.module';

@Module({
  imports: [],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
