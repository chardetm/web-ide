import React, { useCallback, useMemo } from "react";
import CodeEditor, { CodeEditorProps } from "./CodeEditor";
import { html } from "@codemirror/lang-html";
import { ReactCodeMirrorRef } from "@uiw/react-codemirror";

export type HTMLCodeEditorProps = Exclude<
  CodeEditorProps,
  "cmLanguage" | "indent" | "onChange" | "firstLineNumber" | "value"
> & {
  matchClosingTags?: boolean;
  autoCloseTags?: boolean;
  onlyShowBody?: boolean;
  value?: string;
  onChange?: (newText: string) => void;
};

export const HTMLCodeEditor = React.forwardRef<
  ReactCodeMirrorRef,
  HTMLCodeEditorProps
>(
  (
    {
      matchClosingTags = true,
      autoCloseTags = true,
      onlyShowBody = false,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const fileSplitData = useMemo(() => {
      if (!onlyShowBody) {
        return null;
      }
      if (value == null) {
        return null;
      }
      const bodyOpenStart = value.indexOf("<body");
      const bodyOpenEnd = value.indexOf(">", bodyOpenStart);
      const bodyOpenNextLine = value.indexOf("\n", bodyOpenEnd);
      const bodyCloseStart = value.lastIndexOf("</body");
      const bodyCloseLine = value.lastIndexOf("\n", bodyCloseStart);

      if (bodyOpenNextLine === -1 || bodyCloseLine === -1) {
        return null;
      }

      const prefix = value.slice(0, bodyOpenNextLine + 1);
      const suffix = value.slice(bodyCloseLine);
      const bodyText = value.slice(bodyOpenNextLine + 1, bodyCloseLine);
      const prefixNbLines = prefix.split("\n").length;

      return {
        prefix,
        suffix,
        bodyText,
        prefixNbLines,
      };
    }, [value, onlyShowBody]);
    const htmlOnChange = useCallback(
      (newText: string): void => {
        if (!onChange) {
          return;
        }
        if (fileSplitData == null) {
          onChange(newText);
          return;
        }
        const { prefix, suffix } = fileSplitData;
        const fullText = prefix + newText + suffix;

        onChange(fullText);
      },
      [fileSplitData, onChange]
    );
    return (
      <CodeEditor
        ref={ref}
        code={fileSplitData?.bodyText ?? value}
        firstLineNumber={fileSplitData?.prefixNbLines ?? 1}
        indent="  "
        onChange={htmlOnChange}
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
