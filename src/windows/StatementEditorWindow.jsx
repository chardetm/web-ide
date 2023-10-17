import { CapytaleRichTextEditor } from "@capytale/capytale-rich-text-editor";
import { MDCodeEditor } from "../features/code-editor/MDCodeEditor";
import { Window } from "../features/windows/Window";
import { appendClassnames } from "../utils";

import styles from "./StatementEditorWindow.module.scss";

export function StatementEditorWindow({
  className,
  onMaximize,
  onDemaximize,
  statement,
  onChange,
  onHide,
}) {
  return (
    <Window
      className={appendClassnames(styles.statementEditorWindow, className)}
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
