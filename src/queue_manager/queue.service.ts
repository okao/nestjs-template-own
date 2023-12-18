import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { QUEUE_MANAGER, QueueOptions } from './queue.constants';
import { BaseAdapter } from '@bull-board/api/dist/src/queueAdapters/base';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue(QUEUE_MANAGER.name) private readonly queue_manager,
  ) {}

  async addJob(queue: QueueOptions) {
    await this.queue_manager.add(queue.name, queue.data, queue?.options);
  }

  async getJob(job: string, id: string) {
    await this.queue_manager.getJob(job, id);
  }

  async getJobs(job: string) {
    await this.queue_manager.getJobs(job);
  }

  async getWaiting(job: string) {
    await this.queue_manager.getWaiting(job);
  }

  async getActive(job: string) {
    await this.queue_manager.getActive(job);
  }

  async getCompleted(job: string) {
    await this.queue_manager.getCompleted(job);
  }

  async getFailed(job: string) {
    await this.queue_manager.getFailed(job);
  }
}
