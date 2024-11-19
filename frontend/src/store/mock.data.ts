import * as Y from "yjs";
import type { SharedSpace, Edge, Node } from "./types";
const yEdges = new Y.Array<Edge>();
const yNodes = new Y.Array<Node>();

const mockEdge1: Edge = {
  from: "node1",
  to: "node2",
};

const mockEdge2: Edge = {
  from: "context-space-1234",
  to: "node2",
};

const mockNodeBySubspace: Node = {
  id: "node1",
  pointX: 50,
  pointY: 50,
  type: "subspace",
};
const mockNodeA: Node = {
  id: "node1",
  pointX: 50,
  pointY: 50,
  type: "note",
};
const mockNodeB: Node = {
  id: "node2",
  pointX: -50,
  pointY: -50,
  type: "note",
};
yEdges.push([mockEdge1, mockEdge2]);
yNodes.push([mockNodeA, mockNodeB, mockNodeBySubspace]);
export const mockData: SharedSpace = {
  contextId: "context-space-1234",
  parentContextId: "context-space-1234-1234",
  edges: yEdges,
  nodes: yNodes,
};
