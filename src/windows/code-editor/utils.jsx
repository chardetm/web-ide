import styles from "./index.module.scss";

import { MaterialIcon } from "../../features/ui/materialComponents";

import { HTMLCodeEditor } from "../../features/code-editor/HTMLCodeEditor";
import { CSSCodeEditor } from "../../features/code-editor/CSSCodeEditor";
import { JSCodeEditor } from "../../features/code-editor/JSCodeEditor";
import { ImageViewer } from "../../features/viewers/ImageViewer";

export function mimeToEditor(mime) {
  if (!mime) return null;
  if (mime === "text/html") return HTMLCodeEditor;
  if (mime === "text/css") return CSSCodeEditor;
  if (mime === "application/javascript") return JSCodeEditor;
  if (mime.startsWith("image/")) return ImageViewer;
  return null;
}

export function mimeToIcon(mimeType) {
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
