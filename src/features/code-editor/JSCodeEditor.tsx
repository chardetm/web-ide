import React from "react";
import CodeEditor, { CodeEditorProps } from "./CodeEditor";
import { javascript } from "@codemirror/lang-javascript";
import { ReactCodeMirrorRef } from "@uiw/react-codemirror";

export type JSCodeEditorProps = Exclude<
  CodeEditorProps,
  "cmLanguage" | "indent"
>;

export const JSCodeEditor = React.forwardRef<
  ReactCodeMirrorRef,
  JSCodeEditorProps
>((props, ref) => {
  return (
    <CodeEditor ref={ref} indent="  " cmLanguage={javascript()} {...props} />
  );
});

export default JSCodeEditor;
