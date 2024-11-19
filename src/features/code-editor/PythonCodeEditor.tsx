import React from "react";
import CodeEditor, { CodeEditorProps } from "./CodeEditor";
import { python } from "@codemirror/lang-python";
import { ReactCodeMirrorRef } from "@uiw/react-codemirror";

export type PythonCodeEditorProps = Exclude<
  CodeEditorProps,
  "cmLanguage" | "indent"
>;

const PythonCodeEditor = React.forwardRef<
  ReactCodeMirrorRef,
  PythonCodeEditorProps
>((props, ref) => {
  return (
    <CodeEditor ref={ref} indent="    " cmLanguage={python()} {...props} />
  );
});

export default PythonCodeEditor;
