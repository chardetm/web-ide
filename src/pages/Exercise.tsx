import { useState, useEffect, useCallback } from "react";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import "./Exercise.scss";
import styles from "./Exercise.module.scss";

import CodeEditorWindow from "../windows/code-editor";
import { WebPreviewWindow } from "../windows/WebPreviewWindow";

import { IDEChosenStateProvider } from "../contexts/IDEStateProvider";
import { useBackendIsAttempt } from "../contexts/BackendProvider";

import { DivProps } from "react-html-props";
import { appendClassnames } from "../utils";

interface ExerciseProps {
  className?: string;
  props?: DivProps;
}

function Exercise({ className, ...props }: ExerciseProps) {
  const isAttempt = useBackendIsAttempt();
  const [maximizedWindow, setMaximizedWindow] = useState(null);
  const mode = isAttempt ? "attempt" : "content";

  const onDemaximize = useCallback(function () {
    setMaximizedWindow(null);
  }, []);

  return (
    <div
      {...props}
      has-maximized-window={maximizedWindow === null ? "false" : "true"}
      className={appendClassnames(className, styles.exercise)}
    >
      <main className={styles.exerciseContent}>
        <IDEChosenStateProvider initial={mode === "content"}>
          {(!maximizedWindow || maximizedWindow === "CodeEditorWindow") && (
            <CodeEditorWindow
              onMaximize={
                !maximizedWindow &&
                (() => {
                  setMaximizedWindow("CodeEditorWindow");
                })
              }
              onDemaximize={
                maximizedWindow === "CodeEditorWindow" && onDemaximize
              }
            />
          )}
          {(!maximizedWindow || maximizedWindow === "WebPreviewWindow") && (
            <WebPreviewWindow
              onMaximize={
                !maximizedWindow &&
                (() => {
                  setMaximizedWindow("WebPreviewWindow");
                })
              }
              onDemaximize={
                maximizedWindow === "WebPreviewWindow" && onDemaximize
              }
            />
          )}
        </IDEChosenStateProvider>
      </main>
    </div>
  );
}

export default Exercise;
