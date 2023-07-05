import { useState, useEffect, useCallback } from "react";

import CodeEditorWindow from "../windows/code-editor";
import { WebPreviewWindow } from "../windows/WebPreviewWindow";

import styles from "./Exercise.module.scss";

import { IDEChosenStateProvider } from "../contexts/IDEStateProvider";
import { useBackendIsAttempt } from "../contexts/BackendProvider";

function Exercise({ ...props }) {
  const isAttempt = useBackendIsAttempt();
  const [mode, setMode] = useState("attempt");
  const [maximizedWindow, setMaximizedWindow] = useState(null);

  useEffect(() => {
    setMaximizedWindow(null);
    setMode(isAttempt ? "attempt" : "content");
  }, [isAttempt]);

  const onDemaximize = useCallback(function () {
    setMaximizedWindow(null);
  }, []);

  return (
    <div
      className={styles.exercise}
      mode={mode}
      edit={(!isAttempt).toString()}
      has-maximized-window={maximizedWindow === null ? "false" : "true"}
      {...props}
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
