import { CapytaleRichTextEditor } from "@capytale/capytale-rich-text-editor";
import "@capytale/capytale-rich-text-editor/style.css";
import { Window } from "../features/windows/Window";


export function StatementWindow({
  statement,
  onMaximize,
  onDemaximize,
  onHide,
  ...props
}) {
  return (
    <Window
      windowTitle="Énoncé"
      aria-label="Énoncé"
      onMaximize={onMaximize}
      onDemaximize={onDemaximize}
      onHide={onHide}
      {...props}
    >
      <CapytaleRichTextEditor
        initialEditorState={statement ? statement : undefined}
        isEditable={false}
      />
    </Window>
  );
}
