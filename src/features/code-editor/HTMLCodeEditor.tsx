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
  initialValue?: string;
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
      initialValue,
      onChange,
      ...props
    },
    ref
  ) => {
    const fileSplitData = useMemo(() => {
      if (!onlyShowBody) {
        return null;
      }
      if (initialValue == null) {
        return null;
      }
      const bodyOpenStart = initialValue.indexOf("<body");
      const bodyOpenEnd = initialValue.indexOf(">", bodyOpenStart);
      const bodyOpenNextLine = initialValue.indexOf("\n", bodyOpenEnd);
      const bodyCloseStart = initialValue.lastIndexOf("</body");
      const bodyCloseLine = initialValue.lastIndexOf("\n", bodyCloseStart);

      if (bodyOpenNextLine === -1 || bodyCloseLine === -1) {
        return null;
      }

      const prefix = initialValue.slice(0, bodyOpenNextLine + 1);
      const suffix = initialValue.slice(bodyCloseLine);
      const bodyText = initialValue.slice(bodyOpenNextLine + 1, bodyCloseLine);
      const prefixNbLines = prefix.split("\n").length;

      return {
        prefix,
        suffix,
        bodyText,
        prefixNbLines,
      };
    }, [initialValue, onlyShowBody]);
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
        initialValue={fileSplitData?.bodyText ?? initialValue}
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
