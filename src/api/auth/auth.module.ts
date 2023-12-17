import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
// import { PrismaModule } from 'src/service_modules/prisma/prisma.module';
// import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';

@Global()
@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
