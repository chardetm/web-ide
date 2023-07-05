import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import {
  useIDEChosenStateDispatch,
} from "../../contexts/IDEStateProvider";
import { MaterialButtonGroup } from "../../features/ui/materialComponents";

export function DeleteFileDialog({ fileName, open, onClose }) {
  const ideStateDispatch = useIDEChosenStateDispatch();

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Supprimer {fileName}</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Êtes-vous sûr de vouloir supprimer {fileName} ?
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
                type: "delete_file",
                fileName: fileName,
              });
              onClose();
            }}
            variant="contained"
          >
            Supprimer
          </Button>
        </MaterialButtonGroup>
      </DialogActions>
    </Dialog>
  );
}
