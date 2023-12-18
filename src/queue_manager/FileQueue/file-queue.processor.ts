import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import {
  FILE_UPLOAD_QUEUE,
  IinitilQueue,
  QUEUE_MANAGER,
  SendEmailQueue,
} from '../queue.constants';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

@Processor(FILE_UPLOAD_QUEUE.name)
export class FileUploadProcessor extends WorkerHost {
  private readonly logger = new Logger(FileUploadProcessor.name);
  constructor() {
    super();
  }

  async process(job: Job<any, any, string>, token?: string): Promise<any> {
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 1000));
    this.logger.log(`============Started (${job.name})============`);
    this.logger.debug('Data: ', JSON.stringify(job.data));
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 1000));
    // this.logger.log(`Processing job ${job.id} of type ${job.name}`);

    if (job.name === 'processCsv') {
      return await this.processCsv(job, token);
    }
  }

  async processCsv(job: Job<any, any, string>, token?: string): Promise<any> {
    // do some stuff
    this.logger.log(`============OnExcution (${job.name})============`);
  }

  // async processCsv(job: Job<any, any, string>, token?: string): Promise<any> {
  // }

  @OnWorkerEvent('completed')
  async onCompleted(job: Job<any, any, string>) {
    // do some stuff
    this.logger.log(`============OnComplete (${job.name})============`);
  }

  @OnWorkerEvent('failed')
  async onFailed(job: Job<any, any, string>) {
    // do some stuff
    this.logger.log(`============OnFailed (${job.name})============`);
  }
}
