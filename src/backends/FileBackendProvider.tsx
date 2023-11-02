import { useRef, useState, useEffect } from "react";

import { Alert, Button, FormControlLabel, Switch } from "@mui/material";
import {
  CloudDownloadOutlined,
  Edit,
  OpenInNew,
  Preview,
} from "@mui/icons-material";

import { MaterialButtonGroup } from "../features/ui/materialComponents";
import { Spacer } from "../features/ui/basicComponents";

import { BackendProvider } from "../contexts/BackendProvider";

import {
  useIDEGetExportData,
  useIDEInitialState,
  useIDEState,
  useIDEStateDispatch,
} from "../contexts/IDEStateProvider";

import { StatementWindow } from "../windows/StatementWindow";
import { StatementEditorWindow } from "../windows/StatementEditorWindow";
import { PreviewModeInfoDialog } from "../windows/dialogs/PreviewModeInfoDialog";

import { downloadTextFile } from "../utils";
import exampleAttempt from "../content/example1.json";

import styles from "./FileBackendProvider.module.scss";

export function FileBackendProvider({ children }) {
  const ideState = useIDEState();
  const ideStateDispatch = useIDEStateDispatch();
  const ideInitialState = useIDEInitialState();
  const ideGetExportData = useIDEGetExportData();

  const inputRef = useRef(null);

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
    setStatementIsVisible(isAttempt);
  }

  async function save() {
    const data = {
      ...ideGetExportData(isAttempt),
      metadata: {
        statement: statement,
      },
    };
    downloadTextFile("export.json", JSON.stringify(data, null, 2));
    setDirty(false);
  }

  useEffect(() => {
    setDirty(true);
  }, [statement, ideInitialState, ideState]);

  function markDirty() {
    setDirty(true);
  }

  return (
    <>
      {!activityData && (
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
                load(JSON.parse(eLoader.target.result as string));
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
              load(exampleAttempt);
            }}
          >
            Charger exemple
          </Button>
        </div>
      )}
      {activityData && (
        <BackendProvider
          initialData={activityData}
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
                    onClick={() => {
                      if (!isPreview) {
                        ideStateDispatch({
                          type: "reset_from_initial_state",
                          initialState: ideInitialState,
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
