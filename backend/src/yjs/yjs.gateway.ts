import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Request } from 'express';
import { Server } from 'ws';
// @ts-expect-error
import { setupWSConnection } from 'y-websocket/bin/utils';
import { getCookie } from 'src/common/utils/cookie.util';
import { Logger } from 'winston';

@WebSocketGateway({ path: '/yjs' })
export class YjsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor() {}

  @WebSocketServer()
  server: Server;

  handleConnection(connection: WebSocket, request: Request): void {
    Logger.log('connection start');

    const docName = getCookie(request?.headers?.cookie, 'roomName');
    setupWSConnection(connection, request, { ...(docName && { docName }) });
  }

  handleDisconnect(): void {
    Logger.log('connection end');
  }
}
