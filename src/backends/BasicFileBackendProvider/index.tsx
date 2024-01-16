import { useRef, useState } from "react";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import CloudDownloadOutlined from "@mui/icons-material/CloudDownloadOutlined";
import Edit from "@mui/icons-material/Edit";
import Preview from "@mui/icons-material/Preview";

import { MaterialButtonGroup } from "../../features/ui/materialComponents";
import { Spacer } from "../../features/ui/basicComponents";

import { BackendProvider } from "../../contexts/BackendProvider";

import {
  useIDEGetExportData,
  useIDEInitialState,
  useIDEState,
  useIDEStateDispatch,
} from "../../contexts/IDEStateProvider";

import { PreviewModeInfoDialog } from "./PreviewModeInfoDialog";

import { downloadTextFile } from "../../utils";
import exampleAttempt from "../../content/example1.json";

import styles from "./index.module.scss";
import { WebIDELayout } from "src";

function FileBackendProvider({ children }) {
  const ideStateDispatch = useIDEStateDispatch();
  const ideInitialState = useIDEInitialState();
  const ideGetExportData = useIDEGetExportData();

  const inputRef = useRef(null);

  const [dirty, setDirty] = useState(false);
  const [isAttempt, setIsAttempt] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [layout, setLayout] = useState<WebIDELayout>("auto");
  const [activityData, setActivityData] = useState(null);
  const [previewModeInfoDialogOpen, setPreviewModeInfoDialogOpen] =
    useState(false);

  function load(data) {
    setActivityData(data);
  }

  async function save() {
    const data = await ideGetExportData(isAttempt);
    downloadTextFile("export.json", JSON.stringify(data, null, 2));
    setDirty(false);
  }

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
          layout={layout}
        >
          <div className={styles.fileBackendProviderRoot}>
            <div className={styles.fileBackendProviderMain}>{children}</div>
            <div className={styles.fileBackendProviderToolbar}>
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
              <FormControl size="small" className={styles.layoutForm}>
                <InputLabel id="demo-simple-select-label">Disposition</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={layout}
                  label="Disposition"
                  onChange={(e: SelectChangeEvent<WebIDELayout>) => {
                    setLayout(e.target.value as WebIDELayout);
                  }}
                >
                  <MenuItem value={"auto"}>Automatique</MenuItem>
                  <MenuItem value={"horizontal"}>Horizontal</MenuItem>
                  <MenuItem value={"vertical"}>Vertical</MenuItem>
                </Select>
              </FormControl>
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

export default FileBackendProvider;
