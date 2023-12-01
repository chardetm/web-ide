import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";

import { MaterialButtonGroup } from "../../features/ui/materialComponents";

type OpenExternalLinkDialogProps = {
  link: string;
  open: boolean;
  onClose: () => void | Promise<void>;
};

function OpenExternalLinkDialog({
  link,
  open,
  onClose,
}: OpenExternalLinkDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Ouvrir lien externe</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Ce lien externe ne peut pas être ouvert dans la prévisualisation.
          Voulez-vous ouvrir la page suivante dans un nouvel onglet ?
        </Typography>
        <Typography variant="body1" marginTop={1}>{link}</Typography>
      </DialogContent>
      <DialogActions>
        <MaterialButtonGroup>
          <Button onClick={onClose} variant="outlined">
            Annuler
          </Button>
          <Button
            href={link}
            rel="noreferrer"
            target="_blank"
            onClick={() => {
              onClose();
            }}
            variant="contained"
          >
            Ouvrir
          </Button>
        </MaterialButtonGroup>
      </DialogActions>
    </Dialog>
  );
}

export default OpenExternalLinkDialog;
