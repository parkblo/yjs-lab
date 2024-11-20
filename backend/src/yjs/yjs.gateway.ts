import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Request } from 'express';
import { Server } from 'ws';
import { setupWSConnection } from 'y-websocket/bin/utils';
import * as Y from 'yjs';
@WebSocketGateway(3001)
export class YjsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor() {}

  @WebSocketServer()
  server: Server;

  async handleConnection(connection: WebSocket, request: Request) {
    console.log('connection start');

    const urlParts = request.url.split('/');
    const urlType = urlParts[urlParts.length - 2];
    const id = urlParts[urlParts.length - 1];

    console.log(`type is ${urlType} urlId is ${id}`);
    if ((urlType !== 'space' && urlType !== 'note') || id !== '123') {
      console.log(`invalid`);
      connection.close();
      return;
    }

    console.log(`valid`);
    let initializeData;
    if (urlType === `space`) {
      initializeData = initializeByTree(id);
    } else {
      initializeData = initializeByNote(id);
    }
    connection.send(initializeData);
    setupWSConnection(connection, request, {
      docName: id,
    });
  }

  handleDisconnect(client: any) {}
}

function initializeByTree(roomName: string) {
  let ydoc = new Y.Doc();
  const ySpace = ydoc.getMap('space');
  ySpace.set('contextNode1', {
    id: 'node1',
    parent: null,
    nodes: [],
    edges: [],
  });
  return Y.encodeStateAsUpdate(ydoc);
}
function initializeByNote(roomName: string) {
  let ydoc = new Y.Doc();
  return Y.encodeStateAsUpdate(ydoc);
}
function saveUpdateToDatabase(docName: string, update: Uint8Array) {
  Buffer.from(update);
}

function getUpdatesFromDatabase(docName: string) {
  return [];
}
function loadDocumentFromDatabase(docName: string) {}
