import React from "react";
import CodeEditor, { CodeEditorProps } from "./CodeEditor";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { ReactCodeMirrorRef } from "@uiw/react-codemirror";

export type MDCodeEditorProps = Exclude<
  CodeEditorProps,
  "cmLanguage" | "indent"
>;

export const MDCodeEditor = React.forwardRef<
  ReactCodeMirrorRef,
  MDCodeEditorProps
>((props, ref) => {
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
