import React from "react";
import { useState } from "react";
import styles from "./ImageViewer.module.scss";
import { appendClassnames } from "../../utils";

export type ImageViewerProps = {
  initialValue: string;
  className?: string;
};

export const ImageViewer = React.forwardRef<HTMLImageElement>(
  ({ initialValue, className }: ImageViewerProps, ref) => {
    const [zoomedIn, setZoomedIn] = useState(false);
    return (
      <div
        className={appendClassnames(className, styles.wrapper)}
        data-zoomedin={zoomedIn.toString()}
        onClick={() => setZoomedIn(!zoomedIn)}
      >
        <div className={styles.imageViewer}>
          <img
            ref={ref}
            className={styles.image}
            src={initialValue}
            alt="Prévisualisation"
          />
        </div>
      </div>
    );
  }
);
