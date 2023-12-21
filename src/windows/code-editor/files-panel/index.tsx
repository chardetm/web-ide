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

import {
  MaterialIcon,
  RoundedButton,
  MaterialButtonGroup,
} from "../../../features/ui/materialComponents";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { ContentType } from "src/state/types";

type FilesPanelProps = {
  onRequestCreateFile: () => void;
  onRequestRenameFile: (fileName: string) => void;
  onRequestUploadFile: (
    fileName: string,
    fileContent: string,
    contentType: ContentType
  ) => void;
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
        const fileBlob = await (await fetch(fileData.content)).blob();
        filesToZip.push({
          name: file,
          input: fileBlob,
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
                    <MaterialIcon
                      name={
                        permissionsPanelOpen
                          ? "keyboard_arrow_down"
                          : "keyboard_arrow_left"
                      }
                    />
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
                icon={<MaterialIcon name={"upload"} />}
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
                  const file = e.target.files[0];
                  const fileName = e.target.files[0].name;
                  const fileMime = e.target.files[0].type;
                  const reader = new FileReader();
                  const isBinary = fileMime.startsWith("image/") || fileMime.startsWith("audio/");
                  reader.onload = (eLoader) => {
                    onRequestUploadFile(
                      fileName,
                      eLoader.target.result as string,
                      isBinary ? "base64" : "text"
                    );
                  };
                  if (isBinary) {
                    reader.readAsDataURL(file);
                  } else {
                    reader.readAsText(file);
                  }
                }}
              />
            </>
          )}
          {ideState.settings.allowedNewTextFileTypes.length > 0 && (
            <RoundedButton
              icon={<MaterialIcon name={"add"} />}
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
