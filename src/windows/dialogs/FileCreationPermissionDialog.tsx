import { useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Unstable_Grid2";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Switch from "@mui/material/Switch";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import Typography from "@mui/material/Typography";

import { MaterialButtonGroup } from "../../features/ui/materialComponents";
import {
  FileType,
  allowedTextFileTypes,
  fileTypesInfo,
} from "../../appSettings";
import {
  useIDEInitialState,
  useIDEInitialStateDispatch,
} from "../../contexts/IDEStateProvider";
import { mimeToEditor, mimeToIcon } from "../../features/code-editor/utils";

import styles from "./dialogs.module.scss";
import { appendClassnames } from "../../utils";

type FileCreationPermissionDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function FileCreationPermissionDialog({
  open,
  onClose,
}: FileCreationPermissionDialogProps) {
  const ideInitialState = useIDEInitialState();
  const ideInitialStateDispatch = useIDEInitialStateDispatch();
  const [selectedTab, setSelectedTab] = useState<FileType>("text/html");

  const handleTabChange = (event: React.SyntheticEvent, newTab: FileType) => {
    setSelectedTab(newTab);
  };

  const showInitialContentPanel = allowedTextFileTypes.some((fileType) => {
    return ideInitialState.studentSettings.allowedNewTextFileTypes.includes(
      fileType
    );
  });

  if (
    showInitialContentPanel &&
    !(
      ideInitialState.studentSettings.allowedNewTextFileTypes as string[]
    ).includes(selectedTab)
  ) {
    setSelectedTab(ideInitialState.studentSettings.allowedNewTextFileTypes[0]);
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth={showInitialContentPanel}
      maxWidth={"xl"}
    >
      <Grid container>
        <Grid
          xs={12}
          md={showInitialContentPanel ? 6 : 12}
          lg={showInitialContentPanel ? 4 : 12}
          xl={showInitialContentPanel ? 3 : 12}
        >
          <DialogTitle>Création de fichiers</DialogTitle>
          <DialogContent>
            <List
              dense
              subheader={
                <ListSubheader>Types de fichiers autorisés</ListSubheader>
              }
            >
              <>
                {allowedTextFileTypes.map((fileType) => (
                  <ListItem key={fileType} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        ideInitialStateDispatch({
                          type: "toggle_allowed_text_file_type",
                          fileType: fileType,
                        });
                      }}
                    >
                      <ListItemText
                        id={fileType}
                        primary={fileTypesInfo[fileType].name}
                      />
                      <Switch
                        edge="end"
                        checked={ideInitialState.studentSettings.allowedNewTextFileTypes.includes(
                          fileType
                        )}
                        inputProps={{
                          "aria-labelledby": fileType,
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() =>
                    ideInitialStateDispatch({
                      type: "set_student_settings",
                      settings: {
                        canUploadImageFiles:
                          !ideInitialState.studentSettings.canUploadImageFiles,
                        canUploadTextFiles:
                          ideInitialState.studentSettings.canUploadTextFiles ||
                          !ideInitialState.studentSettings.canUploadImageFiles,
                      },
                    })
                  }
                >
                  <ListItemText id="switch-upload-images" primary="Images" />
                  <Switch
                    edge="end"
                    checked={
                      ideInitialState.studentSettings.canUploadImageFiles
                    }
                    inputProps={{
                      "aria-labelledby": "switch-upload-images",
                    }}
                  />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() =>
                    ideInitialStateDispatch({
                      type: "set_student_settings",
                      settings: {
                        canUploadAudioFiles:
                          !ideInitialState.studentSettings.canUploadAudioFiles,
                        canUploadTextFiles:
                          ideInitialState.studentSettings.canUploadTextFiles ||
                          !ideInitialState.studentSettings.canUploadAudioFiles,
                      },
                    })
                  }
                >
                  <ListItemText
                    id="switch-upload-audio-files"
                    primary="Fichiers audio"
                  />
                  <Switch
                    edge="end"
                    checked={
                      ideInitialState.studentSettings.canUploadAudioFiles
                    }
                    inputProps={{
                      "aria-labelledby": "switch-upload-audio-files",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </List>
            <List
              dense
              subheader={<ListSubheader>Modes de création</ListSubheader>}
            >
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() =>
                    ideInitialStateDispatch({
                      type: "set_student_settings",
                      settings: {
                        canUploadTextFiles:
                          !ideInitialState.studentSettings.canUploadTextFiles,
                        canUploadImageFiles: false,
                        canUploadAudioFiles: false,
                      },
                    })
                  }
                >
                  <ListItemText
                    id="switch-upload"
                    primary="Téléversement de fichiers"
                    secondary="Permet d'envoyer des fichiers depuis l'ordinateur"
                  />
                  <Switch
                    edge="end"
                    checked={
                      ideInitialState.studentSettings.canUploadTextFiles ||
                      ideInitialState.studentSettings.canUploadImageFiles || // May be true only if text is true, but just in case
                      ideInitialState.studentSettings.canUploadAudioFiles // May be true only if text is true, but just in case
                    }
                    inputProps={{
                      "aria-labelledby": "switch-upload",
                    }}
                  />
                </ListItemButton>
              </ListItem>
            </List>
          </DialogContent>
        </Grid>
        {showInitialContentPanel && (
          <Grid
            xs={12}
            md={6}
            lg={8}
            xl={9}
            className={appendClassnames(styles.flexGrow, styles.verticalFlex)}
          >
            <DialogContent
              className={appendClassnames(styles.flexGrow, styles.verticalFlex)}
            >
              <Typography variant="subtitle2">
                Contenu initial (à la création d'un nouveau fichier)
              </Typography>
              <Box
                className={appendClassnames(
                  styles.flexGrow,
                  styles.verticalFlex
                )}
                sx={{ border: "1px solid grey" }}
              >
                <TabContext value={selectedTab}>
                  <Box>
                    <TabList
                      onChange={handleTabChange}
                      aria-label="Types de fichiers"
                    >
                      {ideInitialState.studentSettings.allowedNewTextFileTypes.map(
                        (fileType) => (
                          <Tab
                            label={fileTypesInfo[fileType].shortName}
                            value={fileType}
                            key={fileType}
                          />
                        )
                      )}
                    </TabList>
                  </Box>
                  {ideInitialState.studentSettings.allowedNewTextFileTypes.map(
                    (fileType) => (
                      <TabPanel
                        value={fileType}
                        key={fileType}
                        sx={{ padding: 0 }}
                        className={appendClassnames(
                          styles.flexGrow,
                          styles.verticalFlex
                        )}
                      >
                        <FileTypeInitialContentEditor mimeType={fileType} />
                      </TabPanel>
                    )
                  )}
                </TabContext>
              </Box>
            </DialogContent>
          </Grid>
        )}
      </Grid>
      <DialogActions>
        <MaterialButtonGroup>
          <Button onClick={onClose} variant="contained">
            Valider
          </Button>
        </MaterialButtonGroup>
      </DialogActions>
    </Dialog>
  );
}

type FileTypeInitialContentEditorProps = {
  mimeType: FileType;
};

function FileTypeInitialContentEditor({
  mimeType,
}: FileTypeInitialContentEditorProps) {
  const ideInitialState = useIDEInitialState();
  const ideInitialStateDispatch = useIDEInitialStateDispatch();

  const Editor = mimeToEditor(mimeType);

  const handleEditorChange = (newContent: string) => {
    ideInitialStateDispatch({
      type: "set_file_type_initial_content",
      mime: mimeType,
      content: newContent,
    });
  };

  return (
    <Editor
      initialValue={ideInitialState.fileTypesInitialContent[mimeType] || ""}
      onChange={handleEditorChange}
      lineWrapping={true}
      className={appendClassnames(styles.flexGrow)}
    />
  );
}
