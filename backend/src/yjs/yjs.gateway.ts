import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Request } from 'express';
import { Server } from 'ws';

// @ts-expect-error d.ts를 제공하지 않음
import { setupWSConnection } from 'y-websocket/bin/utils';

@WebSocketGateway({
  path: '/y-space',
  cors: {
    origin: ['http://localhost:8080', 'http://frontend:8080'],
    credentials: true,
  },
  transports: ['websocket'],
})
export class YjsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(connection: WebSocket, request: Request): void {
    const roomName = request.headers['room-name'] as string;
    if (!roomName) {
      throw new Error('Room name is required');
    }

    setupWSConnection(connection, request, { roomName });
  }

  handleDisconnect(): void {}
}
