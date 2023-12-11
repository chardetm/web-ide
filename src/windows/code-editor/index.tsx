import { useEffect, useMemo, useRef, useState } from "react";

import { TabbedWindow } from "../../features/windows/WindowWithTabs";
import { Spacer } from "../../features/ui/basicComponents";
import {
  MaterialIcon,
  RoundedButton,
  MaterialButtonGroup,
  MaterialButtonSeparator,
} from "../../features/ui/materialComponents";

import styles from "./index.module.scss";

import Typography from "@mui/material/Typography";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

import { appendClassnames, downloadFile, getMime } from "../../utils";
import { FileType, allowedImageFileTypes } from "../../appSettings";
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
              {ideState.filesData[ideState.activeFile].initialName in
                ideInitialState.filesData && (
                <RoundedButton
                  label="Réinitialiser"
                  icon={<MaterialIcon.Rounded name="device_reset" />}
                  border={true}
                  disabled={
                    ideState.filesData[ideState.activeFile].content ===
                    ideInitialState.filesData[
                      ideState.filesData[ideState.activeFile].initialName
                    ].content
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
                      ideState.filesData[ideState.activeFile].content
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
            {allowedTextFileTypes.includes(activeFileMime) && (
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
            )}
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
          onRequestUploadFile={(fileName, fileContent, contentType) => {
            const mime = getMime(fileName);
            if (
              !ideState.settings.allowedNewTextFileTypes.includes(
                mime as FileType
              ) &&
              !(
                ideState.settings.canUploadImageFiles &&
                allowedImageFileTypes.includes(mime)
              )
            ) {
              alert("Ce type de fichier n'est pas autorisé.");
              return;
            }
            ideStateDispatch({
              type: "create_new_file",
              fileName: fileName,
              initialContent: fileContent,
              contentType: contentType,
              open: true,
            });
          }}
        />
      )}
      {ideState.activeFile && (
        <Editor
          ref={editorRef}
          readOnly={
            !ideState.filesData[ideState.activeFile].permissions.canEdit
          }
          grayed={!ideState.filesData[ideState.activeFile].permissions.canEdit}
          className={styles.editorPane}
          value={ideState.filesData[ideState.activeFile].content}
          lineWrapping={ideState.settings.lineWrap}
          onChange={(content) =>
            ideStateDispatch({
              type: "set_file_content",
              fileName: ideState.activeFile,
              content: content,
            })
          }
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
