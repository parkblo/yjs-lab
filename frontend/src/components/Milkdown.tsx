import { defaultValueCtx, Editor, rootCtx } from "@milkdown/kit/core";
import { nord } from "@milkdown/theme-nord";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import { commonmark } from "@milkdown/kit/preset/commonmark";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { collab, collabServiceCtx } from "@milkdown/plugin-collab";
import { useEffect } from "react";

import "@milkdown/theme-nord/style.css";

const markdown = `
# hello world
마음대로 수정해보세요
`;

function MilkdownEditor() {
  // 에디터 기본 설정
  const { get } = useEditor((root) =>
    Editor.make()
      .config(nord)
      .config((ctx) => {
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, markdown);
      })
      .use(commonmark)
      .use(collab)
  );

  // collab 기능 연결
  useEffect(() => {
    const editor = get();
    if (editor) {
      const doc = new Y.Doc();
      const provider = new WebsocketProvider(
        "ws://localhost:3000/",
        "testroom",
        doc
      );

      editor.action((ctx) => {
        const collabService = ctx.get(collabServiceCtx);
        collabService.bindDoc(doc).setAwareness(provider.awareness).connect();
      });
    }
  }, [get]);

  return <Milkdown />;
}

function MilkdownEditorWrapper() {
  return (
    <MilkdownProvider>
      <MilkdownEditor />
    </MilkdownProvider>
  );
}

export default MilkdownEditorWrapper;
