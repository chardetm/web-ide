import { FileType, allowedTextFileTypes } from "../appSettings";

import {
  getDefaultFileData,
  getInitialCurrentState,
  importV2CurrentState,
  importV2InitialState,
} from "./state";

import {
  urlBase64ToBlob,
  getMime,
  objectMap,
  splitFileNameExtension,
  stringToUrlBase64,
} from "../utils";

import { ContentType, ExportV2, IDEState, Settings } from "./types";

// TODO: use union type
/* export type IDEStateAction = {
  type: string;
  fileType?: FileType;
  contentType?: ContentType;
  fileName?: string;
  anchor?: string | null;
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
}; */

export type IDEStateAction =
  | {
      type: "set_file_content";
      fileName: string;
      content: string;
    }
  | {
      type: "create_new_file";
      fileName: string;
      initialContent: string;
      contentType: ContentType;
      open: boolean;
    }
  | {
      type: "delete_file";
      fileName: string;
    }
  | {
      type: "open_file";
      fileName: string;
    }
  | {
      type: "close_file";
      fileName: string;
    }
  | {
      type: "set_active_file";
      fileName: string | null;
      anchor?: string | null;
    }
  | {
      type: "remove_preview_anchor";
    }
  | {
      type: "rename_file";
      oldFileName: string;
      newFileName: string;
    }
  | {
      type: "set_student_permissions";
      fileName: string;
      permissions: {
        canEdit: boolean;
        canRename: boolean;
        canDelete: boolean;
      };
    }
  | {
      type: "set_student_can_edit";
      fileName: string;
      value: boolean;
    }
  | {
      type: "toggle_student_can_edit";
      fileName: string;
    }
  | {
      type: "set_student_can_rename";
      fileName: string;
      value: boolean;
    }
  | {
      type: "toggle_student_can_rename";
      fileName: string;
    }
  | {
      type: "set_student_can_delete";
      fileName: string;
      value: boolean;
    }
  | {
      type: "toggle_student_can_delete";
      fileName: string;
    }
  | {
      type: "set_settings_base";
      settings: Partial<Settings>;
      settingsKey: string;
    }
  | {
      type: "set_settings";
      settings: Partial<Settings>;
    }
  | {
      type: "set_student_settings";
      settings: Partial<Settings>;
    }
  | {
      type: "toggle_allowed_text_file_type";
      fileType: FileType;
    }
  | {
      type: "toggle_allowed_syntax_checker";
      language: string;
    }
  | {
      type: "set_auto_close_tabs";
      value: boolean;
    }
  | {
      type: "toggle_auto_close_tabs";
    }
  | {
      type: "set_line_wrap";
      value: boolean;
    }
  | {
      type: "toggle_line_wrap";
    }
  | {
      type: "set_preview_auto_refresh";
      value: boolean;
    }
  | {
      type: "toggle_preview_auto_refresh";
    }
  | {
      type: "update_preview";
    }
  | {
      type: "set_can_upload_text_files";
      value: boolean;
    }
  | {
      type: "toggle_can_upload_text_files";
    }
  | {
      type: "set_can_upload_image_files";
      value: boolean;
    }
  | {
      type: "toggle_can_upload_image_files";
    }
  | {
      type: "set_can_upload_audio_files";
      value: boolean;
    }
  | {
      type: "toggle_can_upload_audio_files";
    }
  | {
      type: "set_can_download_files";
      value: boolean;
    }
  | {
      type: "toggle_can_download_files";
    }
  | {
      type: "set_can_see_files_list";
      value: boolean;
    }
  | {
      type: "toggle_can_see_files_list";
    }
  | {
      type: "set_can_set_files_permissions";
      value: boolean;
    }
  | {
      type: "set_can_set_visibility_bounds";
      value: boolean;
    }
  | {
      type: "toggle_can_set_visibility_bounds";
    }
  | {
      type: "reset_from_initial_state";
      initialState: IDEState;
    }
  | {
      type: "import_initial_state";
      exportedData: ExportV2;
    }
  | {
      type: "import_current_state";
      exportedData: ExportV2;
      initialState: IDEState;
    }
  | {
      type: "set_file_type_initial_content";
      mime: FileType;
      content: string;
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
            content: state.settings.previewIsLive
              ? action.content
              : state.filesPreview[action.fileName].content,
            contentType: state.filesPreview[action.fileName].contentType,
            blob: state.settings.previewIsLive
              ? state.filesPreview[action.fileName].contentType === "base64"
                ? urlBase64ToBlob(action.content, getMime(action.fileName))
                : new Blob([action.content], {
                    type: getMime(action.fileName),
                  })
              : state.filesPreview[action.fileName].blob,
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
                  blob:
                    action.contentType === "base64"
                      ? urlBase64ToBlob(
                          state.settings.previewIsLive
                            ? action.initialContent
                            : "",
                          getMime(newFileName)
                        )
                      : new Blob(
                          [
                            state.settings.previewIsLive
                              ? action.initialContent
                              : "",
                          ],
                          {
                            type: getMime(newFileName),
                          }
                        ),
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
        previewAnchor: action.anchor ? action.anchor : null,
        openedFiles:
          action.fileName && !state.openedFiles.includes(action.fileName)
            ? [...state.openedFiles, action.fileName]
            : state.openedFiles,
      };
      return finalState;
    }

    case "remove_preview_anchor": {
      return {
        ...state,
        previewAnchor: null,
      };
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
              canUploadAudioFiles: false,
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
      const newAllowedNewTextFileTypes = allowedTextFileTypes.filter((t) => {
        if (t === action.fileType) {
          return !state.studentSettings.allowedNewTextFileTypes.includes(t);
        } else {
          return state.studentSettings.allowedNewTextFileTypes.includes(t);
        }
      });
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

    case "set_auto_close_tabs": {
      return {
        ...state,
        settings: {
          ...state.settings,
          autoCloseTags: action.value,
        },
      };
    }

    case "toggle_auto_close_tabs": {
      return ideStateReducer(state, {
        type: "set_auto_close_tabs",
        value: !state.settings.autoCloseTags,
      });
    }

    case "set_line_wrap": {
      return {
        ...state,
        settings: {
          ...state.settings,
          lineWrap: action.value,
        },
      };
    }

    case "toggle_line_wrap": {
      return ideStateReducer(state, {
        type: "set_line_wrap",
        value: !state.settings.lineWrap,
      });
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
            blob:
              fileData.contentType === "base64"
                ? urlBase64ToBlob(fileData.content, getMime(fileName))
                : new Blob([fileData.content], {
                    type: getMime(fileName),
                  }),
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

    case "set_can_upload_audio_files": {
      return {
        ...state,
        settings: {
          ...state.settings,
          canUploadAudioFiles: action.value,
        },
      };
    }

    case "toggle_can_upload_audio_files": {
      return ideStateReducer(state, {
        type: "set_can_upload_audio_files",
        value: !state.settings.canUploadAudioFiles,
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

    case "set_file_type_initial_content": {
      return {
        ...state,
        fileTypesInitialContent: {
          ...state.fileTypesInitialContent,
          [action.mime]: action.content,
        },
      };
    }
  }
}

export default ideStateReducer;
