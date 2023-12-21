import React from "react";
import { useState } from "react";
import styles from "./ImageViewer.module.scss";
import { appendClassnames } from "../../utils";

export type ImageViewerProps = {
  value: string;
  className?: string;
};

export const ImageViewer = React.forwardRef<HTMLImageElement>(
  ({ value, className }: ImageViewerProps, ref) => {
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
            src={value}
            alt="Prévisualisation"
          />
        </div>
      </div>
    );
  }
);
