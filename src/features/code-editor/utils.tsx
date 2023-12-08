import styles from "./fileIcons.module.scss";

import { MaterialIcon } from "../ui/materialComponents";

import { HTMLCodeEditor } from "./HTMLCodeEditor";
import { CSSCodeEditor } from "./CSSCodeEditor";
import { JSCodeEditor } from "./JSCodeEditor";
import { ImageViewer } from "../viewers/ImageViewer";
import { FileType } from "../../appSettings";
import { ReactElement } from "react";

export type CodeEditorType =
  | typeof HTMLCodeEditor
  | typeof CSSCodeEditor
  | typeof JSCodeEditor;

export function mimeToEditor(mimeType?: FileType): CodeEditorType | null {
  if (!mimeType) return null;
  if (mimeType === "text/html") return HTMLCodeEditor;
  if (mimeType === "text/css") return CSSCodeEditor;
  if (mimeType === "application/javascript") return JSCodeEditor;
  if (mimeType.startsWith("image/")) return ImageViewer;
  return null;
}

export function mimeToIcon(mimeType?: FileType): ReactElement | null {
  switch (mimeType) {
    case "text/html":
      return <MaterialIcon.Rounded name="code" className={styles.htmlIcon} />;
    case "text/css":
      return (
        <MaterialIcon.Rounded
          name="format_color_fill"
          className={styles.cssIcon}
        />
      );
    case "application/javascript":
      return (
        <MaterialIcon.Rounded name="javascript" className={styles.jsIcon} />
      );
    default:
      if (mimeType.startsWith("image/")) {
        return (
          <MaterialIcon.Rounded name="image" className={styles.imageIcon} />
        );
      }
      return (
        <MaterialIcon.Rounded
          name="description"
          className={styles.unknownIcon}
        />
      );
  }
}
