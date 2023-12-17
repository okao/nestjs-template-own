import {
  Processor,
  OnQueueActive,
  Process,
  OnGlobalQueueCompleted,
  OnGlobalQueueError,
} from '@nestjs/bull';
import { Job } from 'bull';
import { USER_CREATED_QUEUE } from './consumer.constants';
import { Logger } from '@nestjs/common';

@Processor(USER_CREATED_QUEUE)
export class UserCreatedConsumer {
  private readonly logger = new Logger(UserCreatedConsumer.name);
  @Process()
  async userCreated(job: Job<unknown>) {
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 8000));
    this.logger.log(`Processing job ${job.id}`);
    this.logger.debug('Data: ', job.data);
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 8000));
    this.logger.log(`Completed job ${job.id}`);
    // this.logger.log(`Processing job ${job.id} of type ${job.name}`);
  }
}
