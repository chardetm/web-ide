import React from "react";
import styles from "./style.module.scss";
import { BasicButton } from "../ui/basicComponents";
import { MaterialIcon, RoundedButton } from "../ui/materialComponents";
import { appendClassnames } from "../../utils";
import { SectionProps } from "react-html-props";

export function WindowButton({ children, ...props }) {
  return (
    <BasicButton className={styles.windowButton} {...props}>
      {children}
    </BasicButton>
  );
}

type BaseWindowProps = {
  children?: React.ReactNode;
  onHide?: () => void;
  onDemaximize?: () => void;
  onMaximize?: () => void;
  className?: string;
  props?: SectionProps;
};

export function BaseWindow({
  children,
  onHide,
  onDemaximize,
  onMaximize,
  className,
  ...props
}: BaseWindowProps) {
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
            icon={<MaterialIcon.Rounded name="fullscreen" />}
            round={true}
            onClick={onMaximize}
          />
        )}
        {onDemaximize && (
          <RoundedButton
            className={styles.addTabButton}
            icon={<MaterialIcon.Rounded name="fullscreen_exit" />}
            round={true}
            onClick={onDemaximize}
          />
        )}
      </div>
    </section>
  );
}
