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
}) {
  return (
    <Window
      className={appendClassnames(styles.statementEditorWindow, className)}
      windowTitle="Éditeur d'énoncé"
      aria-label="Éditeur d'énoncé"
      onMaximize={onMaximize}
      onDemaximize={onDemaximize}
    >
      <MDCodeEditor
        className={styles.codeEditor}
        code={statement}
        onChange={onChange}
      />
    </Window>
  );
}
