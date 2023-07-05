import { React } from "react";
import { appendClassnames } from "../../utils";
import { BaseWindow } from "./BaseWindow";

import styles from "./style.module.scss";

export function Window({
  children,
  windowTitle = "",
  onHide,
  onDemaximize,
  onMaximize,
  className = null,
  icon = null,
  ...props
}) {
  return (
    <BaseWindow
      onHide={onHide}
      onDemaximize={onDemaximize}
      onMaximize={onMaximize}
      className={appendClassnames(styles.simpleWindow, className)}
      {...props}
    >
      <div className={`${styles.windowTitle} ${styles.simpleWindowTitle}`}>{windowTitle}</div>
      <div className={styles.simpleWindowContent}>{children}</div>
    </BaseWindow>
  );
}
