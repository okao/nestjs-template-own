import { Module, OnModuleInit } from '@nestjs/common';
import { Gateway } from './gateway';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@Module({
  imports: [Gateway],
})
export class GatewayModule implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server?.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);
    });
  }

  @SubscribeMessage('newMessage')
  onNewMessage(@MessageBody() payload: any) {
    console.log(payload);
    this.server?.emit('onMessage', {
      msg: 'Hello from server!',
      content: payload,
    });
  }
}
