import React from "react";
import CodeEditor, { CodeEditorProps } from "./CodeEditor";
import { css } from "@codemirror/lang-css";

export type CSSCodeEditorProps = Exclude<
  CodeEditorProps,
  "cmLanguage" | "indent"
>;

export const CSSCodeEditor = React.forwardRef<
  HTMLDivElement,
  CSSCodeEditorProps
>((props, ref) => {
  return <CodeEditor ref={ref} indent="  " cmLanguage={css()} {...props} />;
});

export default CSSCodeEditor;
