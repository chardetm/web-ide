import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";

import { MaterialButtonGroup } from "../../features/ui/materialComponents";
import { useMemo } from "react";
import { isAbsoluteUrl } from "../../utils";
import { Alert } from "@mui/material";

type FormSubmitDialogProps = {
  method: "get" | "post" | String | null;
  action: string | null;
  data: Object;
  open: boolean;
  onClose: () => void | Promise<void>;
};

function FormSubmitDialog({
  method,
  action,
  data,
  open,
  onClose,
}: FormSubmitDialogProps) {
  const [link, isAbsolute] = useMemo<[string, boolean]>(() => {
    if (method === "post" || !action) return ["", false];
    console.log("action", action);
    const searchParams = new URLSearchParams();
    for (const key in data) {
      if (Array.isArray(data[key])) {
        for (const value of data[key]) {
          searchParams.append(key, value);
        }
      } else {
        searchParams.append(key, data[key]);
      }
    }
    const searchParamsString = searchParams.toString();
    if (isAbsoluteUrl(action)) {
      try {
        const url = new URL(action);
        url.search = searchParamsString;
        return [url.toString(), true];
      } catch (e) {
        return [`${action}?${searchParamsString}`, false];
      }
    } else {
      return [`${action}?${searchParamsString}`, false];
    }
  }, [method, action, data]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Soumettre formulaire</DialogTitle>
      <DialogContent>
        {method && method !== "get" && method !== "post" && (
          <Alert
            severity="warning"
            style={{
              marginBottom: "0.5rem",
            }}
          >
            La méthode « {method} » est invalide.
          </Alert>
        )}
        <Typography variant="body1">
          Ce formulaire ne peut pas être soumis dans la prévisualisation.
        </Typography>
        <Typography variant="subtitle2" marginTop={1}>
          Données :
        </Typography>
        <pre
          style={{
            maxHeight: "300px",
            overflow: "auto",
            marginTop: 0,
          }}
        >
          {JSON.stringify(data, null, 2)}
        </pre>
        {method !== "post" && isAbsolute && (
          <>
            <Typography variant="body1" marginTop={1}>
              Voulez-vous ouvrir la page suivante dans un nouvel onglet ?
            </Typography>
          </>
        )}
        {method === "post" && (
          <Typography variant="body1" marginTop={1}>
            Il n'est pas possible de soumettre un formulaire avec la méthode
            POST dans un nouvel onglet.
          </Typography>
        )}
        {method !== "post" && !isAbsolute && (
          <>
            <Typography variant="body1" marginTop={1}>
              Il n'est pas possible de soumettre un formulaire avec une action à
              chemin relatif dans la prévisualisation. Le chemin serait :
            </Typography>
            <Typography
              variant="body2"
              marginTop={1}
              style={{
                overflowWrap: "anywhere",
              }}
            >
              {link}
            </Typography>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <MaterialButtonGroup>
          <Button onClick={onClose} variant="outlined">
            {method === "post" || !isAbsolute ? "Fermer" : "Annuler"}
          </Button>
          {method !== "post" && isAbsolute && (
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
          )}
        </MaterialButtonGroup>
      </DialogActions>
    </Dialog>
  );
}

export default FormSubmitDialog;
