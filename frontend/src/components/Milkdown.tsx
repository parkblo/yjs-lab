import { defaultValueCtx, Editor, rootCtx } from "@milkdown/kit/core";
import { nord } from "@milkdown/theme-nord";
import { Milkdown, MilkdownProvider, useEditor } from "@milkdown/react";
import { commonmark } from "@milkdown/kit/preset/commonmark";

import "@milkdown/theme-nord/style.css";

const markdown = `
# hello world
마음대로 수정해보세요
`;

function MilkdownEditor() {
  useEditor((root) => {
    return Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, markdown);
      })
      .config(nord)
      .use(commonmark);
  }, []);

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
