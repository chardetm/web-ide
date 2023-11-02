import { FileType } from "../appSettings";

export type FilePermissions = {
  firstVisibleLine: number;
  lastVisibleLine: number;
  canEdit: boolean;
  canRename: boolean;
  canDelete: boolean;
};

export type ContentType = "text" | "base64";

export type FileData = {
  content: string;
  contentType: ContentType;
  permissions: FilePermissions;
  studentPermissions: FilePermissions;
  initialName: string | null;
};

export type FilePreview = {
  content: string;
  contentType: ContentType;
  upToDate: boolean;
};

export type Settings = {
  previewIsLive: boolean;
  allowedNewTextFileTypes: FileType[];
  canUploadTextFiles: boolean;
  canUploadImageFiles: boolean;
  canDownloadFiles: boolean;
  canSeeFilesList: boolean;
  canSetVisibilityBounds: boolean;
  canSetFilesPermissions: boolean;
  canSeeOutOfBounds: boolean;
  canOpenAndCloseTabs: boolean;
  canChangePreviewMode: boolean;
  allowedSyntaxCheckers: string[];
  isCustomSettings: boolean;
};

export type IDEState = {
  activeFile: string | null;
  activeHtmlFile: string | null;
  openedFiles: string[];
  settings: Settings;
  studentSettings: Settings;
  filesData: { [fileName: string]: FileData };
  filesPreview: { [fileName: string]: FilePreview };
};

export type ExportV2Type = "exercise" | "attempt";

export type ExportV2FileData = {
  contentIndex: number;
  contentType: ContentType;
  studentPermissions: FilePermissions;
};

export type InitialStateExport = {
  activeFile: string | null;
  activeHtmlFile: string | null;
  openedFiles: string[];
  studentSettings: Settings;
  filesData: { [fileName: string]: ExportV2FileData };
};

export type AttemptStateExport = {
  currentFilesContent: { [fileName: string]: string };
  filesPreview: { [fileName: string]: FilePreview };
  openedFiles: string[];
  previewIsLive: boolean;
};

export type ExportData = {
  dataFormatVersion: number;
  type: ExportV2Type;
  initialState: InitialStateExport;
  attemptState?: AttemptStateExport;
};

export type ExportV2Activity = {
  activeFile: string | null;
  activeHtmlFile: string | null;
  openedFiles: string[];
  studentSettings: Settings;
  filesData: { [fileName: string]: ExportV2FileData };
};

export type ExportV2FilePreview = {
    contentIndex: number;
    contentType: ContentType;
    upToDate: boolean;
};

export type ExportV2FileState = {
  contentIndex: number;
  contentType: ContentType;
  initialName: string | null;
};

export type ExportV2Attempt = {
  activeFile: string | null;
  activeHtmlFile: string | null;
  filesState: { [fileName: string]: ExportV2FileState };
  openedFiles: string[];
  previewIsLive: boolean;
  previewState: { [fileName: string]: ExportV2FilePreview };
};

export type ExportV2Content = {
  text: string[];
  base64: string[];
};

export type ExportV2 = {
  dataFormatVersion: number;
  type: ExportV2Type;
  activity: ExportV2Activity;
  attempt?: ExportV2Attempt;
  content: ExportV2Content;
};
