import { Injectable } from '@nestjs/common';

@Injectable()
export class FileQueueService {
  async uploadFile(dataBuffer: Buffer, fileName: string): Promise<any> {
    //after upload file to s3, we can do something here
    return { dataBuffer, fileName };
  }
}
