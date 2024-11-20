import { defaultValueCtx, Editor, rootCtx } from "@milkdown/kit/core";
import { nord } from "@milkdown/theme-nord";
import { useEditor } from "@milkdown/react";
import { commonmark } from "@milkdown/kit/preset/commonmark";
import { collab } from "@milkdown/plugin-collab";
import { block } from "@milkdown/kit/plugin/block";
import "@milkdown/theme-nord/style.css";
import {
  ReactPluginViewComponent,
  usePluginViewFactory,
} from "@prosemirror-adapter/react";
import { cursor } from "@milkdown/kit/plugin/cursor";

interface UseEditorConfigProps {
  initialMarkdown?: string;
  BlockView: ReactPluginViewComponent;
}

export const useEditorConfig = ({
  initialMarkdown = "# Hello World",
  BlockView,
}: UseEditorConfigProps) => {
  const pluginViewFactory = usePluginViewFactory();

  return useEditor((root) => {
    return Editor.make()
      .config((ctx) => {
        ctx.set(rootCtx, root);
        ctx.set(defaultValueCtx, initialMarkdown);
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
};
