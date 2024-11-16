/* eslint-disable @typescript-eslint/no-empty-function */
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

@WebSocketGateway({ path: '/y-space' })
export class YjsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor() {}

  @WebSocketServer()
  server: Server;

  handleConnection(connection: WebSocket, request: Request): void {
    // We can handle authentication of user like below

    // const token = getCookie(request?.headers?.cookie, 'auth_token');
    // const ERROR_CODE_WEBSOCKET_AUTH_FAILED = 4000;
    // if (!token) {
    //   connection.close(ERROR_CODE_WEBSOCKET_AUTH_FAILED);
    // } else {
    //   const signedJwt = this.authService.verifyToken(token);
    //   if (!signedJwt) connection.close(ERROR_CODE_WEBSOCKET_AUTH_FAILED);
    //   else {
    //     const docName = getCookie(request?.headers?.cookie, 'roomName');
    //     setupWSConnection(connection, request, { ...(docName && { docName }) });
    //   }
    // }

    // request.cookie는 undefined -> header에서 직접 cookie 추출
    const docName = Object.entries(request.headers)
      .filter(([key]) => key === 'spaceId')
      .map(([, v]) => v as string | undefined);

    if (!docName) {
      throw new Error('docname이 없음');
    }

    setupWSConnection(connection, request, { docName });
  }

  handleDisconnect(): void {}
}
