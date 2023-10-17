import { CapytaleRichTextEditor } from "@capytale/capytale-rich-text-editor";
import "@capytale/capytale-rich-text-editor/style.css";
import { MarkdownViewer } from "../features/viewers/MarkdownViewer";
import { Window } from "../features/windows/Window";

import styles from "./StatementWindow.module.scss";

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

export function StatementWindowContent({ statement, ...props }) {
  return (
    <div className={styles.statementWindowContent} {...props}>
      <MarkdownViewer source={statement} allowHtml={true} />
    </div>
  );
}
