import { Milkdown, MilkdownProvider } from "@milkdown/react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { CollabService, collabServiceCtx } from "@milkdown/plugin-collab";
import { useEffect } from "react";
import "@milkdown/theme-nord/style.css";
import { BlockView } from "./Block";
import { ProsemirrorAdapterProvider } from "@prosemirror-adapter/react";
import { useEditorConfig } from "../hooks/useEditorConfig";

function MilkdownEditor() {
  // 에디터 기본 설정
  const { loading, get } = useEditorConfig({
    BlockView,
    initialMarkdown: "# Milkdown Test",
  });

  // collab 기능 연결
  useEffect(() => {
    if (loading) return;

    const editor = get();
    if (!editor) return;

    const doc = new Y.Doc();
    const wsProvider = new WebsocketProvider(
      "wss://demos.yjs.dev/ws",
      "milkdown",
      doc,
      { connect: true }
    );

    wsProvider.once("synced", async (isSynced: boolean) => {
      if (isSynced) {
        console.log("성공적으로 연결됨: " + wsProvider.url);
      }
    });

    /*NOTE - websocket 연결 상태를 가져와서 다룰 수 있음.
    paylod.status
    connecting: WebSocket 서버에 연결 시도 중
    connected: 서버와 연결됨
    disconnected: 서버와 연결이 끊어짐
    syncing: 다른 클라이언트와 데이터 동기화 중
    synced: 모든 클라이언트와 데이터가 동기화됨
    */
    // wsProvider.on("status", (payload: { status: string }) => {
    //   // ex) this.doms.status.textContent = payload.status;
    // });

    let collabService: CollabService;
    editor.action((ctx) => {
      collabService = ctx.get(collabServiceCtx);
      collabService.bindDoc(doc).setAwareness(wsProvider.awareness).connect();
    });

    return () => {
      collabService?.disconnect();
      wsProvider?.disconnect();
    };
  }, [loading]);

  return <Milkdown />;
}

function MilkdownEditorWrapper() {
  return (
    <MilkdownProvider>
      <ProsemirrorAdapterProvider>
        <MilkdownEditor />
      </ProsemirrorAdapterProvider>
    </MilkdownProvider>
  );
}

export default MilkdownEditorWrapper;
