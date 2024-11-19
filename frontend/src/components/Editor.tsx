import { defaultValueCtx, Editor, rootCtx } from "@milkdown/kit/core";
import { nord } from "@milkdown/theme-nord";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import { commonmark } from "@milkdown/kit/preset/commonmark";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { collab, collabServiceCtx } from "@milkdown/plugin-collab";
import { useEffect } from "react";
import { block } from "@milkdown/kit/plugin/block";

import "@milkdown/theme-nord/style.css";
import { BlockView } from "./Block";
import {
  ProsemirrorAdapterProvider,
  usePluginViewFactory,
} from "@prosemirror-adapter/react";
import { cursor } from "@milkdown/kit/plugin/cursor";

const markdown = "blah";

function MilkdownEditor() {
  // 에디터 기본 설정
  const pluginViewFactory = usePluginViewFactory();

  const { loading, get } = useEditor((root) => {
    return Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, markdown);
        ctx.set(block.key, {
          view: pluginViewFactory({
            component: BlockView,
          }),
        });
      })
      .config(nord)
      .use(commonmark)
      .use(block)
      .use(cursor)
      .use(collab);
  }, []);

  // collab 기능 연결
  useEffect(() => {
    if (loading) return;

    const editor = get();
    if (!editor) return;

    const doc = new Y.Doc();
    const provider = new WebsocketProvider(
      "ws://localhost:3000/",
      "ytest",
      doc
    );

    // editor.action((ctx) => {
    //   const collabService = ctx.get(collabServiceCtx);
    //   collabService.bindDoc(doc).setAwareness(provider.awareness).connect();
    // });

    return () => {
      provider.destroy();
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
