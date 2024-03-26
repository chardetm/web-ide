import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormGroup from "@mui/material/FormGroup";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";

import { useEffect, useMemo, useState } from "react";
import {
  useIDEChosenState,
  useIDEChosenStateDispatch,
} from "../../contexts/IDEStateProvider";
import { MaterialButtonGroup } from "../../features/ui/materialComponents";
import { isValidFilename, splitFileNameExtension } from "../../utils";

import styles from "./dialogs.module.scss";
import { useRef } from "react";

export function RenameFileDialog({ fileName, open, onClose }) {
  const ideState = useIDEChosenState();
  const ideStateDispatch = useIDEChosenStateDispatch();
  const firstInputRef = useRef(null);
  const extension = useMemo(
    () => splitFileNameExtension(fileName)[1],
    [fileName]
  );
  const [fileNameNoExtension, setFileNameNoExtension] = useState(
    splitFileNameExtension(fileName)[1]
  );
  useEffect(() => {
    setFileNameNoExtension(splitFileNameExtension(fileName)[0]);
  }, [fileName, open]);
  const fileNameValidity = useMemo(
    () =>
      isValidFilename(
        fileNameNoExtension,
        Object.keys(ideState.filesData).filter(function (name) {
          return name !== fileName;
        })
      ),
    [fileNameNoExtension, fileName, ideState.filesData]
  );

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        if (firstInputRef.current) {
          firstInputRef.current.select();
        }
      }, 100);
    }
  }, [open]);

  const onSubmit = () => {
    ideStateDispatch({
      type: "rename_file",
      oldFileName: fileName,
      newFileName: fileNameNoExtension + "." + extension,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Renommer {fileName}</DialogTitle>
      <DialogContent>
        <FormGroup>
          <TextField
            inputRef={firstInputRef}
            className={styles.filenameInput}
            label="Nom du fichier"
            value={fileNameNoExtension}
            onChange={function (e) {
              setFileNameNoExtension(e.target.value);
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">.{extension}</InputAdornment>
              ),
            }}
            onKeyDown={function (e) {
              if (e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation();
                onSubmit();
              }
            }}
            error={fileNameNoExtension !== "" && fileNameValidity[0] === false}
            helperText={fileNameNoExtension === "" ? " " : fileNameValidity[1]}
          />
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <MaterialButtonGroup>
          <Button onClick={onClose} variant="outlined">
            Annuler
          </Button>
          <Button
            onClick={onSubmit}
            variant="contained"
            disabled={
              fileNameNoExtension === "" || fileNameValidity[0] === false
            }
          >
            Renommer
          </Button>
        </MaterialButtonGroup>
      </DialogActions>
    </Dialog>
  );
}
