import { FileType } from "../appSettings";

import {
  getDefaultFileData,
  getInitialCurrentState,
  importV2CurrentState,
  importV2InitialState,
} from "./state";

import { getMime, objectMap, splitFileNameExtension } from "../utils";

import { ContentType, ExportV2, IDEState, Settings } from "./types";

// TODO: use union type
export type IDEStateAction = {
  type: string;
  fileType?: FileType;
  contentType?: ContentType;
  fileName?: string;
  oldFileName?: string;
  newFileName?: string;
  content?: string;
  initialContent?: string;
  permissions?: {
    canEdit: boolean;
    canRename: boolean;
    canDelete: boolean;
  };
  language?: string;
  open?: boolean;
  value?: boolean;
  settings?: Partial<Settings>;
  settingsKey?: string;
  exportedData?: ExportV2;
  initialState?: IDEState;
};

function ideStateReducer(state: IDEState, action: IDEStateAction): IDEState {
  switch (action.type) {
    case "set_file_content": {
      if (!Object.keys(state.filesData).includes(action.fileName)) {
        throw new Error(`File ${action.fileName} does not exist`);
      }
      // TODO handle first/last visible lines
      return {
        ...state,
        filesData: {
          ...state.filesData,
          [action.fileName]: {
            ...state.filesData[action.fileName],
            content: action.content,
          },
        },
        filesPreview: {
          ...state.filesPreview,
          [action.fileName]: {
            ...state.filesPreview[action.fileName],
            content: state.settings.previewIsLive
              ? action.content
              : state.filesPreview[action.fileName].content,
            upToDate:
              state.settings.previewIsLive ||
              action.content === state.filesPreview[action.fileName].content,
          },
        },
      };
    }

    case "create_new_file": {
      const [nameNoExtension, extension] = splitFileNameExtension(
        action.fileName
      );
      // if file already exists
      let newFileName = action.fileName;
      if (Object.keys(state.filesData).includes(newFileName)) {
        for (
          let i = 2;
          Object.keys(state.filesData).includes(
            (newFileName = `${nameNoExtension} (${i})${
              extension !== "" ? "." : ""
            }${extension}`)
          );
          i++
        );
      }
      const newState = {
        ...state,
        filesData: {
          ...state.filesData,
          [newFileName]: getDefaultFileData(
            action.initialContent,
            action.contentType
          ),
        },
        filesPreview: {
          ...state.filesPreview,
          [newFileName]:
            Object.keys(state.filesPreview).includes(newFileName) &&
            !state.settings.previewIsLive
              ? {
                  ...state.filesPreview.newFileName,
                  upToDate:
                    action.initialContent ===
                    state.filesPreview.newFileName.content,
                }
              : {
                  content: state.settings.previewIsLive
                    ? action.initialContent
                    : null,
                  contentType: action.contentType,
                  upToDate: state.settings.previewIsLive,
                },
        },
      };
      return action.open
        ? ideStateReducer(newState, {
            type: "open_file",
            fileName: newFileName,
          })
        : newState;
    }

    case "delete_file": {
      // TODO: transfer some logic to close_file and simplify this
      if (!Object.keys(state.filesData).includes(action.fileName)) {
        throw new Error(`File ${action.fileName} does not exist`);
      }
      const closedState = ideStateReducer(state, {
        type: "close_file",
        fileName: action.fileName,
      });
      const { [action.fileName]: _, ...newFilesData } = closedState.filesData;
      let newFilesPreview = closedState.filesPreview;
      if (
        Object.keys(newFilesPreview).includes(action.fileName) &&
        state.settings.previewIsLive
      ) {
        const { [action.fileName]: _, ...restOfFilesPreview } =
          closedState.filesPreview;
        newFilesPreview = restOfFilesPreview;
      }
      const finalState = {
        ...closedState,
        filesData: newFilesData,
        filesPreview: newFilesPreview,
      };
      return finalState;
    }

    case "open_file": {
      if (!Object.keys(state.filesData).includes(action.fileName)) {
        throw new Error(`File ${action.fileName} does not exist`);
      }
      const openedNotActiveState = {
        ...state,
        openedFiles: [...state.openedFiles, action.fileName],
      };
      return ideStateReducer(openedNotActiveState, {
        type: "set_active_file",
        fileName: action.fileName,
      });
    }

    case "close_file": {
      if (!Object.keys(state.filesData).includes(action.fileName)) {
        throw new Error(`File ${action.fileName} does not exist`);
      }
      if (!state.openedFiles.includes(action.fileName)) {
        return state;
      }
      const closedFileState = {
        ...state,
        openedFiles: state.openedFiles.filter(
          (name) => name !== action.fileName
        ),
        activeFile:
          state.activeFile === action.fileName ? null : state.activeFile,
        activeHtmlFile:
          state.activeHtmlFile === action.fileName
            ? null
            : state.activeHtmlFile,
      };
      if (closedFileState.activeFile === null) {
        let newActiveFile = null;
        const newNbFiles = state.openedFiles.length - 1;
        if (newNbFiles > 0) {
          const index = state.openedFiles.indexOf(action.fileName);
          newActiveFile =
            closedFileState.openedFiles[Math.min(index, newNbFiles - 1)];
        }
        return ideStateReducer(closedFileState, {
          type: "set_active_file",
          fileName: newActiveFile,
        });
      } else {
        return closedFileState;
      }
    }

    case "set_active_file": {
      if (
        action.fileName &&
        !Object.keys(state.filesData).includes(action.fileName)
      ) {
        throw new Error(`File ${action.fileName} does not exist`);
      }
      const finalState = {
        ...state,
        activeFile: action.fileName,
        activeHtmlFile:
          action.fileName && getMime(action.fileName) === "text/html"
            ? action.fileName
            : state.activeHtmlFile,
        openedFiles:
          action.fileName && !state.openedFiles.includes(action.fileName)
            ? [...state.openedFiles, action.fileName]
            : state.openedFiles,
      };
      return finalState;
    }

    case "rename_file": {
      if (!Object.keys(state.filesData).includes(action.oldFileName)) {
        throw new Error(`File ${action.oldFileName} does not exist`);
      }
      if (action.oldFileName === action.newFileName) {
        return state;
      }
      const created_state = ideStateReducer(state, {
        type: "create_new_file",
        fileName: action.newFileName,
        initialContent: state.filesData[action.oldFileName].content,
        contentType: state.filesData[action.oldFileName].contentType,
        open: false,
      });
      const updated_state = {
        ...created_state,
        activeFile:
          state.activeFile === action.oldFileName
            ? action.newFileName
            : created_state.activeFile,
        activeHtmlFile:
          state.activeHtmlFile === action.oldFileName
            ? action.newFileName
            : created_state.activeHtmlFile,
        openedFiles: created_state.openedFiles.map((name) =>
          name === action.oldFileName ? action.newFileName : name
        ),
      };
      updated_state.filesData[action.newFileName].studentPermissions = {
        ...updated_state.filesData[action.oldFileName].studentPermissions,
      };
      updated_state.filesData[action.newFileName].permissions = {
        ...updated_state.filesData[action.oldFileName].permissions,
      };
      updated_state.filesPreview[action.newFileName] = {
        ...updated_state.filesPreview[action.oldFileName],
      };
      if (updated_state.filesData[action.oldFileName].initialName) {
        updated_state.filesData[action.newFileName].initialName =
          updated_state.filesData[action.oldFileName].initialName;
      }
      const deleted_state = ideStateReducer(updated_state, {
        type: "delete_file",
        fileName: action.oldFileName,
      });
      return deleted_state;
    }

    case "set_student_permissions": {
      if (!Object.keys(state.filesData).includes(action.fileName)) {
        throw new Error(`File ${action.fileName} does not exist`);
      }
      return {
        ...state,
        filesData: {
          ...state.filesData,
          [action.fileName]: {
            ...state.filesData[action.fileName],
            studentPermissions: {
              ...state.filesData[action.fileName].studentPermissions,
              canEdit: action.permissions.canEdit,
              canRename: action.permissions.canRename,
              canDelete: action.permissions.canDelete,
            },
          },
        },
      };
    }

    case "set_student_can_edit": {
      if (!Object.keys(state.filesData).includes(action.fileName)) {
        throw new Error(`File ${action.fileName} does not exist`);
      }
      return {
        ...state,
        filesData: {
          ...state.filesData,
          [action.fileName]: {
            ...state.filesData[action.fileName],
            studentPermissions: {
              ...state.filesData[action.fileName].studentPermissions,
              canEdit: action.value,
            },
          },
        },
      };
    }

    case "toggle_student_can_edit": {
      return ideStateReducer(state, {
        type: "set_student_can_edit",
        fileName: action.fileName,
        value: !state.filesData[action.fileName].studentPermissions.canEdit,
      });
    }

    case "set_student_can_rename": {
      if (!Object.keys(state.filesData).includes(action.fileName)) {
        throw new Error(`File ${action.fileName} does not exist`);
      }
      return {
        ...state,
        filesData: {
          ...state.filesData,
          [action.fileName]: {
            ...state.filesData[action.fileName],
            studentPermissions: {
              ...state.filesData[action.fileName].studentPermissions,
              canRename: action.value,
            },
          },
        },
      };
    }

    case "toggle_student_can_rename": {
      return ideStateReducer(state, {
        type: "set_student_can_rename",
        fileName: action.fileName,
        value: !state.filesData[action.fileName].studentPermissions.canRename,
      });
    }

    case "set_student_can_delete": {
      if (!Object.keys(state.filesData).includes(action.fileName)) {
        throw new Error(`File ${action.fileName} does not exist`);
      }
      return {
        ...state,
        filesData: {
          ...state.filesData,
          [action.fileName]: {
            ...state.filesData[action.fileName],
            studentPermissions: {
              ...state.filesData[action.fileName].studentPermissions,
              canDelete: action.value,
            },
          },
        },
      };
    }

    case "toggle_student_can_delete": {
      return ideStateReducer(state, {
        type: "set_student_can_delete",
        fileName: action.fileName,
        value: !state.filesData[action.fileName].studentPermissions.canDelete,
      });
    }

    case "set_settings_base": {
      const overridesLogic =
        action.settings.canSeeFilesList === false
          ? {
              canOpenAndCloseTabs: false,
              canUploadImageFiles: false,
              canUploadTextFiles: false,
            }
          : {};
      const finalState = {
        ...state,
        [action.settingsKey]: {
          ...state[action.settingsKey],
          ...action.settings,
          ...overridesLogic,
        },
      };
      return finalState;
    }

    case "set_settings": {
      return ideStateReducer(state, {
        type: "set_settings_base",
        settings: action.settings,
        settingsKey: "settings",
      });
    }

    case "set_student_settings": {
      return ideStateReducer(state, {
        type: "set_settings_base",
        settings: action.settings,
        settingsKey: "studentSettings",
      });
    }

    case "toggle_allowed_text_file_type": {
      let newAllowedNewTextFileTypes = [
        ...state.studentSettings.allowedNewTextFileTypes,
      ];
      if ((newAllowedNewTextFileTypes as string[]).includes(action.fileType)) {
        newAllowedNewTextFileTypes = newAllowedNewTextFileTypes.filter(
          (t) => t !== action.fileType
        );
      } else {
        newAllowedNewTextFileTypes.push(action.fileType as FileType);
      }
      const finalState = {
        ...state,
        studentSettings: {
          ...state.studentSettings,
          allowedNewTextFileTypes: newAllowedNewTextFileTypes,
        },
      };
      return finalState;
    }

    case "toggle_allowed_syntax_checker": {
      let newAllowedSyntaxCheckers = [
        ...state.studentSettings.allowedSyntaxCheckers,
      ];
      if (newAllowedSyntaxCheckers.includes(action.language)) {
        newAllowedSyntaxCheckers = newAllowedSyntaxCheckers.filter(
          (l) => l !== action.language
        );
      } else {
        newAllowedSyntaxCheckers.push(action.language);
      }
      const finalState = {
        ...state,
        studentSettings: {
          ...state.studentSettings,
          allowedSyntaxCheckers: newAllowedSyntaxCheckers,
        },
      };
      return finalState;
    }

    case "set_preview_auto_refresh": {
      const valueUpdatedState = {
        ...state,
        settings: {
          ...state.settings,
          previewIsLive: action.value,
        },
      };
      return action.value
        ? ideStateReducer(valueUpdatedState, {
            type: "update_preview",
          })
        : valueUpdatedState;
    }

    case "toggle_preview_auto_refresh": {
      return ideStateReducer(state, {
        type: "set_preview_auto_refresh",
        value: !state.settings.previewIsLive,
      });
    }

    case "update_preview": {
      return {
        ...state,
        filesPreview: objectMap(state.filesData, (fileName, fileData) => [
          fileName,
          {
            content: fileData.content,
            contentType: fileData.contentType,
            upToDate: true,
          },
        ]),
      };
    }
    /* TODO: Fix type
      case "set_allowed_new_text_file_types": {
        return {
          ...state,
          settings: {
            ...state.settings,
            allowedNewTextFileTypes: action.value,
          },
        };
      }
  */
    case "set_can_upload_text_files": {
      return {
        ...state,
        settings: {
          ...state.settings,
          canUploadTextFiles: action.value,
        },
      };
    }

    case "toggle_can_upload_text_files": {
      return ideStateReducer(state, {
        type: "set_can_upload_text_files",
        value: !state.settings.canUploadTextFiles,
      });
    }

    case "set_can_upload_image_files": {
      return {
        ...state,
        settings: {
          ...state.settings,
          canUploadImageFiles: action.value,
        },
      };
    }

    case "toggle_can_upload_image_files": {
      return ideStateReducer(state, {
        type: "set_can_upload_image_files",
        value: !state.settings.canUploadImageFiles,
      });
    }

    case "set_can_download_files": {
      return {
        ...state,
        settings: {
          ...state.settings,
          canDownloadFiles: action.value,
        },
      };
    }

    case "toggle_can_download_files": {
      return ideStateReducer(state, {
        type: "set_can_download_files",
        value: !state.settings.canDownloadFiles,
      });
    }

    case "set_can_see_files_list": {
      return {
        ...state,
        settings: {
          ...state.settings,
          canSeeFilesList: action.value,
        },
      };
    }

    case "toggle_can_see_files_list": {
      return ideStateReducer(state, {
        type: "set_can_see_files_list",
        value: !state.settings.canSeeFilesList,
      });
    }

    case "set_can_set_files_permissions": {
      return {
        ...state,
        settings: {
          ...state.settings,
          canSetFilesPermissions: action.value,
        },
      };
    }

    case "set_can_set_visibility_bounds": {
      return {
        ...state,
        settings: {
          ...state.settings,
          canSetVisibilityBounds: action.value,
        },
      };
    }

    case "toggle_can_set_visibility_bounds": {
      return ideStateReducer(state, {
        type: "set_can_set_visibility_bounds",
        value: !state.settings.canSetVisibilityBounds,
      });
    }

    case "reset_from_initial_state": {
      return getInitialCurrentState(action.initialState);
    }

    case "import_initial_state": {
      const state = importV2InitialState(action.exportedData);
      return state;
    }

    case "import_current_state": {
      const state = importV2CurrentState(
        action.exportedData,
        action.initialState
      );
      return state;
    }

    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

export default ideStateReducer;
