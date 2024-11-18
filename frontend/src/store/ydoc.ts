import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { create } from "zustand";

/**
 * 
interface Space {
	parent: string;
  id: string;
  edges: Edge[];
  nodes: Node[];
  rootNodeId: Node["id"];
}

interface Node {
  id: string;
  pointX: number;
  pointY: number;
  type: "note" | "url" | "image" | "subspace";
}

interface Edge {
  from: Node["id"];
  to: Node["id"];
}

interface Content {
  nodeId: Node["id"];
  type: "path" | "raw" | "space";
  data: string;
} */

// ContextTree Y.array(Y.map, Y.map)
// y.map의 key가 'parentNode'고 value가 space 객체인데
// space 객체는 Y.array로 되어있어서
// Y.array 안에는 또 Y.array가 또 있어서
// edge, nodes
// https://github.com/yjs/yjs/issues/106
// Space => (HeadNode)
// Head(1) < View Sub Space(2) < View (3)
// Context Tree의 Node가 되는 대상 => {  }

// patch => Y.Array
// put  => string => nodeName, nodeId

type Edge = { from:string, to:string }; // JSON
type Node{
  id: string,
  pointX:number,  
  pointY:number,
  type: "note" | "url" | "image" | "subspace";
}
type SharedSpace = {
  edges: Y.Array<Edge>; 
  nodes: Y.Array<Node>; 
};
 // ->type parentNodeId = uuid;
type SharedContextTree = Y.Map<parentContextId, ShardSpace>; 

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

export const createYDoc = (roomName: string) => {
  const ydoc = new Y.Doc();
  const provider = new WebsocketProvider("ws://backend:3001", roomName, ydoc);
  const state: AwarenessState = {};

  provider.awareness.setLocalState(state);

  return { ydoc, provider };
};

type YDocStoreState = {
  ydoc: Y.Doc;
  provider: WebsocketProvider;
};

type YDocStoreActions = {
  initYDoc: (roomName: string) => void;
  destroyConnection: () => void;
};

const defaultYDoc = createYDoc("default-room");

export const useYDocStore = create<YDocStoreState & YDocStoreActions>(
  (set) => ({
    ydoc: defaultYDoc.ydoc,
    provider: defaultYDoc.provider,

    initYDoc: (roomName: string) => {
      const currentState = useYDocStore.getState();
      currentState.provider.destroy();

      const { ydoc, provider } = createYDoc(roomName);
      set({ ydoc, provider });
    },

    destroyConnection: () => {
      const { provider } = useYDocStore.getState();
      provider.destroy();
    },
  })
);
