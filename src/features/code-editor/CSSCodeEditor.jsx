import React from "react";
import CodeEditor from "./CodeEditor";
import { css } from "@codemirror/lang-css";

export const CSSCodeEditor = React.forwardRef((props, ref) => {
  return <CodeEditor ref={ref} indent="  " cmLanguage={css()} {...props} />;
});

export default CSSCodeEditor;
