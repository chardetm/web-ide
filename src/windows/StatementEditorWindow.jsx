import { CapytaleRichTextEditor } from "@capytale/capytale-rich-text-editor";
import { Window } from "../features/windows/Window";

export function StatementEditorWindow({
  className="",
  onMaximize,
  onDemaximize,
  statement,
  onChange,
  onHide,
}) {
  return (
    <Window
      className={className}
      windowTitle="Éditeur d'énoncé"
      aria-label="Éditeur d'énoncé"
      onMaximize={onMaximize}
      onDemaximize={onDemaximize}
      onHide={onHide}
    >
      <CapytaleRichTextEditor
        initialEditorState={statement ? statement : undefined}
        isEditable={true}
        onJsonChange={onChange}
      />
    </Window>
  );
}
