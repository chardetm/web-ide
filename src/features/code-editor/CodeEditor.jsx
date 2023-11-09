import React from "react";
import CodeMirror from "@uiw/react-codemirror";
import { EditorView } from "@codemirror/view";
import { indentUnit } from "@codemirror/language";
import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import readOnlyRangesExtension from "codemirror-readonly-ranges";

import "./CodeEditor.scss";
import { useMemo } from "react";

const CodeEditor = React.forwardRef(
  (
    {
      onChange = null,
      indent = null,
      cmLanguage = null,
      code = "",
      extensions = [],
      readOnly = false,
      grayed = false,
      className = null,
      firstEditableLine,
      lastEditableLine,
      ...props
    },
    ref
  ) => {
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
    const onChangeFunction = onChange;
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
    if (onChange) {
      all_extensions.push(
        EditorView.updateListener.of(function (update) {
          if (update.docChanged) {
            const newText = update.state.doc.toString();
            const lines = update.state.doc.text;
            onChangeFunction(newText, lines);
          }
        })
      );
    }
    return (
      <CodeMirror
        readOnly={readOnly ? "nocursor" : false}
        ref={ref}
        value={code}
        extensions={all_extensions}
        className={`${className ? className : ""} ${
          readOnly ? "read-only" : ""
        } ${grayed ? "grayed" : ""}`}
        {...props}
      />
    );
  }
);

export default CodeEditor;
