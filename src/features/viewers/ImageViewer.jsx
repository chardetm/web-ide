import React from "react";
import { useState } from "react";
import styles from "./ImageViewer.module.scss";

export const ImageViewer = React.forwardRef(({ value, className }, ref) => {
  const [zoomedIn, setZoomedIn] = useState(false);
  return (
    <div
      className={`${className ? className + " " : ""}${styles.wrapper}`}
      zoomedin={zoomedIn.toString()}
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
});
