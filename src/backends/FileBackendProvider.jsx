import { Alert, Button, FormControlLabel, Switch } from "@mui/material";
import { useRef, useState } from "react";
import { getJSONExample } from "../content/files";
import { BackendProvider } from "../contexts/BackendProvider";
import { downloadTextFile } from "../utils";

import styles from "./FileBackendProvider.module.scss";
import { MaterialButtonGroup } from "../features/ui/materialComponents";
import {
  CloudDownloadOutlined,
  Edit,
  OpenInNew,
  Preview,
} from "@mui/icons-material";
import { Spacer } from "../features/ui/basicComponents";
import {
  useIDEGetExportData,
  useIDEInitialState,
  useIDEInitialStateDispatch,
  useIDEState,
  useIDEStateDispatch,
} from "../contexts/IDEStateProvider";
import { useEffect } from "react";
import { StatementWindow } from "../windows/StatementWindow";
import { StatementEditorWindow } from "../windows/StatementEditorWindow";
import { PreviewModeInfoDialog } from "../windows/dialogs/PreviewModeInfoDialog";

const NOT_LOADED = 0;
const LOADING = 1;
const LOADED = 2;

export function FileBackendProvider({ children }) {
  const ideState = useIDEState();
  const ideStateDispatch = useIDEStateDispatch();
  const ideInitialState = useIDEInitialState();
  const ideInitialStateDispatch = useIDEInitialStateDispatch();
  const ideGetExportData = useIDEGetExportData();

  const inputRef = useRef(null);

  const [loadingStage, setLoadingStage] = useState(NOT_LOADED);
  const [dirty, setDirty] = useState(false);
  const [isAttempt, setIsAttempt] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [activityData, setActivityData] = useState(null);
  const [statementIsVisible, setStatementIsVisible] = useState(true);
  const [statement, setStatement] = useState(null);
  const [previewModeInfoDialogOpen, setPreviewModeInfoDialogOpen] =
    useState(false);

  function load(data) {
    setActivityData(data);
    setStatement(data.metadata.statement);
    ideInitialStateDispatch({
      type: "create_initial_state",
      initialData: data.initialState,
    });
    setLoadingStage(LOADING);
  }

  async function save() {
    const data = {
      ...ideGetExportData(true),
      metadata: {
        statement: statement,
      },
    };
    downloadTextFile("export.json", JSON.stringify(data, null, 2));
    setDirty(false);
  }

  useEffect(() => {
    if (loadingStage === LOADING) {
      ideStateDispatch({
        type: "create_current_state",
        currentData: activityData.attemptState,
        initialState: ideInitialState,
      });
      setLoadingStage(LOADED);
      setStatementIsVisible(isAttempt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingStage]);

  useEffect(() => {
    setDirty(true);
  }, [statement, ideInitialState, ideState]);

  function markDirty() {
    setDirty(true);
  }

  return (
    <>
      {loadingStage === NOT_LOADED && (
        <div className={styles.backupProviderButtons}>
          <FormControlLabel
            control={
              <Switch
                checked={!isAttempt}
                onChange={() => {
                  setIsAttempt(!isAttempt);
                }}
              />
            }
            label="Mode professeur"
          />
          <input
            ref={inputRef}
            style={{ display: "none" }}
            type="file"
            accept={"application/json"}
            onChange={(e) => {
              const file = e.target.files[0];
              const reader = new FileReader();
              reader.onload = (eLoader) => {
                load(JSON.parse(eLoader.target.result));
              };
              reader.readAsText(file);
            }}
          />
          <Button
            variant="outlined"
            onClick={() => {
              inputRef.current?.click();
            }}
          >
            Charger fichier
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              load(getJSONExample());
            }}
          >
            Charger exemple
          </Button>
        </div>
      )}
      {loadingStage === LOADED && (
        <BackendProvider
          isAttempt={isAttempt || isPreview}
          markDirty={markDirty}
        >
          <div
            className={styles.fileBackendProviderRoot}
            statement-visible={statementIsVisible ? "true" : "false"}
          >
            <div className={styles.fileBackendProviderMain}>
              {statementIsVisible && (
                <div className={styles.fileBackendProviderStatement}>
                  {(isAttempt || isPreview) && (
                    <StatementWindow
                      statement={statement}
                      onHide={() => {
                        setStatementIsVisible(false);
                      }}
                    />
                  )}

                  {!isAttempt && !isPreview && (
                    <StatementEditorWindow
                      className={styles.fileBackendProviderStatementEditor}
                      statement={statement}
                      onChange={setStatement}
                      onHide={() => {
                        setStatementIsVisible(false);
                      }}
                    />
                  )}
                </div>
              )}
              <div className={styles.fileBackendProviderContent}>
                {children}
              </div>
            </div>
            <div className={styles.fileBackendProviderToolbar}>
              <MaterialButtonGroup>
                {!statementIsVisible && (
                  <Button
                    variant="outlined"
                    size="small"
                    endIcon={<OpenInNew />}
                    onClick={function () {
                      setStatementIsVisible(true);
                    }}
                  >
                    Afficher l'énoncé
                  </Button>
                )}
              </MaterialButtonGroup>
              {isPreview && (
                <>
                  <Spacer />
                  <Alert
                    className={styles.fileBackendProviderPreviewModeAlert}
                    severity="warning"
                    action={
                      <Button
                        variant="outlined"
                        color="warning"
                        size="small"
                        onClick={function () {
                          setPreviewModeInfoDialogOpen(true);
                        }}
                      >
                        En savoir plus
                      </Button>
                    }
                  >
                    Mode prévisualisation.
                  </Alert>
                </>
              )}
              <Spacer />
              <MaterialButtonGroup>
                {!isAttempt && (
                  <Button
                    variant="outlined"
                    size="small"
                    endIcon={isPreview ? <Edit /> : <Preview />}
                    disabled={!dirty}
                    onClick={() => {
                      if (!isPreview) {
                        ideStateDispatch({
                          type: "reset_from_teacher_state",
                          teacherState: ideInitialState,
                        });
                      }
                      setIsPreview((prev) => !prev);
                    }}
                  >
                    {isPreview ? "Retour à l'édition" : "Prévisualisation"}
                  </Button>
                )}
                <Button
                  variant="outlined"
                  size="small"
                  endIcon={<CloudDownloadOutlined />}
                  disabled={!dirty}
                  onClick={() => {
                    save();
                  }}
                >
                  Télécharger
                </Button>
              </MaterialButtonGroup>
            </div>
          </div>
        </BackendProvider>
      )}
      <PreviewModeInfoDialog
        open={previewModeInfoDialogOpen}
        onClose={function () {
          setPreviewModeInfoDialogOpen(false);
        }}
      />
    </>
  );
}
