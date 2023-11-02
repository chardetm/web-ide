import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { MaterialButtonGroup } from "../../features/ui/materialComponents";

type PreviewModeInfoDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function PreviewModeInfoDialog({
  open,
  onClose,
}: PreviewModeInfoDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Mode prévisualisation</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Le mode prévisualisation permet de tester votre exercice{" "}
          <strong>du point de vue d'un élève</strong>. Vous pouvez ajouter,
          supprimer, renommer et modifier des fichiers sans crainte :{" "}
          <strong>
            les modifications que vous apportez ne seront pas sauvegardées
          </strong>
          .
        </Typography>
        <br />
        <Typography variant="body1">
          À chaque fois que vous changez de mode puis revenez en mode
          prévisualisation,{" "}
          <strong>les fichiers sont réinitialisés à leur état initial</strong>.
          Si vous enregistrez votre activité alors que vous êtes en mode
          prévisualisation,{" "}
          <strong>c'est l'état initial qui sera sauvegardé</strong> et non
          l'état actuel de la prévisualisation.
        </Typography>
      </DialogContent>
      <DialogActions>
        <MaterialButtonGroup>
          <Button onClick={onClose} variant="contained">
            Fermer
          </Button>
        </MaterialButtonGroup>
      </DialogActions>
    </Dialog>
  );
}
