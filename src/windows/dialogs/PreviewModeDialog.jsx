import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Switch,
} from "@mui/material";
import { MaterialButtonGroup } from "../../features/ui/materialComponents";
import {
  useIDEInitialState,
  useIDEInitialStateDispatch,
} from "../../contexts/IDEStateProvider";

export function PreviewModeDialog({ open, onClose }) {
  const ideInitialState = useIDEInitialState();
  const ideInitialStateDispatch = useIDEInitialStateDispatch();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Mode de prévisualisation</DialogTitle>
      <DialogContent>
        <List
          dense
        >
          <ListItem disablePadding>
            <ListItemButton
              onClick={() => {
                ideInitialStateDispatch({
                  type: "set_student_settings",
                  settings: {
                    previewIsLive:
                      !ideInitialState.studentSettings.previewIsLive,
                  }
                });
              }}
            >
              <ListItemText id='switch-live-preview' primary='En direct' />
              <Switch
                edge="end"
                checked={ideInitialState.studentSettings.previewIsLive}
                inputProps={{
                  "aria-labelledby": 'switch-live-preview',
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
                    canChangePreviewMode:
                      !ideInitialState.studentSettings.canChangePreviewMode,
                  },
                })
              }
            >
              <ListItemText id="switch-can-change-preview-mode" primary="Choix libre" />
              <Switch
                edge="end"
                checked={ideInitialState.studentSettings.canChangePreviewMode}
                inputProps={{
                  "aria-labelledby": "switch-can-change-preview-mode",
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
