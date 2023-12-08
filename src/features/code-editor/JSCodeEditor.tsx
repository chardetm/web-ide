import React from "react";
import CodeEditor, { CodeEditorProps } from "./CodeEditor";
import { javascript } from "@codemirror/lang-javascript";

export type JSCodeEditorProps = Exclude<
  CodeEditorProps,
  "cmLanguage" | "indent"
>;

export const JSCodeEditor = React.forwardRef<HTMLDivElement, JSCodeEditorProps>(
  (props, ref) => {
    return (
      <CodeEditor ref={ref} indent="  " cmLanguage={javascript()} {...props} />
    );
  }
);

export default JSCodeEditor;
