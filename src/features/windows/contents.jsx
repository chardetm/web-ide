import { appendClassnames } from "../../utils";
import styles from "./style.module.scss";

export function Toolbar({ children }) {
  return <div className={styles.toolbar}>{children}</div>;
}

export function ToolbarAddressBar({ children }) {
  return <div className={styles.toolbarAddressBar}>{children}</div>;
}

export function WindowContent({ children, className, ...props }) {
  return (
    <div
      className={appendClassnames(styles.windowContent, className)}
      {...props}
    >
      {children}
    </div>
  );
}
