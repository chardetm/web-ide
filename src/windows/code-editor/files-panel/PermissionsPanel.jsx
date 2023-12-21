import { useState } from "react";

import styles from "../index.module.scss";

import { fileTypesInfo, allowedTextFileTypes } from "../../../appSettings";
import {
  useIDEInitialState,
  useIDEInitialStateDispatch,
} from "../../../contexts/IDEStateProvider";

import { FileCreationPermissionDialog } from "../../dialogs/FileCreationPermissionDialog";
import { PreviewModeDialog } from "../../dialogs/PreviewModeDialog";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Switch from "@mui/material/Switch";

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
    ideInitialState.studentSettings.canUploadImageFiles ||
    ideInitialState.studentSettings.canUploadAudioFiles;

  let fileCreationText = "";
  const allAllowedTypes = [
    ...allowedTextFileTypes
      .filter((e) =>
        ideInitialState.studentSettings.allowedNewTextFileTypes.includes(e)
      )
      .map((e) => fileTypesInfo[e].shortName),
    ...(ideInitialState.studentSettings.canUploadImageFiles ? ["images"] : []),
    ...(ideInitialState.studentSettings.canUploadAudioFiles ? ["audio"] : []),
  ];
  const allowedTextFileTypesText = allAllowedTypes.join(", ");
  if (allowedTextFileTypesText.length > 0) {
    fileCreationText =
      allowedTextFileTypesText[0].toUpperCase() +
      allowedTextFileTypesText.slice(1);
    if (
      ideInitialState.studentSettings.canUploadTextFiles ||
      ideInitialState.studentSettings.canUploadImageFiles ||
      ideInitialState.studentSettings.canUploadAudioFiles
    ) {
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
                        canUploadAudioFiles: false,
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
                  onlySeeBody: !ideInitialState.studentSettings.onlySeeBody,
                },
              })
            }
          >
            <ListItemText
              id="switch-list-label-only-see-body"
              primary="Ne voir que le corps (HTML)"
            />
            <Switch
              edge="end"
              checked={ideInitialState.studentSettings.onlySeeBody}
              inputProps={{
                "aria-labelledby": "switch-list-label-only-see-body",
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
                  autoCloseTags: !ideInitialState.studentSettings.autoCloseTags,
                },
              })
            }
          >
            <ListItemText
              id="switch-list-label-auto-close-tags"
              primary="Fermeture auto. balises"
            />
            <Switch
              edge="end"
              checked={ideInitialState.studentSettings.autoCloseTags}
              inputProps={{
                "aria-labelledby": "switch-list-label-auto-close-tags",
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );
}
