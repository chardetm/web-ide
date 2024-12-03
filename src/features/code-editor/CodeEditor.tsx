import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import CodeMirror, {
  ReactCodeMirrorProps,
  ReactCodeMirrorRef,
} from "@uiw/react-codemirror";
import { EditorView } from "@codemirror/view";
import { indentUnit } from "@codemirror/language";
import { keymap, lineNumbers } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
// import readOnlyRangesExtension from "codemirror-readonly-ranges";

import "./CodeEditor.scss";
import { appendClassnames } from "../../utils";
import { useAppStore } from "../../store";

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

const CodeEditor = React.forwardRef<
  ReactCodeMirrorRef,
  CodeEditorProps & ReactCodeMirrorProps
>(
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
    },
    ref
  ) => {
    const [editorCreated, setEditorCreated] = useState(false);
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
    const innerRef = useRef<ReactCodeMirrorRef>(null);
    const wheelEventHandler = useCallback((e) => {
      if (e.ctrlKey) {
        e.preventDefault();
        if ((e as any).deltaY < 0) {
          increaseCodeZoomLevel();
        } else {
          decreaseCodeZoomLevel();
        }
      }
    }, []);
    useEffect(() => {
      if (!editorCreated || !innerRef.current?.view?.dom) {
        return;
      }
      innerRef.current.view.dom.addEventListener("wheel", wheelEventHandler, {
        passive: false,
      });
      return () => {
        innerRef.current?.view?.dom?.removeEventListener(
          "wheel",
          wheelEventHandler
        );
      };
    }, [wheelEventHandler, editorCreated]);
    useImperativeHandle(ref, () => innerRef.current!, []);
    const increaseCodeZoomLevel = useAppStore(
      (state) => state.increaseCodeZoomLevel
    );
    const decreaseCodeZoomLevel = useAppStore(
      (state) => state.decreaseCodeZoomLevel
    );
    const codeZoomLevel = useAppStore((state) => state.codeZoomLevel);

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

    const style = useMemo(() => {
      return {
        zoom:
          1988261 +
          (0.5114571 - 1988261) / (1 + (codeZoomLevel / 1896.638) ** 2.911764),
      };
    }, [codeZoomLevel]);

    return (
      <CodeMirror
        //@ts-expect-error ("nocursor" not recognized as valid by TS)
        readOnly={readOnly ? "nocursor" : false}
        onCreateEditor={() => {
          setEditorCreated(true);
        }}
        ref={innerRef}
        value={code}
        extensions={all_extensions}
        className={appendClassnames(
          className,
          readOnly && "read-only",
          grayed && "grayed"
        )}
        style={style}
        {...props}
      />
    );
  }
);

export default CodeEditor;
