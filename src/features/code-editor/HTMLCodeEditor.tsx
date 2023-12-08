import React from "react";
import CodeEditor, { CodeEditorProps } from "./CodeEditor";
import { html } from "@codemirror/lang-html";

export type HTMLCodeEditorProps = Exclude<
  CodeEditorProps,
  "cmLanguage" | "indent"
> & {
  matchClosingTags?: boolean;
  autoCloseTags?: boolean;
};

export const HTMLCodeEditor = React.forwardRef<
  HTMLDivElement,
  HTMLCodeEditorProps
>(({ matchClosingTags = true, autoCloseTags = true, ...props }, ref) => {
  return (
    <CodeEditor
      ref={ref}
      indent="  "
      cmLanguage={html({
        matchClosingTags: matchClosingTags,
        autoCloseTags: autoCloseTags,
      })}
      {...props}
    />
  );
});

export default HTMLCodeEditor;
