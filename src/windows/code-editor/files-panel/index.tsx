import { useMemo, useRef, useState } from "react";

import styles from "../index.module.scss";

import { PermissionsPanel } from "./PermissionsPanel";
import FileItem from "./FileItem";

import { appendClassnames, getMime } from "../../../utils";

import {
  allowedTextFileTypes,
  allowedImageFileTypes,
  allowedAudioFileTypes,
} from "../../../appSettings";

import { useIDEChosenState } from "../../../contexts/IDEStateProvider";

import { downloadZip } from "client-zip";
import { saveAs } from "file-saver";

import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import KeyboardArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardArrowLeftOutlined";

import {
  RoundedButton,
  MaterialButtonGroup,
} from "../../../features/ui/materialComponents";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { ContentType } from "src/state/types";

type FilesPanelProps = {
  onRequestCreateFile: () => void;
  onRequestRenameFile: (fileName: string) => void;
  onRequestUploadFile: (fileName: string, fileContent: string | Blob) => void;
  onRequestDeleteFile: (fileName: string) => void;
};

export default function FilesPanel({
  onRequestCreateFile,
  onRequestRenameFile,
  onRequestUploadFile,
  onRequestDeleteFile,
}: FilesPanelProps) {
  const ideState = useIDEChosenState();
  const inputRef = useRef(null);
  const [permissionsPanelOpen, setPermissionsPanelOpen] = useState(true);
  const sortedFileNames = useMemo(() => {
    return Object.keys(ideState.filesData).sort((a, b) => a.localeCompare(b));
  }, [ideState.filesData]);
  const acceptedUploadFileTypesStr = useMemo(() => {
    const acceptedUploadedTextFileTypes = ideState.settings.canUploadTextFiles
      ? ideState.settings.allowedNewTextFileTypes
      : [];
    const acceptedUploadedImageFileTypes = ideState.settings.canUploadImageFiles
      ? allowedImageFileTypes
      : [];
    const acceptedUploadedAudioFileTypes = ideState.settings.canUploadAudioFiles
      ? allowedAudioFileTypes
      : [];
    const acceptedUploadFileTypes = [
      ...acceptedUploadedTextFileTypes,
      ...acceptedUploadedImageFileTypes,
      ...acceptedUploadedAudioFileTypes,
    ];
    return acceptedUploadFileTypes.join(",");
  }, [ideState.settings]);

  async function downloadAll() {
    let filesToZip = [];
    for (const [file, fileData] of Object.entries(ideState.filesData)) {
      if (fileData.contentType === "text") {
        filesToZip.push({
          name: file,
          input: fileData.content,
        });
      } else {
        filesToZip.push({
          name: file,
          input: fileData.blob,
        });
      }
    }
    const zipBlob = await downloadZip(filesToZip).blob();
    saveAs(zipBlob, "exercice.zip");
  }

  return (
    <aside
      className={appendClassnames(
        styles.filesPane,
        ideState.settings.canSetFilesPermissions
          ? styles.canSetFilesPermissions
          : null,
        permissionsPanelOpen ? styles.permissionsPanelOpen : null
      )}
    >
      {ideState.settings.canSetFilesPermissions && (
        <>
          <div className={styles.filesPaneHeader}>
            <Typography variant="h6" component="h2">
              Permissions élève
            </Typography>
            <MaterialButtonGroup>
              {ideState.settings.allowedNewTextFileTypes.length > 0 && (
                <RoundedButton
                  icon={
                    permissionsPanelOpen ? (
                      <KeyboardArrowDownOutlinedIcon />
                    ) : (
                      <KeyboardArrowLeftOutlinedIcon />
                    )
                  }
                  round={true}
                  border={false}
                  onClick={() => setPermissionsPanelOpen((prev) => !prev)}
                />
              )}
            </MaterialButtonGroup>
          </div>
          {permissionsPanelOpen && <PermissionsPanel />}
        </>
      )}
      <div className={styles.filesPaneHeader}>
        <Typography variant="h6" component="h2">
          Fichiers
        </Typography>
        <MaterialButtonGroup>
          {acceptedUploadFileTypesStr !== "" && (
            <>
              <RoundedButton
                icon={<FileUploadOutlinedIcon />}
                round={true}
                border={false}
                onClick={function () {
                  inputRef.current?.click();
                }}
              />
              <input
                ref={inputRef}
                style={{ display: "none" }}
                type="file"
                accept={acceptedUploadFileTypesStr}
                onChange={(e) => {
                  if (!e.target.files) return;
                  const file = e.target.files[0];
                  const fileName = file.name;
                  const fileMime = file.type;
                  const isBinary =
                    fileMime.startsWith("image/") ||
                    fileMime.startsWith("audio/");
                  if (isBinary) {
                    onRequestUploadFile(fileName, file);
                  } else {
                    const reader = new FileReader();
                    reader.onload = (eLoader) => {
                      onRequestUploadFile(
                        fileName,
                        eLoader.target.result as string
                      );
                    };
                    reader.readAsText(file);
                  }
                  inputRef.current!.value = "";
                }}
              />
            </>
          )}
          {ideState.settings.allowedNewTextFileTypes.length > 0 && (
            <RoundedButton
              icon={<AddOutlinedIcon />}
              round={true}
              border={false}
              onClick={onRequestCreateFile}
            />
          )}
        </MaterialButtonGroup>
      </div>
      <div className={styles.filesPaneFileList}>
        {sortedFileNames.map((fileName) => {
          return (
            <FileItem
              key={fileName}
              fileName={fileName}
              onRequestRename={() => onRequestRenameFile(fileName)}
              onRequestDelete={() => onRequestDeleteFile(fileName)}
            />
          );
        })}
      </div>
      <div className={styles.filesPaneFooter}>
        {ideState.settings.canDownloadFiles && (
          <Button variant="outlined" size="small" onClick={downloadAll}>
            Tout télécharger
          </Button>
        )}
      </div>
    </aside>
  );
}
