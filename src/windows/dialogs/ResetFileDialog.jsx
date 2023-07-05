import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import {
  useIDEState,
  useIDEInitialState,
  useIDEStateDispatch,
} from "../../contexts/IDEStateProvider";
import { MaterialButtonGroup } from "../../features/ui/materialComponents";

export function ResetFileDialog({ fileName, open, onClose }) {
  const ideInitialState = useIDEInitialState();
  const ideState = useIDEState();
  const ideStateDispatch = useIDEStateDispatch();
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Réinitialiser {fileName}</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Êtes-vous sûr de vouloir réinitialiser {fileName} avec son contenu
          initial ?
        </Typography>
      </DialogContent>
      <DialogActions>
        <MaterialButtonGroup>
          <Button onClick={onClose} variant="outlined">
            Annuler
          </Button>
          <Button
            onClick={() => {
              ideStateDispatch({
                type: "set_file_content",
                fileName: fileName,
                content:
                  ideInitialState.filesData[
                    ideState.filesData[fileName].initialName
                  ].content,
              });
              onClose();
            }}
            variant="contained"
          >
            Réinitialiser
          </Button>
        </MaterialButtonGroup>
      </DialogActions>
    </Dialog>
  );
}
