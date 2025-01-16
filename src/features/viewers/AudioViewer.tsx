import React from "react";
import styles from "./AudioViewer.module.scss";
import { appendClassnames } from "../../utils";

export type AudioViewerProps = {
  initialValue: string;
  className?: string;
};

export const AudioViewer = React.forwardRef<HTMLAudioElement>(
  ({ initialValue, className }: AudioViewerProps, ref) => {
    return (
      <div className={appendClassnames(className, styles.wrapper)}>
        <div className={styles.audioViewer}>
          <audio controls ref={ref}>
            <source src={initialValue} type="audio/ogg" />
            Votre navigateur ne supporte pas l'élément <code>audio</code>.
          </audio>
        </div>
      </div>
    );
  }
);
