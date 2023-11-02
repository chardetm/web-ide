import {
  allowedSyntaxCheckers,
  allowedTextFileTypes,
  dataFormatVersion,
} from "../appSettings";

import { getNumberOfLines, objectMap } from "../utils";

import {
  IDEState,
  FileData,
  FilePermissions,
  Settings,
  AttemptStateExport,
  FilePreview,
  ExportV2Type,
  ExportV2,
  ExportV2FileState,
  ExportV2FileData,
  ExportV2Content,
  ContentType,
} from "./types";

function getDefaultFilePermissions(initialContent: string): FilePermissions {
  return {
    firstVisibleLine: 1,
    lastVisibleLine: getNumberOfLines(initialContent),
    canEdit: true,
    canRename: true,
    canDelete: true,
  };
}

export function getDefaultFileData(
  initialContent: string,
  contentType: ContentType,
  initialName: string | null = null
): FileData {
  return {
    content: initialContent,
    contentType: contentType,
    permissions: getDefaultFilePermissions(initialContent),
    studentPermissions: getDefaultFilePermissions(initialContent),
    initialName: initialName,
  };
}

export function getDefaultFilePreview(
  initialContent: string,
  upToDate: boolean = true
): FilePreview {
  return {
    content: initialContent,
    upToDate: upToDate,
  };
}

function getDefaultSettings(): Settings {
  return {
    previewIsLive: true,
    allowedNewTextFileTypes: [...allowedTextFileTypes],
    canUploadTextFiles: true,
    canUploadImageFiles: true,
    canDownloadFiles: true,
    canSeeFilesList: true,
    canSetVisibilityBounds: true,
    canSetFilesPermissions: true,
    canSeeOutOfBounds: true,
    canOpenAndCloseTabs: true,
    canChangePreviewMode: true,
    allowedSyntaxCheckers: Object.keys(allowedSyntaxCheckers),
    isCustomSettings: false,
  };
}

export function getInitialCurrentState(initialState: IDEState): IDEState {
  return {
    ...initialState,
    filesData: objectMap(initialState.filesData, (fileName, fileData) => [
      fileName,
      {
        ...fileData,
        permissions: {
          ...fileData.studentPermissions,
        },
        studentPermissions: {
          ...fileData.studentPermissions,
        },
        initialName: fileName,
      },
    ]),
    filesPreview: objectMap(
      initialState.filesPreview,
      (fileName, previewData) => [
        fileName,
        {
          ...previewData,
        },
      ]
    ),
    settings: {
      ...initialState.studentSettings,
      canSetVisibilityBounds: false,
      canSetFilesPermissions: false,
      canSeeOutOfBounds: false,
    },
    studentSettings: {
      ...initialState.studentSettings,
      canSetVisibilityBounds: false,
      canSetFilesPermissions: false,
      canSeeOutOfBounds: false,
    },
  };
}

export function importV2CurrentState(
  exportedData: ExportV2,
  initialState: IDEState
): IDEState {
  const initialStudentState = getInitialCurrentState(initialState);

  if (exportedData.type !== "attempt") {
    return initialStudentState;
  }

  if (!exportedData.attempt) {
    alert(
      "Erreur à signaler : impossible de charger la tentative (pas de données de tentatives)."
    );
    return initialStudentState;
  }

  const attempt = exportedData.attempt;

  function getFileData(fileState: ExportV2FileState): FileData {
    const content =
      exportedData.content[fileState.contentType][fileState.contentIndex];
    const permissions = fileState.initialName
      ? {
          ...initialState.filesData[fileState.initialName].studentPermissions,
        }
      : getDefaultFilePermissions(content);
    return {
      content: content,
      contentType: fileState.contentType,
      permissions: permissions,
      studentPermissions: permissions,
      initialName: fileState.initialName,
    };
  }

  return {
    ...initialStudentState,
    activeFile: attempt.activeFile,
    activeHtmlFile: attempt.activeHtmlFile,
    openedFiles: attempt.openedFiles,
    filesData: {
      ...objectMap(attempt.filesState, (fileName, fileState) => [
        fileName,
        getFileData(fileState),
      ]),
    },
    filesPreview: {
      ...objectMap(attempt.filesState, (fileName, fileState) => [
        fileName,
        {
          ...fileState.preview,
        },
      ]),
    },
    settings: {
      ...initialStudentState.settings,
      previewIsLive: attempt.previewIsLive,
    },
  };
}

export function importV2InitialState(exportedData: ExportV2): IDEState {
  const activity = exportedData.activity;

  function getFileData(fileData: ExportV2FileData): FileData {
    const content =
      exportedData.content[fileData.contentType][fileData.contentIndex];
    return {
      content: content,
      contentType: fileData.contentType,
      permissions: getDefaultFilePermissions(content),
      studentPermissions: fileData.studentPermissions,
      initialName: null,
    };
  }

  return {
    activeFile: activity.activeFile,
    activeHtmlFile: activity.activeHtmlFile,
    openedFiles: activity.openedFiles,
    settings: getDefaultSettings(),
    studentSettings: activity.studentSettings,
    filesData: objectMap(activity.filesData, (fileName, fileData) => [
      fileName,
      getFileData(fileData),
    ]),
    filesPreview: objectMap(activity.filesData, (fileName, fileData) => [
      fileName,
      getDefaultFilePreview(
        exportedData.content[fileData.contentType][fileData.contentIndex],
        true
      ),
    ]),
  };
}

export function exportV2(
  initialState: IDEState,
  currentState: IDEState,
  isAttempt: boolean
): ExportV2 {
  let activityFilesData: { [fileName: string]: ExportV2FileData } = {};
  let attemptFilesState: { [fileName: string]: ExportV2FileState } = {};
  let content: ExportV2Content = {
    text: [],
    base64: [],
  };

  // Initial state files
  for (const [fileName, fileData] of Object.entries(initialState.filesData)) {
    const foundIndex = content[fileData.contentType].indexOf(fileData.content);
    const contentIndex =
      foundIndex !== -1 ? foundIndex : content[fileData.contentType].length;
    if (foundIndex === -1) {
      content[fileData.contentType].push(fileData.content);
    }
    activityFilesData[fileName] = {
      contentIndex: contentIndex,
      contentType: fileData.contentType,
      studentPermissions: fileData.studentPermissions,
    };
  }

  if (isAttempt) {
    // Current state files
    for (const [fileName, fileData] of Object.entries(currentState.filesData)) {
      const foundIndex = content[fileData.contentType].indexOf(
        fileData.content
      );
      const contentIndex =
        foundIndex !== -1 ? foundIndex : content[fileData.contentType].length;
      if (foundIndex === -1) {
        content[fileData.contentType].push(fileData.content);
      }
      attemptFilesState[fileName] = {
        contentIndex: contentIndex,
        contentType: fileData.contentType,
        initialName: fileData.initialName,
        preview: { ...currentState.filesPreview[fileName] },
      };
    }
  }

  const type: ExportV2Type = isAttempt ? "attempt" : "exercise";

  return {
    dataFormatVersion: dataFormatVersion,
    type: type,
    activity: {
      activeFile: initialState.activeFile,
      activeHtmlFile: initialState.activeHtmlFile,
      openedFiles: initialState.openedFiles,
      studentSettings: initialState.studentSettings,
      filesData: activityFilesData,
    },
    ...(type === "attempt" && {
      attempt: {
        activeFile: currentState.activeFile,
        activeHtmlFile: currentState.activeHtmlFile,
        filesState: attemptFilesState,
        openedFiles: currentState.openedFiles,
        previewIsLive: currentState.settings.previewIsLive,
      },
    }),
    content: content,
  };
}
