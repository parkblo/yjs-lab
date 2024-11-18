import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { create } from "zustand";

interface AwarenessUser {
  name: string;
  color: string;
  cursor?: { x: number; y: number };
}

interface AwarenessState {
  user: AwarenessUser;
}

export const createYDoc = (roomName: string) => {
  const ydoc = new Y.Doc();
  const provider = new WebsocketProvider(
    "ws://backend:3000/y-space",
    roomName,
    ydoc
  );

  const state: AwarenessState = {
    user: {
      name: `User-${Math.random().toString(36).slice(2, 7)}`,
      color: "#" + Math.floor(Math.random() * 16777215).toString(16),
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
