import React from "react";
import CodeEditor, { CodeEditorProps } from "./CodeEditor";
import { css } from "@codemirror/lang-css";
import { ReactCodeMirrorRef } from "@uiw/react-codemirror";

export type CSSCodeEditorProps = Exclude<
  CodeEditorProps,
  "cmLanguage" | "indent"
>;

export const CSSCodeEditor = React.forwardRef<
  ReactCodeMirrorRef,
  CSSCodeEditorProps
>((props, ref) => {
  return <CodeEditor ref={ref} indent="  " cmLanguage={css()} {...props} />;
});

export default CSSCodeEditor;
