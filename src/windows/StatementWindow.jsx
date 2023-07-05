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
      <StatementWindowContent statement={statement} />
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
