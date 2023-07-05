import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormGroup,
  InputAdornment,
  TextField,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { fileTypesInfo } from "../../appSettings";
import {
  useIDEChosenState,
  useIDEChosenStateDispatch,
} from "../../contexts/IDEStateProvider";
import {
  MaterialButtonGroup,
  MaterialTileSelector,
} from "../../features/ui/materialComponents";
import { getExtension, isValidFilename } from "../../utils";

import styles from "./dialogs.module.scss";
import { useRef } from "react";

export function CreateFileDialog({ open, onClose }) {
  const ideState = useIDEChosenState();
  const ideStateDispatch = useIDEChosenStateDispatch();
  const [filenameNoExtension, setFilenameNoExtension] = useState("");
  const firstInputRef = useRef(null);

  useEffect(() => {
    setFilenameNoExtension("");
    if (open) {
      setTimeout(() => {
        if (firstInputRef.current) {
          firstInputRef.current.focus();
        }
      }, 100);
    }
  }, [open]);

  const filenameValidity = useMemo(
    () => isValidFilename(filenameNoExtension, Object.keys(ideState.filesData)),
    [filenameNoExtension, ideState.filesData]
  );

  const options = useMemo(() => {
    const result = {};
    ideState.settings.allowedNewTextFileTypes.forEach(function (type) {
      result[type] = fileTypesInfo[type].label;
    });
    return result;
  }, [ideState.settings.allowedNewTextFileTypes]);

  const [selectedFileTypeMime, setSelectedFileTypeMime] = useState(
    ideState.settings.allowedNewTextFileTypes[0]
  );

  useEffect(() => {
    setSelectedFileTypeMime(ideState.settings.allowedNewTextFileTypes[0]);
  }, [ideState.settings.allowedNewTextFileTypes]);

  const onSubmit = () => {
    ideStateDispatch({
      type: "create_new_file",
      fileName: filenameNoExtension + "." + getExtension(selectedFileTypeMime),
      initialContent: "",
      open: true,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Nouveau fichier</DialogTitle>
      <DialogContent>
        <FormGroup>
          <MaterialTileSelector
            options={options}
            selected={selectedFileTypeMime}
            onChange={function (value) {
              setSelectedFileTypeMime(value);
              firstInputRef.current.focus();
            }}
          />
        </FormGroup>
        <FormGroup>
          <TextField
            inputRef={firstInputRef}
            className={styles.filenameInput}
            label="Nom du fichier"
            value={filenameNoExtension}
            onChange={function (e) {
              setFilenameNoExtension(e.target.value);
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  .{getExtension(selectedFileTypeMime)}
                </InputAdornment>
              ),
            }}
            onKeyDown={function (e) {
              if (e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation();
                onSubmit();
              }
            }}
            error={filenameNoExtension !== "" && filenameValidity[0] === false}
            helperText={filenameNoExtension === "" ? " " : filenameValidity[1]}
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
              filenameNoExtension === "" || filenameValidity[0] === false
            }
          >
            Créer
          </Button>
        </MaterialButtonGroup>
      </DialogActions>
    </Dialog>
  );
}
