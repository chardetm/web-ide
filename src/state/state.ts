import {
  allowedSyntaxCheckers,
  allowedTextFileTypes,
  dataFormatVersion,
} from "../appSettings";

import {
  urlBase64ToBlob,
  getMime,
  getNumberOfLines,
  objectMap,
  blobToUrlBase64,
} from "../utils";

import {
  IDEState,
  FileData,
  FilePermissions,
  Settings,
  ExportV2Type,
  ExportV2,
  ExportV2FileState,
  ExportV2FileData,
  ExportV2Content,
  ContentType,
  ExportV2FilePreview,
  FilePreview,
} from "./types";

function getDefaultFilePermissions(initialContent?: string): FilePermissions {
  return {
    firstVisibleLine: initialContent === undefined ? undefined : 1,
    lastVisibleLine:
      initialContent === undefined
        ? undefined
        : getNumberOfLines(initialContent),
    canEdit: true,
    canRename: true,
    canDelete: true,
  };
}

export function getDefaultFileData(
  initialContent: string | Blob,
  initialName: string | null = null
): FileData {
  const isBinary = initialContent instanceof Blob;
  return {
    ...(isBinary
      ? {
          contentType: "binary",
          blob: initialContent,
          blobUrl: URL.createObjectURL(initialContent),
        }
      : { contentType: "text", content: initialContent }),
    permissions: getDefaultFilePermissions(
      isBinary ? undefined : initialContent
    ),
    studentPermissions: getDefaultFilePermissions(
      isBinary ? undefined : initialContent
    ),
    initialName: initialName,
  };
}

function getDefaultSettings(): Settings {
  return {
    previewIsLive: true,
    lineWrap: true,
    autoCloseTags: true,
    allowedNewTextFileTypes: [...allowedTextFileTypes],
    canUploadTextFiles: true,
    canUploadImageFiles: true,
    canUploadAudioFiles: true,
    canDownloadFiles: true,
    canSeeFilesList: true,
    canSetVisibilityBounds: true,
    canSetFilesPermissions: true,
    canSeeOutOfBounds: true,
    canOpenAndCloseTabs: true,
    canChangePreviewMode: true,
    allowedSyntaxCheckers: Object.keys(allowedSyntaxCheckers),
    isCustomSettings: false,
    onlySeeBody: false,
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

  function getFileDataPair(
    fileName: string,
    fileState: ExportV2FileState
  ): [string, FileData] | null {
    const content =
      exportedData.content[fileState.contentType][fileState.contentIndex];

    if (content === undefined || content === null) {
      alert(
        "Erreur à signaler : impossible de charger le fichier « " +
          fileName +
          " » (pas de données de fichier). Le fichier sera supprimé."
      );
      return null;
    }

    const permissions = fileState.initialName
      ? {
          ...initialState.filesData[fileState.initialName].studentPermissions,
        }
      : getDefaultFilePermissions(content);
    const isBinary = fileState.contentType === "base64";
    const blob = isBinary ? urlBase64ToBlob(content) : undefined;
    return [
      fileName,
      {
        ...(fileState.contentType === "text"
          ? { contentType: "text", content: content }
          : {
              contentType: "binary",
              blob: blob,
              blobUrl: URL.createObjectURL(blob),
            }),
        permissions: permissions,
        studentPermissions: permissions,
        initialName: fileState.initialName,
      },
    ];
  }

  function getFilePreviewPair(
    fileName: string,
    previewState: ExportV2FilePreview
  ): [string, FilePreview] | null {
    const content =
      exportedData.content[previewState.contentType][previewState.contentIndex];

    if (content === undefined || content === null) {
      return null; // Silent error: already reported in getFileDataPair
    }

    return [
      fileName,
      {
        ...(previewState.contentType === "text"
          ? {
              contentType: "text",
              content: content,
            }
          : { contentType: "binary" }),
        blob:
          previewState.contentType === "base64"
            ? urlBase64ToBlob(content)
            : new Blob([content], {
                type: getMime(fileName),
              }),
        upToDate: previewState.upToDate,
      },
    ];
  }

  return {
    ...initialStudentState,
    activeFile: attempt.activeFile,
    activeHtmlFile: attempt.activeHtmlFile,
    openedFiles: attempt.openedFiles,
    filesData: {
      ...objectMap(attempt.filesState, getFileDataPair),
    },
    filesPreview: {
      ...objectMap(attempt.previewState, getFilePreviewPair),
    },
    settings: {
      ...initialStudentState.settings,
      previewIsLive: attempt.previewIsLive,
    },
  };
}

export function importV2InitialState(exportedData: ExportV2): IDEState {
  const activity = exportedData.activity;

  function getFileDataPair(
    fileName: string,
    fileData: ExportV2FileData
  ): [string, FileData] | null {
    const content =
      exportedData.content[fileData.contentType][fileData.contentIndex];

    if (content === undefined || content === null) {
      alert(
        "Erreur à signaler : impossible de charger le fichier « " +
          fileName +
          " » (pas de données de fichier). Le fichier sera supprimé."
      );
      return null;
    }

    const isBinary = fileData.contentType === "base64";
    const blob = isBinary ? urlBase64ToBlob(content) : undefined;

    return [
      fileName,
      {
        ...(fileData.contentType === "text"
          ? { contentType: "text", content: content }
          : {
              contentType: "binary",
              blob: blob,
              blobUrl: URL.createObjectURL(blob),
            }),
        permissions: getDefaultFilePermissions(content),
        studentPermissions: fileData.studentPermissions,
        initialName: null,
      },
    ];
  }

  function getFilePreviewPair(
    fileName: string,
    fileData: ExportV2FileData
  ): [string, FilePreview] | null {
    const content =
      exportedData.content[fileData.contentType][fileData.contentIndex];

    if (content === undefined || content === null) {
      return null; // Silent error: already reported in getFileDataPair
    }

    return [
      fileName,
      {
        ...(fileData.contentType === "text"
          ? {
              contentType: "text",
              content: content,
            }
          : { contentType: "binary" }),
        blob:
          fileData.contentType === "base64"
            ? urlBase64ToBlob(content)
            : new Blob([content], {
                type: getMime(fileName),
              }),
        upToDate: true,
      },
    ];
  }

  return {
    activeFile: activity.activeFile,
    activeHtmlFile: activity.activeHtmlFile,
    previewAnchor: null,
    openedFiles: activity.openedFiles,
    fileTypesInitialContent: activity.fileTypesInitialContent,
    settings: getDefaultSettings(),
    studentSettings: activity.studentSettings,
    filesData: objectMap(activity.filesData, getFileDataPair),
    filesPreview: objectMap(activity.filesData, getFilePreviewPair),
  };
}

export async function exportV2(
  initialState: IDEState,
  currentState: IDEState,
  isAttempt: boolean
): Promise<ExportV2> {
  let activityFilesData: { [fileName: string]: ExportV2FileData } = {};
  let attemptFilesState: { [fileName: string]: ExportV2FileState } = {};
  let attemptPreviewState: { [fileName: string]: ExportV2FilePreview } = {};
  let content: ExportV2Content = {
    text: [],
    base64: [],
  };

  // Initial state files
  for (const [fileName, fileData] of Object.entries(initialState.filesData)) {
    const exportContentType =
      fileData.contentType === "text" ? "text" : "base64";
    const exportContent =
      fileData.contentType === "text"
        ? fileData.content
        : await blobToUrlBase64(fileData.blob);
    const foundIndex = content[exportContentType].indexOf(exportContent);
    const contentIndex =
      foundIndex !== -1 ? foundIndex : content[exportContentType].length;
    if (foundIndex === -1) {
      content[exportContentType].push(exportContent);
    }
    activityFilesData[fileName] = {
      contentIndex: contentIndex,
      contentType: exportContentType,
      studentPermissions: fileData.studentPermissions,
    };
  }

  if (isAttempt) {
    // Current state files
    for (const [fileName, fileData] of Object.entries(currentState.filesData)) {
      const exportContentType =
        fileData.contentType === "text" ? "text" : "base64";
      const exportContent =
        fileData.contentType === "text"
          ? fileData.content
          : await blobToUrlBase64(fileData.blob);
      const foundIndex = content[exportContentType].indexOf(exportContent);
      const contentIndex =
        foundIndex !== -1 ? foundIndex : content[exportContentType].length;
      if (foundIndex === -1) {
        content[exportContentType].push(exportContent);
      }
      attemptFilesState[fileName] = {
        contentIndex: contentIndex,
        contentType: exportContentType,
        initialName: fileData.initialName,
      };
    }

    // Current state preview
    for (const [fileName, previewData] of Object.entries(
      currentState.filesPreview
    )) {
      const exportContentType =
        previewData.contentType === "text" ? "text" : "base64";
      const exportContent =
        previewData.contentType === "text"
          ? previewData.content
          : await blobToUrlBase64(previewData.blob);
      const foundIndex = content[exportContentType].indexOf(exportContent);
      const contentIndex =
        foundIndex !== -1 ? foundIndex : content[exportContentType].length;
      if (foundIndex === -1) {
        content[exportContentType].push(exportContent);
      }
      attemptPreviewState[fileName] = {
        contentIndex: contentIndex,
        contentType: exportContentType,
        upToDate: previewData.upToDate,
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
      fileTypesInitialContent: initialState.fileTypesInitialContent,
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
        previewState: attemptPreviewState,
      },
    }),
    content: content,
  };
}
