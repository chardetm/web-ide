import React from "react";
import { appendClassnames } from "../../utils";
import { BaseWindow } from "./BaseWindow";

import { SectionProps } from "react-html-props";

import styles from "./style.module.scss";

export type WindowProps = {
    children?: React.ReactNode;
    windowTitle?: string;
    onHide?: () => void;
    onDemaximize?: () => void;
    onMaximize?: () => void;
    className?: string;
    icon?: string;
    props?: SectionProps;
};

export function Window({
  children,
  windowTitle = "",
  onHide,
  onDemaximize,
  onMaximize,
  className = null,
  icon = null,
  ...props
}: WindowProps) {
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
