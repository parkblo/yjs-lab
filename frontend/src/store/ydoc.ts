import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { create } from "zustand";
import { v4 as uuid } from "uuid";
import { mockData } from "./mock.data";

// ->type parentNodeId = uuid;
// SharedContextTree >SharedSpace > Edge, Node
interface AwarenessUser {
  name: string;
  color: string;
  cursor?: { x: number; y: number };
}
interface AwarenessState {
  user: AwarenessUser;
}
// [*] Awareness -> (같은 방에 있는) 연결된 사람마다 가진 개인 상태 정보
// [-] YDoc -> 공동으로 편집되어야 하는 문서정보

// type Node = {
//   id: string;
//   pointX: number;
//   pointY: number;
//   type: "note" | "url" | "image" | "subspace";
// };

/*
Y.doc {
  "context": Y.Map  {
    "SpaceId": string
    "parentContextId": string
    "nodes": Y.Array [
      object { pointX, pointY, id, type },
      object { pointX, pointY, id, type },
      ...
    ]
    "edges": Y.Array [
      object { from: uuid, to: uuid },
      object { from: uuid, to: uuid },
      ...
    ]
  }
}
*/

// TODO: REST API 통해서 최초 데이터 받아오기 -> data
export const createYDoc = (roomName: string, data: any) => {
  const ydoc = new Y.Doc();
  const yContext = ydoc.getMap("context");
  const yNodes = new Y.Array();
  const yEdges = new Y.Array();
  yContext.set("nodes", yNodes);
  yContext.set("edge", yEdges);
  yNodes.push(data.nodes);
  yEdges.push(data.edges);

  // TODO: Context ID 관련 처리

  const provider = new WebsocketProvider("ws://backend:3001", roomName, ydoc);
  const state: AwarenessState = {
    user: {
      name: uuid(),
      color: "#" + Math.floor(Math.random() * 0xfffff).toString(16),
      cursor: { x: 0, y: 0 },
    },
  };

  provider.awareness.setLocalState(state);

  return { ydoc, provider };
};

type YDocStoreState = {
  ydoc: Y.Doc;
  provider: WebsocketProvider;
};

type YDocStoreActions = {
  // initYDoc: (roomName: string) => void;
  destroyConnection: () => void;
};

const defaultYDoc = createYDoc("default-room", mockData);

export const useYDocStore = create<YDocStoreState & YDocStoreActions>(() => ({
  ydoc: defaultYDoc.ydoc,
  provider: defaultYDoc.provider,

  destroyConnection: () => {
    const { provider } = useYDocStore.getState();
    provider.destroy();
  },
}));
