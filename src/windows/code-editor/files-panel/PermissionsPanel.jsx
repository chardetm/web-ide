import { useState } from "react";

import styles from "../index.module.scss";

import { fileTypesInfo, allowedTextFileTypes } from "../../../appSettings";
import {
  useIDEInitialState,
  useIDEInitialStateDispatch,
} from "../../../contexts/IDEStateProvider";

import { FileCreationPermissionDialog } from "../../dialogs/FileCreationPermissionDialog";
import { PreviewModeDialog } from "../../dialogs/PreviewModeDialog";

import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Switch,
} from "@mui/material";

export function PermissionsPanel() {
  const ideInitialState = useIDEInitialState();
  const ideInitialStateDispatch = useIDEInitialStateDispatch();
  const [
    fileCreationPermissionsDialogOpen,
    setFileCreationPermissionsDialogOpen,
  ] = useState(false);
  const [previeModeDialogOpen, setPreviewModeDialogOpen] = useState(false);

  const createFilesSwitchState =
    ideInitialState.studentSettings.allowedNewTextFileTypes.length > 0 ||
    ideInitialState.studentSettings.canUploadImageFiles;

  let fileCreationText = "";

  if (ideInitialState.studentSettings.allowedNewTextFileTypes.length === 0) {
    if (ideInitialState.studentSettings.canUploadImageFiles) {
      fileCreationText = "Images, téléversement";
    }
  } else {
    const allowedTextMimeTypes = allowedTextFileTypes.filter((e) =>
      ideInitialState.studentSettings.allowedNewTextFileTypes.includes(e)
    );
    const allowedTextFileTypesText = allowedTextMimeTypes
      .map((e) => fileTypesInfo[e].shortName)
      .join(", ");
    fileCreationText = allowedTextFileTypesText;
    if (ideInitialState.studentSettings.canUploadImageFiles) {
      fileCreationText += ", images";
    }
    if (ideInitialState.studentSettings.canUploadTextFiles) {
      fileCreationText += ", téléversement";
    }
  }

  return (
    <div className={styles.permissionsPanel}>
      <FileCreationPermissionDialog
        open={fileCreationPermissionsDialogOpen}
        onClose={() => setFileCreationPermissionsDialogOpen(false)}
      />
      <PreviewModeDialog
        open={previeModeDialogOpen}
        onClose={() => setPreviewModeDialogOpen(false)}
      />
      <List dense>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() =>
              ideInitialStateDispatch({
                type: "set_student_settings",
                settings: {
                  canSeeFilesList:
                    !ideInitialState.studentSettings.canSeeFilesList,
                  canOpenAndCloseTabs:
                    !ideInitialState.studentSettings.canSeeFilesList, // If the user can't see the files list, they can't open nor close tabs
                },
              })
            }
          >
            <ListItemText
              id="switch-list-label-see-files"
              primary="Voir la liste des fichiers"
            />
            <Switch
              edge="end"
              checked={ideInitialState.studentSettings.canSeeFilesList}
              inputProps={{
                "aria-labelledby": "switch-list-label-see-files",
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
                  canDownloadFiles:
                    !ideInitialState.studentSettings.canDownloadFiles,
                },
              })
            }
          >
            <ListItemText
              id="switch-list-label-download-files"
              primary="Télécharger les fichiers"
            />
            <Switch
              edge="end"
              checked={ideInitialState.studentSettings.canDownloadFiles}
              inputProps={{
                "aria-labelledby": "switch-list-label-download-files",
              }}
            />
          </ListItemButton>
        </ListItem>
        {ideInitialState.studentSettings.canSeeFilesList && (
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => setFileCreationPermissionsDialogOpen(true)}
            >
              <ListItemText
                id="switch-list-label-create-files"
                primary="Créer des fichiers"
                secondary={fileCreationText}
              />
              <Switch
                onClick={(e) => {
                  e.stopPropagation();
                  if (createFilesSwitchState) {
                    ideInitialStateDispatch({
                      type: "set_student_settings",
                      settings: {
                        canUploadImageFiles: false,
                        canUploadTextFiles: false,
                        allowedNewTextFileTypes: [],
                      },
                    });
                  } else {
                    setFileCreationPermissionsDialogOpen(true);
                  }
                }}
                edge="end"
                checked={createFilesSwitchState}
                inputProps={{
                  "aria-labelledby": "switch-list-label-create-files",
                }}
              />
            </ListItemButton>
          </ListItem>
        )}
        <ListItem disablePadding>
          <ListItemButton onClick={() => setPreviewModeDialogOpen(true)}>
            <ListItemText
              primary="Mode de prévisualisation"
              secondary={
                (ideInitialState.studentSettings.previewIsLive
                  ? "En direct"
                  : "Différé") +
                ", " +
                (ideInitialState.studentSettings.canChangePreviewMode
                  ? "libre"
                  : "forcé")
              }
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() =>
              ideInitialStateDispatch({
                type: "set_student_settings",
                settings: {
                  autoCloseTags: !ideInitialState.studentSettings.autoCloseTags,
                },
              })
            }
          >
            <ListItemText
              id="switch-list-label-see-files"
              primary="Fermeture auto. balises"
            />
            <Switch
              edge="end"
              checked={ideInitialState.studentSettings.autoCloseTags}
              inputProps={{
                "aria-labelledby": "switch-list-label-see-files",
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );
}
