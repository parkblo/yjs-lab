import * as Y from "yjs";

export type Node = {
  id: string;
  pointX: number;
  pointY: number;
  type: "note" | "url" | "image" | "subspace";
};

export type Edge = {
  from: Node["id"];
  to: Node["id"];
};

export type SharedSpace = /* Y.Map */ {
  contextId: string;
  parentContextId: string;
  edges: Y.Array<Edge>;
  nodes: Y.Array<Node>;
};
