import React from "react";
import CodeEditor from "./CodeEditor";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";

export const MDCodeEditor = React.forwardRef((props, ref) => {
  return (
    <CodeEditor
      ref={ref}
      indent="  "
      cmLanguage={markdown({
        base: markdownLanguage,
        codeLanguages: languages,
        addKeymap: true,
      })}
      {...props}
    />
  );
});

export default MDCodeEditor;
