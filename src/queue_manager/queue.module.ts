import {
  DynamicModule,
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { QueueService } from './queue.service';
// import { BullModule } from '@nestjs/bull';
import { FILE_UPLOAD_QUEUE, QUEUE_MANAGER } from './queue.constants';
import { ExpressAdapter } from '@bull-board/express';
import { QueueController } from './queue.controller';
import { BullModule } from '@nestjs/bullmq';
import { QueueProcessor } from './queue.processor';
import { FileUploadProcessor } from './FileQueue/file-queue.processor';
import { FileQueueService } from './FileQueue/file-queue.service';

@Global()
// @Module({
//   imports: [
//     BullModule.registerQueue({
//       name: QUEUE_MANAGER.name,
//     }),
//   ],
//   providers: [QueueService, QueueConsumer],
//   exports: [QueueService],
// })
@Module({
  controllers: [QueueController],
})
export class QueueModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath('/queues');

    consumer.apply(serverAdapter.getRouter()).forRoutes('/queues');
  }

  static register(): DynamicModule {
    const BullMqModule = BullModule.registerQueue({
      name: QUEUE_MANAGER.name,
    });
    const FileUploadQueue = BullModule.registerQueue({
      name: FILE_UPLOAD_QUEUE.name,
    });

    if (!BullMqModule.providers || !BullMqModule.exports) {
      throw new Error(
        'QueueManagerQueue.providers or QueueManagerQueue.exports is undefined',
      );
    }

    return {
      module: QueueModule,
      // module: QueueModule,
      imports: [BullMqModule, FileUploadQueue],
      controllers: [QueueController],
      // providers: [QueueService, QueueConsumer],
      providers: [
        QueueService,
        QueueProcessor,
        FileUploadProcessor,
        FileQueueService,
      ],
      exports: [QueueService],
      global: true,
    };
  }
}
