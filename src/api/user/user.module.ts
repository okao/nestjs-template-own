import { Global, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { BullModule } from '@nestjs/bull';
import { USER_CREATED_QUEUE } from './consumer.constants';
import { UserCreatedConsumer } from './user.processor';
// import { PrismaModule } from 'src/service_modules/prisma/prisma.module';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: USER_CREATED_QUEUE,
      // processors: [
      //   {
      //     name: 'user-created',
      //     path: join(__dirname, 'user.processor.js'),
      //   },
      // ],
    }),
  ],
  controllers: [UserController],
  providers: [UserService, UserCreatedConsumer],
})
export class UserModule {}
