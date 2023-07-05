import React from "react";
import CodeEditor from "./CodeEditor";
import { javascript } from "@codemirror/lang-javascript";

export const JSCodeEditor = React.forwardRef((props, ref) => {
  return (
    <CodeEditor ref={ref} indent="  " cmLanguage={javascript()} {...props} />
  );
});

export default JSCodeEditor;
