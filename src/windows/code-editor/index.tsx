import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { TabbedWindow } from "../../features/windows/WindowWithTabs";
import { Spacer } from "../../features/ui/basicComponents";
import {
  MaterialIcon,
  RoundedButton,
  MaterialButtonGroup,
  MaterialButtonSeparator,
} from "../../features/ui/materialComponents";

import ZoomInRoundedIcon from "@mui/icons-material/ZoomInRounded";
import ZoomOutRoundedIcon from "@mui/icons-material/ZoomOutRounded";

import styles from "./index.module.scss";

import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

import { appendClassnames, downloadFile, getMime } from "../../utils";
import {
  FileType,
  allowedImageFileTypes,
  allowedAudioFileTypes,
} from "../../appSettings";
import {
  useIDEChosenState,
  useIDEChosenStateDispatch,
  useIDEInitialState,
} from "../../contexts/IDEStateProvider";
import { CreateFileDialog } from "../dialogs/CreateFileDialog";
import { RenameFileDialog } from "../dialogs/RenameFileDialog";
import { DeleteFileDialog } from "../dialogs/DeleteFileDialog";
import { ResetFileDialog } from "../dialogs/ResetFileDialog";
import { allowedTextFileTypes } from "../../appSettings";
import { mimeToEditor, mimeToIcon } from "../../features/code-editor/utils";
import FilesPanel from "./files-panel/index";
import { useAppStore } from "../../store";

export type CodeEditorWindowProps = {
  onMaximize?: () => void;
  onDemaximize?: () => void;
  className?: string;
};

export default function CodeEditorWindow({
  onMaximize,
  onDemaximize,
  className,
}: CodeEditorWindowProps) {
  const codeZoomLevel = useAppStore((state) => state.codeZoomLevel);
  const increaseCodeZoomLevel = useAppStore(
    (state) => state.increaseCodeZoomLevel
  );
  const decreaseCodeZoomLevel = useAppStore(
    (state) => state.decreaseCodeZoomLevel
  );
  const ideState = useIDEChosenState();
  const ideStateDispatch = useIDEChosenStateDispatch();
  const ideInitialState = useIDEInitialState();
  const [filesPanelOpen, setFilesPanelOpen] = useState(
    ideState.settings.canSeeFilesList
  );
  const [renameFileDialogOpen, setRenameFileDialogOpen] = useState(false);
  const [deleteFileDialogOpen, setDeleteFileDialogOpen] = useState(false);
  const [resetFileDialogOpen, setResetFileDialogOpen] = useState(false);
  const [createFileDialogOpen, setCreateFileDialogOpen] = useState(false);
  const [renameFileDialogFileName, setRenameFileDialogFileName] = useState("");
  const [deleteFileDialogFileName, setDeleteFileDialogFileName] = useState("");
  const [resetFileDialogFileName, setResetFileDialogFileName] = useState("");
  const editorRef = useRef(null);
  const activeFileMime = useMemo<FileType>(
    () => getMime(ideState.activeFile) as FileType,
    [ideState.activeFile]
  );
  const showToolbar = useMemo(() => {
    return ideState.activeFile !== null;
  }, [ideState.activeFile]);
  const Editor = useMemo(() => mimeToEditor(activeFileMime), [activeFileMime]);
  const tabs = useMemo(() => {
    return Object.fromEntries(
      ideState.openedFiles.map((fileName) => {
        const mime = getMime(fileName) as FileType;
        return [
          fileName,
          {
            title: fileName,
            subtitle:
              mime === "text/html" && ideState.settings.onlySeeBody
                ? "corps"
                : null,
            icon: mimeToIcon(mime),
            onClose: ideState.settings.canOpenAndCloseTabs
              ? () => {
                  ideStateDispatch({
                    type: "close_file",
                    fileName: fileName,
                  });
                }
              : undefined,
          },
        ];
      })
    );
  }, [
    ideState.openedFiles,
    ideState.settings.canOpenAndCloseTabs,
    ideStateDispatch,
  ]);

  useEffect(() => {
    setFilesPanelOpen(ideState.settings.canSeeFilesList);
  }, [ideState.settings.canSeeFilesList]);

  const activeFileData = ideState.filesData[ideState.activeFile];
  const startActiveFileContent = useMemo(
    () =>
      activeFileData.contentType === "text"
        ? activeFileData.content
        : activeFileData.blobUrl,
    [ideState.activeFile]
  );
  const initialFileData = activeFileData
    ? ideInitialState.filesData[activeFileData.initialName]
    : null;

  const onChange = useCallback(
    (content) =>
      ideStateDispatch({
        type: "set_file_content",
        fileName: ideState.activeFile,
        content: content,
      }),
    [ideStateDispatch, ideState.activeFile]
  );

  const debouncedOnChange = useMemo(() => {
    let timeout = null;
    return (content) => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => {
        onChange(content);
      }, 250);
    };
  }, [onChange]);

  return (
    <TabbedWindow
      className={appendClassnames(className, styles.codeEditorWindow)}
      windowContentClassName={appendClassnames(
        styles.codeWindowContent,
        ideState.settings.canSetFilesPermissions
          ? styles.canSetFilesPermissions
          : null
      )}
      aria-label="Éditeur de code"
      icon={<MaterialIcon.Rounded name="edit_note" />}
      title="Éditeur de code"
      tabs={tabs}
      activeTabId={ideState.activeFile}
      onMaximize={onMaximize}
      onDemaximize={onDemaximize}
      onTabChange={(fileName) => {
        ideStateDispatch({
          type: "set_active_file",
          fileName: fileName,
        });
      }}
      toolbarContent={
        !showToolbar ? null : (
          <>
            {ideState.settings.canSeeFilesList && (
              <MaterialButtonGroup>
                <RoundedButton
                  className={styles.filesPanelToggle}
                  round={true}
                  icon={
                    <MaterialIcon.Outlined
                      name={filesPanelOpen ? "folder_off" : "folder"}
                    />
                  }
                  border={false}
                  onClick={() => {
                    setFilesPanelOpen((wasOpened) => !wasOpened);
                  }}
                />
              </MaterialButtonGroup>
            )}

            <MaterialButtonGroup>
              {initialFileData &&
                (activeFileData.contentType !== initialFileData?.contentType ||
                  activeFileData.contentType === "text") && (
                  <RoundedButton
                    label="Réinitialiser"
                    icon={<MaterialIcon.Rounded name="device_reset" />}
                    border={true}
                    disabled={
                      activeFileData.contentType ===
                        initialFileData.contentType &&
                      activeFileData.contentType === "text" &&
                      activeFileData.content === //@ts-ignore
                        initialFileData.content
                    }
                    onClick={function () {
                      setResetFileDialogFileName(ideState.activeFile);
                      setResetFileDialogOpen(true);
                    }}
                  />
                )}
              {ideState.settings.canDownloadFiles && (
                <RoundedButton
                  label="Télécharger"
                  icon={<MaterialIcon.Rounded name="download" />}
                  border={true}
                  onClick={function () {
                    downloadFile(
                      ideState.activeFile,
                      activeFileData.contentType === "text"
                        ? activeFileData.content
                        : activeFileData.blob
                    );
                  }}
                />
              )}
            </MaterialButtonGroup>
            {false && // To remove when implemented
              ideState.settings.canSetVisibilityBounds &&
              allowedTextFileTypes.includes(activeFileMime) && (
                <>
                  <MaterialButtonSeparator />
                  <MaterialButtonGroup>
                    <RoundedButton
                      label="Définir zone visible"
                      icon={<MaterialIcon.Rounded name="visibility" />}
                      border={true}
                      onClick={function () {
                        console.log(editorRef); // TODO: remove
                        const from =
                          editorRef.current.view.viewState.state.selection
                            .ranges[0].from;
                        const to =
                          editorRef.current.view.viewState.state.selection
                            .ranges[0].to;
                        const firstLine =
                          editorRef.current.state.doc.lineAt(from);
                        const lastLine = editorRef.current.state.doc.lineAt(to);
                        console.log(
                          // TODO: remove
                          editorRef.current.view.viewState.state.selection
                            .ranges[0]
                        );
                        console.log(firstLine, lastLine); // TODO: remove
                      }}
                    />
                  </MaterialButtonGroup>
                </>
              )}
            <Spacer />
            <MaterialButtonGroup>
              {activeFileMime in ideState.settings.allowedSyntaxCheckers && (
                <RoundedButton
                  label="Vérifier la syntaxe"
                  icon={<MaterialIcon.Rounded name="spellcheck" />}
                  border={true}
                  onClick={function () {
                    alert("Bientôt disponible !");
                  }}
                />
              )}
            </MaterialButtonGroup>
            <Spacer />
            <MaterialButtonGroup>
              {allowedTextFileTypes.includes(activeFileMime) && (
                <>
                  <div
                    style={{
                      display: "flex",
                      gap: 0,
                    }}
                  >
                    <RoundedButton
                      round={true}
                      icon={<ZoomOutRoundedIcon />}
                      border={true}
                      onClick={decreaseCodeZoomLevel}
                      disabled={codeZoomLevel <= 2}
                      style={{
                        borderTopRightRadius: 0,
                        borderBottomRightRadius: 0,
                      }}
                    />
                    <RoundedButton
                      round={true}
                      icon={<ZoomInRoundedIcon />}
                      border={true}
                      onClick={increaseCodeZoomLevel}
                      disabled={codeZoomLevel >= 20}
                      style={{
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                        borderLeft: "none",
                      }}
                    />
                  </div>
                  <FormControlLabel
                    className={styles.wrap_switch}
                    control={
                      <Switch
                        checked={ideState.settings.lineWrap}
                        onChange={() => {
                          ideStateDispatch({
                            type: "toggle_line_wrap",
                          });
                        }}
                      />
                    }
                    label={"Ret. ligne auto."}
                  />
                </>
              )}
            </MaterialButtonGroup>
          </>
        )
      }
    >
      {(filesPanelOpen || !ideState.activeFile) && (
        <FilesPanel
          onRequestCreateFile={() => setCreateFileDialogOpen(true)}
          onRequestRenameFile={(fileName) => {
            setRenameFileDialogFileName(fileName);
            setRenameFileDialogOpen(true);
          }}
          onRequestDeleteFile={(fileName) => {
            setDeleteFileDialogFileName(fileName);
            setDeleteFileDialogOpen(true);
          }}
          onRequestUploadFile={(fileName, fileContent) => {
            const mime = getMime(fileName);
            if (
              !ideState.settings.allowedNewTextFileTypes.includes(
                mime as FileType
              ) &&
              !(
                ideState.settings.canUploadImageFiles &&
                allowedImageFileTypes.includes(mime)
              ) &&
              !(
                ideState.settings.canUploadAudioFiles &&
                allowedAudioFileTypes.includes(mime)
              )
            ) {
              alert("Ce type de fichier n'est pas autorisé.");
              return;
            }
            ideStateDispatch({
              type: "create_new_file",
              fileName: fileName,
              initialContent: fileContent,
              open: true,
            });
          }}
        />
      )}
      {ideState.activeFile && (
        <Editor
          ref={editorRef}
          readOnly={!activeFileData.permissions.canEdit}
          grayed={!activeFileData.permissions.canEdit}
          className={styles.editorPane}
          initialValue={startActiveFileContent}
          lineWrapping={ideState.settings.lineWrap}
          onChange={debouncedOnChange}
          // TODO: Move the language-specific settings to the state
          {...(activeFileMime === "text/html"
            ? {
                autoCloseTags: ideState.settings.autoCloseTags,
                onlyShowBody: ideState.settings.onlySeeBody,
              }
            : {})}
        />
      )}
      {!ideState.activeFile && (
        <div className={styles.backupNoTabText}>
          <Typography variant="h6" component="p">
            Aucun fichier n'est ouvert. Ouvrez un fichier.
          </Typography>
        </div>
      )}
      <CreateFileDialog
        open={createFileDialogOpen}
        onClose={() => setCreateFileDialogOpen(false)}
      />
      <RenameFileDialog
        open={renameFileDialogOpen}
        fileName={renameFileDialogFileName}
        onClose={() => setRenameFileDialogOpen(false)}
      />
      <DeleteFileDialog
        open={deleteFileDialogOpen}
        fileName={deleteFileDialogFileName}
        onClose={() => setDeleteFileDialogOpen(false)}
      />
      <ResetFileDialog
        open={resetFileDialogOpen}
        fileName={resetFileDialogFileName}
        onClose={() => setResetFileDialogOpen(false)}
      />
    </TabbedWindow>
  );
}
