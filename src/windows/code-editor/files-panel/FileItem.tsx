import { useMemo, useState } from "react";

import styles from "../index.module.scss";

import {
  useIDEChosenState,
  useIDEChosenStateDispatch,
  useIDEInitialState,
  useIDEInitialStateDispatch,
} from "../../../contexts/IDEStateProvider";

import { downloadBlob, downloadTextFile, getMime } from "../../../utils";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import TextFieldsOutlinedIcon from "@mui/icons-material/TextFieldsOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";

import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Typography from "@mui/material/Typography";

import Delete from "@mui/icons-material/Delete";
import Download from "@mui/icons-material/Download";
import Edit from "@mui/icons-material/Edit";

import { v4 as uuid } from "uuid";
import { MimeIcon } from "../../../features/code-editor/utils";
import {
  MaterialButtonGroup,
  RoundedButton,
} from "../../../features/ui/materialComponents";

export default function FileItem({
  fileName,
  onRequestRename,
  onRequestDelete,
}) {
  const ideState = useIDEChosenState();
  const ideStateDispatch = useIDEChosenStateDispatch();
  const ideInitialState = useIDEInitialState();
  const ideInitialStateDispatch = useIDEInitialStateDispatch();
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const menuOpen = Boolean(menuAnchorEl);
  const fileItemId = useMemo<string>(uuid, []);
  const menuId = useMemo<string>(uuid, []);
  const openMenu = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };
  const closeMenu = () => {
    setMenuAnchorEl(null);
  };

  const mime = getMime(fileName);

  const permissionsArray = useMemo(() => {
    const array = [
      ...(ideState.filesData[fileName].studentPermissions.canEdit
        ? ["edit"]
        : []),
      ...(ideState.filesData[fileName].studentPermissions.canRename
        ? ["rename"]
        : []),
      ...(ideState.filesData[fileName].studentPermissions.canDelete
        ? ["delete"]
        : []),
    ];
    return array;
  }, [fileName, ideState.filesData]);

  return (
    <>
      <Menu
        id={menuId}
        anchorEl={menuAnchorEl}
        open={menuOpen}
        onClose={closeMenu}
        MenuListProps={{
          "aria-labelledby": fileItemId,
        }}
      >
        {ideState.filesData[fileName].permissions.canRename && (
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              closeMenu();
              onRequestRename();
            }}
          >
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText>Renommer</ListItemText>
          </MenuItem>
        )}
        {ideState.settings.canDownloadFiles && (
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              closeMenu();
              const fileData = ideState.filesData[fileName];
              if (fileData.contentType === "text") {
                downloadTextFile(fileName, fileData.content);
              } else {
                downloadBlob(fileName, fileData.blob);
              }
            }}
          >
            <ListItemIcon>
              <Download fontSize="small" />
            </ListItemIcon>
            <ListItemText>Télécharger</ListItemText>
          </MenuItem>
        )}
        {ideState.filesData[fileName].permissions.canDelete && (
          <MenuItem
            onClick={(e) => {
              e.stopPropagation();
              closeMenu();
              onRequestDelete();
            }}
          >
            <ListItemIcon>
              <Delete fontSize="small" />
            </ListItemIcon>
            <ListItemText>Supprimer</ListItemText>
          </MenuItem>
        )}
      </Menu>
      <div
        id={fileItemId}
        onContextMenu={(e) => {
          e.preventDefault();
          openMenu(e);
        }}
        className={styles.filesPaneFile}
        menu-open={menuOpen.toString()}
        aria-controls={menuOpen ? menuId : undefined}
        aria-haspopup="true"
        aria-expanded={menuOpen ? "true" : undefined}
        active-file={(fileName === ideState.activeFile).toString()}
        onClick={() => {
          if (
            ideState.openedFiles.includes(fileName) ||
            ideState.settings.canOpenAndCloseTabs
          ) {
            ideStateDispatch({
              type: "set_active_file",
              fileName: fileName,
            });
          }
        }}
      >
        <span className={styles.filesPaneFileName} title={fileName}>
          <span className={styles.filesPaneFileIcon}>
            <MimeIcon mimeType={mime} textSize="1rem" />
          </span>
          <Typography variant="body1" component="span">
            {fileName}
          </Typography>
        </span>
        <MaterialButtonGroup className={styles.filePaneFileButtonGroup}>
          {ideState.settings.canSetFilesPermissions && (
            <ToggleButtonGroup
              size="small"
              value={permissionsArray}
              onChange={(e, newPermissions) => {
                e.stopPropagation();
                ideInitialStateDispatch({
                  type: "set_student_permissions",
                  fileName: fileName,
                  permissions: {
                    canEdit: newPermissions.includes("edit"),
                    canRename: newPermissions.includes("rename"),
                    canDelete: newPermissions.includes("delete"),
                  },
                });
              }}
              className={styles.filePaneFilePermissionsButtonGroup}
            >
              <ToggleButton
                value="edit"
                aria-label="edit"
                title={`Permission d'édition (${fileName})`}
              >
                <EditOutlinedIcon
                  sx={{
                    fontSize: "1.2rem",
                  }}
                />
              </ToggleButton>
              {ideInitialState.studentSettings.canSeeFilesList && (
                <ToggleButton
                  value="rename"
                  aria-label="rename"
                  title={`Permission de renommage (${fileName})`}
                >
                  <TextFieldsOutlinedIcon
                    sx={{
                      fontSize: "1.2rem",
                    }}
                  />
                </ToggleButton>
              )}
              {ideInitialState.studentSettings.canSeeFilesList && (
                <ToggleButton
                  value="delete"
                  aria-label="delete"
                  title={`Permission de suppression (${fileName})`}
                >
                  <DeleteOutlinedIcon
                    sx={{
                      fontSize: "1.2rem",
                    }}
                  />
                </ToggleButton>
              )}
            </ToggleButtonGroup>
          )}
          <RoundedButton
            icon={<MoreVertOutlinedIcon />}
            round={true}
            border={false}
            onClick={(e) => {
              e.stopPropagation();
              openMenu(e);
            }}
          />
        </MaterialButtonGroup>
      </div>
    </>
  );
}
