import styles from "./style.module.scss";
import { React } from "react";
import { BasicButton } from "../ui/basicComponents";
import { MaterialIcon, RoundedButton } from "../ui/materialComponents";
import { appendClassnames } from "../../utils";

export function WindowButton({ children, ...props }) {
  return (
    <BasicButton className={styles.windowButton} {...props}>
      {children}
    </BasicButton>
  );
}

export function BaseWindow({
  children,
  onHide,
  onDemaximize,
  onMaximize,
  className,
  ...props
}) {
  return (
    <section
      className={appendClassnames(styles.window, className)}
      is-maximized={onDemaximize ? "true" : "false"}
      {...props}
    >
      {children}
      <div className={styles.windowControls}>
        {onHide && (
          <RoundedButton
            className={styles.addTabButton}
            icon={<MaterialIcon.Rounded name="minimize" />}
            round={true}
            onClick={function () {
              if (onDemaximize) {
                onDemaximize();
              }
              onHide();
            }}
          />
        )}
        {onMaximize && (
          <RoundedButton
            className={styles.addTabButton}
            icon={
              <MaterialIcon.Rounded
                name="fullscreen"
              />
            }
            round={true}
            onClick={onMaximize}
          />
        )}
        {onDemaximize && (
          <RoundedButton
            className={styles.addTabButton}
            icon={
              <MaterialIcon.Rounded
                name="fullscreen_exit"
              />
            }
            round={true}
            onClick={onDemaximize}
          />
        )}
      </div>
    </section>
  );
}
