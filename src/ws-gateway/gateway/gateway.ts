import { WebSocketGateway } from '@nestjs/websockets';

@WebSocketGateway(parseInt(process.env.WS_PORT), {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class Gateway {}
