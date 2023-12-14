import { Controller, Get } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { ApiHeader } from '@nestjs/swagger';

@ApiHeader({
  name: 'Dashboard API',
  description: 'The dashboard API description',
})
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('hello')
  getHello(): string {
    return this.dashboardService.getHello();
  }
}
