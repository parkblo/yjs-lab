import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Request } from 'express';
import { Server } from 'socket.io';
import { YSocketIO } from 'y-socket.io/dist/server';
import * as Y from 'yjs';
@WebSocketGateway(3001)
export class YjsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private ysocketio: YSocketIO;
  constructor() {}

  @WebSocketServer()
  server: Server;

  afterInit() {
    if (!this.server) {
      this.server = new Server();
    }

    this.ysocketio = new YSocketIO(this.server);
    this.ysocketio.on('', (doc: Y.Doc) => {
      const nodes = doc.getMap('nodes');
      const edges = doc.getMap('edges');
      const note = doc.getXmlFragment('note');

      note.observeDeep(() => {
        //이 부분은 text editor 코드 받아서 해보면 될 것 같다.
      });
      nodes.observe(() => {
        const nodes = Object.values(doc.getMap('nodes').toJSON);
        nodes.forEach((node) => {
          console.log(node);
          // 그냥 이대로 DB에 넣으면 되는거같다.
          // 전체 탐색하는 문제가 있는데 특정 ID가 변경되었을 때 변경되었음을 어떻게 알 수 있을까
        });
      });
      edges.observe(() => {
        const edges = Object.values(doc.getMap('edges').toJSON);
        edges.forEach((edge) => {
          console.log(edge);
          // 그냥 이대로 DB에 넣으면 되는거같다.
          // 전체 탐색하는 문제가 있는데 특정 ID가 변경되었을 때 변경되었음을 어떻게 알 수 있을까
        });
      });
    });
  }
  handleConnection() {
    console.log('연결 성공');
  }
  handleDisconnect() {
    console.log('연결 실패');
  }
}
