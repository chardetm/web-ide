import { useState } from "react";
import { BackendProvider } from "../contexts/BackendProvider";
import {
  useIDEGetExportData,
  useIDEInitialState,
  useIDEInitialStateDispatch,
  useIDEState,
  useIDEStateDispatch,
} from "../contexts/IDEStateProvider";
import { useEffect } from "react";
import {
  useCapytaleData,
  useCapytaleDispatch,
} from "@capytale/activity.ui/lib/CapytaleProvider";
import { CapytaleUIProvider } from "@capytale/activity.ui/lib/CapytaleUIProvider";
import StandardLayout from "@capytale/activity.ui/lib/layouts/StandardLayout";

import exampleAttempt from "../content/example1.json";

const NOT_LOADED = 0;
const LOADING = 1;
const LOADED = 2;

export function CapytaleBackendProvider({ children }) {
  const ideGetExportData = useIDEGetExportData();
  const capytaleData = useCapytaleData();
  const capytaleDispatch = useCapytaleDispatch();
  const [capytaleUIComponentSettings, setCapytaleUIComponentSettings] =
    useState({});

  async function save() {
    const data = ideGetExportData(capytaleData.mode !== "create");
    if (capytaleData.mode === "create") {
      capytaleDispatch({
        type: "setActivityContent",
        content: data.initialState,
      });
    }
    if (capytaleData.mode === "assignment" || capytaleData.mode === "review") {
      capytaleDispatch({
        type: "setAssignmentContent",
        content: data.attemptState,
      });
    }
  }

  return (
    <CapytaleUIProvider
      prepareSave={save}
      uiComponentSettings={capytaleUIComponentSettings}
    >
      <StandardLayout>
        <CapytaleBackendProviderContent
        >
          {children}
        </CapytaleBackendProviderContent>
      </StandardLayout>
    </CapytaleUIProvider>
  );
}

function CapytaleBackendProviderContent({ children }) {
  const ideState = useIDEState();
  const ideStateDispatch = useIDEStateDispatch();
  const ideInitialState = useIDEInitialState();
  const ideInitialStateDispatch = useIDEInitialStateDispatch();
  const capytaleData = useCapytaleData();
  const capytaleDispatch = useCapytaleDispatch();

  const [loadingStage, setLoadingStage] = useState(NOT_LOADED);
  const [activityData, setActivityData] = useState(null);

  function load(data) {
    setActivityData(data);
    ideInitialStateDispatch({
      type: "import_initial_state",
      exportedData: data,
    });
    setLoadingStage(LOADING);
  }

  useEffect(
    () => {
      console.log("Content:", capytaleData.activity.content);
      const data = capytaleData.activity.content
        ? {
            initialState: capytaleData.activity.content,
            attemptState: capytaleData.assignment.content,
          }
        : exampleAttempt;
      load(data);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (loadingStage === LOADING) {
      ideStateDispatch({
        type: "import_current_state",
        exportedData: activityData,
        initialState: ideInitialState,
      });
      setLoadingStage(LOADED);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingStage]);

  useEffect(() => {
    capytaleDispatch({
      type: "setDirty",
    });
  }, [ideInitialState, ideState]);

  function markDirty() {
    capytaleDispatch({
      type: "setDirty",
    });
  }

  return (
    <>
      {loadingStage !== LOADED && <p>Chargement...</p>}
      {loadingStage === LOADED && (
        <BackendProvider
          isAttempt={
            capytaleData.mode !== "create" && capytaleData.mode !== "view"
          }
          markDirty={markDirty}
        >
          {children}
        </BackendProvider>
      )}
    </>
  );
}
