import { WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway(8080, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  // transports: ['websocket'],
})
export class Gateway {}
