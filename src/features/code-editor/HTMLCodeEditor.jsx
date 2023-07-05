import React from "react";
import CodeEditor from "./CodeEditor";
import { html } from "@codemirror/lang-html";

export const HTMLCodeEditor = React.forwardRef(
  ({ matchClosingTags = true, autoCloseTags = true, ...props }, ref) => {
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
  }
);

export default HTMLCodeEditor;
