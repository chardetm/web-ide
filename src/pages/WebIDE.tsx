import { useState, useEffect, useCallback } from "react";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import "./WebIDE.scss";
import styles from "./WebIDE.module.scss";

import CodeEditorWindow from "../windows/code-editor";
import { WebPreviewWindow } from "../windows/WebPreviewWindow";

import {
  IDEChosenStateProvider,
  useIDEInitialState,
  useIDEInitialStateDispatch,
  useIDEState,
  useIDEStateDispatch,
} from "../contexts/IDEStateProvider";
import {
  useBackendInitialdata,
  useBackendIsAttempt,
  useBackendMarkDirty,
} from "../contexts/BackendProvider";

import { DivProps } from "react-html-props";
import { appendClassnames } from "../utils";

enum LoadStatus {
  INITIAL,
  LOADING_INITIAL_STATE,
  LOADED,
}

interface WebIDEProps {
  className?: string;
  props?: DivProps;
}

function WebIDE({ className, ...props }: WebIDEProps) {
  const ideStateDispatch = useIDEStateDispatch();
  const ideInitialState = useIDEInitialState();
  const ideInitialStateDispatch = useIDEInitialStateDispatch();
  const backendInitialData = useBackendInitialdata();
  const [loadStatus, setLoadStatus] = useState<LoadStatus>(LoadStatus.INITIAL);

  useEffect(() => {
    if (loadStatus === LoadStatus.INITIAL) {
      ideInitialStateDispatch({
        type: "import_initial_state",
        exportedData: backendInitialData,
      });
      setLoadStatus(LoadStatus.LOADING_INITIAL_STATE);
    } else if (loadStatus === LoadStatus.LOADING_INITIAL_STATE) {
      ideStateDispatch({
        type: "import_current_state",
        exportedData: backendInitialData,
        initialState: ideInitialState,
      });
      setLoadStatus(LoadStatus.LOADED);
    }
  }, [loadStatus]);

  return (
    loadStatus === LoadStatus.LOADED && (
      <WebIDEContent className={className} {...props} />
    )
  );
}

interface WebIDEContentProps {
  className?: string;
  props?: DivProps;
}

function WebIDEContent({ className, ...props }: WebIDEContentProps) {
  const isAttempt = useBackendIsAttempt();
  const [maximizedWindow, setMaximizedWindow] = useState(null);
  const mode = isAttempt ? "attempt" : "content";

  // Set backend dirty state
  const ideState = useIDEState();
  const ideInitialState = useIDEInitialState();
  const backendMarkDirty = useBackendMarkDirty();

  const [firstLoad, setFirstLoad] = useState(true);
  useEffect(() => {
    if (firstLoad) {
      setFirstLoad(false);
    } else {
      backendMarkDirty();
    }
  }, [ideInitialState, ideState]);

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

export default WebIDE;
