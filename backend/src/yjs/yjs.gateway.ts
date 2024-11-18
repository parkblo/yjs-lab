import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Request } from 'express';
import { Server } from 'ws';
import { setupWSConnection } from 'y-websocket/bin/utils';

@WebSocketGateway(3001)
export class YjsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor() {}

  @WebSocketServer()
  server: Server;

  handleConnection(connection: WebSocket, request: Request): void {
    console.log('connection start');

    const test = request.url.split('/').pop();
    if (test === '123') {
      setupWSConnection(connection, request, { docName: test });
    } else connection.close(1000, 'werwerwe');

    connection.addEventListener('message', (e) => {
      const data = e.data;
      console.log(`addEventListener: from client message: ${data}`);
    });
  }
  handleDisconnect(): void {
    console.log('connection end');
  }
}
