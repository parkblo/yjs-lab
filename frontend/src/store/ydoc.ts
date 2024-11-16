import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { create } from "zustand";

const doc = new Y.Doc();
const provider = new WebsocketProvider("ws://localhost:3000/", "y-space", doc);

//

type YDocStoreState = { doc: Y.Doc; provider: WebsocketProvider };

type YDocStoreActions = {};

const defaultYDocStoreState = {
  doc,
  provider,
} satisfies YDocStoreState;

export const useYDocStore = create<YDocStoreState & YDocStoreActions>(() => ({
  ...defaultYDocStoreState,
}));
