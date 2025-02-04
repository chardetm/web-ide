import styles from "./fileIcons.module.scss";

import CodeRoundedIcon from "@mui/icons-material/CodeRounded";
import FormatColorFillRoundedIcon from "@mui/icons-material/FormatColorFillRounded";
import JavascriptRoundedIcon from "@mui/icons-material/JavascriptRounded";
import ImageRoundedIcon from "@mui/icons-material/ImageRounded";
import AudiotrackRoundedIcon from "@mui/icons-material/AudiotrackRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";

import { HTMLCodeEditor } from "./HTMLCodeEditor";
import { CSSCodeEditor } from "./CSSCodeEditor";
import { JSCodeEditor } from "./JSCodeEditor";
import { ImageViewer } from "../viewers/ImageViewer";
import { AudioViewer } from "../viewers/AudioViewer";
import { FileType } from "../../appSettings";
import { FC, ReactElement } from "react";

export type CodeEditorType =
  | typeof HTMLCodeEditor
  | typeof CSSCodeEditor
  | typeof JSCodeEditor
  | typeof ImageViewer
  | typeof AudioViewer;

export function mimeToEditor(mimeType?: FileType): CodeEditorType | null {
  if (!mimeType) return null;
  if (mimeType === "text/html") return HTMLCodeEditor;
  if (mimeType === "text/css") return CSSCodeEditor;
  if (mimeType === "application/javascript") return JSCodeEditor;
  if (mimeType.startsWith("image/")) return ImageViewer;
  if (mimeType.startsWith("audio/")) return AudioViewer;
  return null;
}

export const MimeIcon: FC<{ mimeType?: string; textSize: string }> = ({
  mimeType,
  textSize,
}) => {
  return (
    <div className={"mimeIcon"} style={{ fontSize: textSize, display: "flex" }}>
      {mimeToIcon(mimeType)}
    </div>
  );
};

function mimeToIcon(mimeType?: string): ReactElement | null {
  switch (mimeType) {
    case "text/html":
      return (
        <CodeRoundedIcon
          className={styles.htmlIcon}
          style={{
            fontSize: "100%",
            scale: "120%",
          }}
        />
      );
    case "text/css":
      return (
        <FormatColorFillRoundedIcon
          className={styles.cssIcon}
          style={{
            fontSize: "100%",
          }}
        />
      );
    case "application/javascript":
      return (
        <JavascriptRoundedIcon
          className={styles.jsIcon}
          style={{
            fontSize: "100%",
            scale: "200%",
          }}
        />
      );
    default:
      if (mimeType.startsWith("image/")) {
        return (
          <ImageRoundedIcon
            className={styles.imageIcon}
            style={{
              fontSize: "100%",
            }}
          />
        );
      }
      if (mimeType.startsWith("audio/")) {
        return (
          <AudiotrackRoundedIcon
            className={styles.audioIcon}
            style={{
              fontSize: "100%",
            }}
          />
        );
      }
      return (
        <DescriptionRoundedIcon
          className={styles.unknownIcon}
          style={{
            fontSize: "100%",
          }}
        />
      );
  }
}
