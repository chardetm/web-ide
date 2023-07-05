import React from "react";
import CodeEditor from "./CodeEditor";
import { python } from "@codemirror/lang-python";

const PythonCodeEditor = React.forwardRef((props, ref) => {
  return (
    <CodeEditor ref={ref} indentUnit="  " cmLanguage={python()} {...props} />
  );
});

export default PythonCodeEditor;
