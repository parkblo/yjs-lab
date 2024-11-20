import { Milkdown, MilkdownProvider } from "@milkdown/react";
import "@milkdown/theme-nord/style.css";
import { BlockView } from "./Block";
import { ProsemirrorAdapterProvider } from "@prosemirror-adapter/react";
import { useEditorConfig } from "../hooks/useEditorConfig";
import { useCollabEditor } from "../hooks/useCollabEditor";

function MilkdownEditor() {
  const { loading, get } = useEditorConfig({
    BlockView,
    initialMarkdown: "# Milkdown Test",
  });

  useCollabEditor({
    editor: loading ? null : get() || null,
    websocketUrl: "wss://demos.yjs.dev/ws",
    roomName: "milkdown",
  });

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
