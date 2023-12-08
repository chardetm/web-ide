import React from "react";
import CodeEditor, { CodeEditorProps } from "./CodeEditor";
import { python } from "@codemirror/lang-python";

export type PythonCodeEditorProps = Exclude<
  CodeEditorProps,
  "cmLanguage" | "indent"
>;

const PythonCodeEditor = React.forwardRef<
  HTMLDivElement,
  PythonCodeEditorProps
>((props, ref) => {
  return (
    <CodeEditor ref={ref} indent="    " cmLanguage={python()} {...props} />
  );
});

export default PythonCodeEditor;
