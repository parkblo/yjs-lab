import { useEffect } from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { CollabService, collabServiceCtx } from "@milkdown/plugin-collab";
import { Editor } from "@milkdown/kit/core";
import { Ctx } from "@milkdown/kit/ctx";

interface UseCollabEditorProps {
  editor: Editor | null;
  websocketUrl: string;
  roomName: string;
}

export const useCollabEditor = ({
  editor,
  websocketUrl,
  roomName,
}: UseCollabEditorProps) => {
  useEffect(() => {
    if (!editor) return;

    const doc = new Y.Doc();
    const wsProvider = new WebsocketProvider(websocketUrl, roomName, doc, {
      connect: true,
    });

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
    editor.action((ctx: Ctx) => {
      collabService = ctx.get(collabServiceCtx);
      collabService.bindDoc(doc).setAwareness(wsProvider.awareness).connect();
    });

    return () => {
      collabService?.disconnect();
      wsProvider?.disconnect();
    };
  }, [editor, websocketUrl, roomName]);
};
