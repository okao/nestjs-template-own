import { InjectBullBoard, BullBoardInstance } from '@bull-board/nestjs';
import { InjectQueue } from '@nestjs/bullmq';
import {
  Controller,
  UploadedFile,
  UseInterceptors,
  Post,
  Get,
  Req,
} from '@nestjs/common';
import { FILE_UPLOAD_QUEUE } from './queue.constants';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Express } from 'express';
import { FileQueueService } from './FileQueue/file-queue.service';

@Controller('file-upload')
export class QueueController {
  constructor(
    @InjectQueue(FILE_UPLOAD_QUEUE.name) private readonly fileUploadQueue,
    @InjectBullBoard() private readonly bullBoard: BullBoardInstance,
    private readonly fileUploadService: FileQueueService,
  ) {}
  //add to the bull board
  async addJob() {
    await this.fileUploadQueue.add('file-upload', {
      name: 'file-upload',
      data: 'file-upload',
    });
  }

  //show the bull board
  async showBoard() {
    return this.bullBoard;
  }

  @Post('/uploadFile')
  @UseInterceptors(
    FileInterceptor('csv', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          return cb(null, `${randomName}${file.originalname}`);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File): Promise<any> {
    const uploadedFile = await this.fileUploadService.uploadFile(
      file.buffer,
      file.originalname,
    );

    console.log('File has been uploaded,', uploadedFile.fileName);
    // async uploadFile(@Req() req: any): Promise<any> {
    // const fileUploadQueue = await this.fileUploadQueue.add('file-upload', {
    //   name: 'file-upload',
    //   data: file,
    // });

    // // console.log('fileUploadQueue', 'Added to queue');

    // return 'Added to queue';

    // // console.log('file', file);

    return 'File has been uploaded';
  }

  @Get('/')
  async getHello(): Promise<any> {
    return 'Hello World';
  }
}
