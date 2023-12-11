import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { EditorView } from "@codemirror/view";
import { indentUnit } from "@codemirror/language";
import { keymap, lineNumbers } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
// import readOnlyRangesExtension from "codemirror-readonly-ranges";

import "./CodeEditor.scss";
import { appendClassnames } from "../../utils";

export type CodeEditorProps = {
  onChange?: (newText: string, lines: string[]) => void;
  indent?: string;
  cmLanguage?: any;
  code?: string;
  extensions?: any[];
  readOnly?: boolean;
  grayed?: boolean;
  className?: string;
  firstEditableLine?: number;
  lastEditableLine?: number;
  lineWrapping?: boolean;
  firstLineNumber?: number;
} & React.ComponentProps<typeof CodeMirror>;

const CodeEditor = React.forwardRef(
  (
    {
      onChange,
      indent,
      cmLanguage,
      code = "",
      extensions = [],
      readOnly = false,
      grayed = false,
      className,
      firstEditableLine,
      lastEditableLine,
      lineWrapping = false,
      firstLineNumber = 1,
      ...props
    }: CodeEditorProps,
    ref
  ) => {
    /*
    const readOnlyRanges = useMemo(() => {
      if (firstEditableLine === undefined && lastEditableLine === undefined) {
        return (_) => [];
      }

      return (targetState) => {
        let ranges = [];
        if (firstEditableLine !== undefined) {
          ranges.push({
            from: undefined, //same as targetState.doc.line(0).from or 0
            to: targetState.doc.line(firstEditableLine - 1).to,
          });
        }
        if (lastEditableLine !== undefined) {
          ranges.push({
            from: targetState.doc.line(lastEditableLine + 1).from,
            to: undefined, // same as targetState.doc.line(targetState.doc.lines).to
          });
        }
        return ranges;
      };
    }, [firstEditableLine, lastEditableLine]);
    */
    let all_extensions = [...extensions];
    // TODO: find an alternative (double paste issue: https://github.com/andrebnassis/codemirror-readonly-ranges/issues/6)
    //all_extensions.push(readOnlyRangesExtension(readOnlyRanges));
    if (indent) {
      all_extensions.push(indentUnit.of(indent));
      all_extensions.push(keymap.of([indentWithTab]));
    }
    if (cmLanguage) {
      all_extensions.push(cmLanguage);
    }
    if (lineWrapping) {
      all_extensions.push(EditorView.lineWrapping);
    }
    all_extensions.push(
      lineNumbers({
        formatNumber: (n) => (n + firstLineNumber - 1).toString(),
      })
    );

    if (onChange) {
      all_extensions.push(
        EditorView.updateListener.of(function (update) {
          if (update.docChanged) {
            const newText = update.state.doc.toString();
            //@ts-ignore
            const lines = update.state.doc.text;
            onChange(newText, lines);
          }
        })
      );
    }
    return (
      <CodeMirror
        //@ts-ignore
        readOnly={readOnly ? "nocursor" : false}
        ref={ref}
        value={code}
        extensions={all_extensions}
        className={appendClassnames(
          className,
          readOnly && "read-only",
          grayed && "grayed"
        )}
        {...props}
      />
    );
  }
);

export default CodeEditor;
