import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import Switch from "@mui/material/Switch";

import { MaterialButtonGroup } from "../../features/ui/materialComponents";
import { allowedTextFileTypes, fileTypesInfo } from "../../appSettings";
import {
  useIDEInitialState,
  useIDEInitialStateDispatch,
} from "../../contexts/IDEStateProvider";

export function FileCreationPermissionDialog({ open, onClose }) {
  const ideInitialState = useIDEInitialState();
  const ideInitialStateDispatch = useIDEInitialStateDispatch();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Création de fichiers</DialogTitle>
      <DialogContent>
        <List
          dense
          subheader={<ListSubheader>Types de fichiers autorisés</ListSubheader>}
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
                  <ListItemText id={fileType} primary={fileTypesInfo[fileType].name} />
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
                checked={ideInitialState.studentSettings.canUploadImageFiles}
                inputProps={{
                  "aria-labelledby": "switch-upload-images",
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
                  },
                })
              }
            >
              <ListItemText
                id="switch-upload"
                primary="Téléversement de fichiers"
                secondary="Permet d'envoyer des fichiers depuis l'orinateur"
              />
              <Switch
                edge="end"
                checked={
                  ideInitialState.studentSettings.canUploadTextFiles ||
                  ideInitialState.studentSettings.canUploadImageFiles // May be true only if text is true, but just in case
                }
                inputProps={{
                  "aria-labelledby": "switch-upload",
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </DialogContent>
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
