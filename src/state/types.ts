import { FileType } from "../appSettings";

export type FilePermissions = {
  firstVisibleLine: number;
  lastVisibleLine: number;
  canEdit: boolean;
  canRename: boolean;
  canDelete: boolean;
};

export type ContentType = "text" | "binary";

export type ExportV2ContentType = "text" | "base64";

export type FileData = (
  | {
      contentType: "text";
      content: string;
    }
  | {
      contentType: "binary";
      blob: Blob;
      blobUrl?: string | undefined;
    }
) & {
  permissions: FilePermissions;
  studentPermissions: FilePermissions;
  initialName: string | null;
};

export type FilePreview = (
  | {
      contentType: "text";
      content: string | null; // Storing text in addition to blob to avoid having to convert it back to text when parsing HTML
    }
  | {
      contentType: "binary";
    }
) & {
  blob: Blob | null;
  upToDate: boolean;
};

export type Settings = {
  previewIsLive: boolean;
  lineWrap: boolean;
  autoCloseTags: boolean;
  allowedNewTextFileTypes: FileType[];
  canUploadTextFiles: boolean;
  canUploadImageFiles: boolean;
  canUploadAudioFiles: boolean;
  canDownloadFiles: boolean;
  canSeeFilesList: boolean;
  canSetVisibilityBounds: boolean;
  canSetFilesPermissions: boolean;
  canSeeOutOfBounds: boolean;
  canOpenAndCloseTabs: boolean;
  canChangePreviewMode: boolean;
  allowedSyntaxCheckers: string[];
  isCustomSettings: boolean;
  onlySeeBody: boolean;
};

export type IDEFileTypesInitialContent = Partial<{
  [key in FileType]: string;
}>;

export type IDEState = {
  activeFile: string | null;
  activeHtmlFile: string | null;
  previewAnchor: string | null;
  openedFiles: string[];
  fileTypesInitialContent: IDEFileTypesInitialContent;
  settings: Settings;
  studentSettings: Settings;
  filesData: { [fileName: string]: FileData };
  filesPreview: { [fileName: string]: FilePreview };
};

export type ExportV2Type = "exercise" | "attempt";

export type ExportV2FileData = {
  contentIndex: number;
  contentType: ExportV2ContentType;
  studentPermissions: FilePermissions;
};

export type ExportV2Activity = {
  activeFile: string | null;
  activeHtmlFile: string | null;
  openedFiles: string[];
  fileTypesInitialContent: IDEFileTypesInitialContent;
  studentSettings: Settings;
  filesData: { [fileName: string]: ExportV2FileData };
};

export type ExportV2FilePreview = {
  contentIndex: number;
  contentType: ExportV2ContentType;
  upToDate: boolean;
};

export type ExportV2FileState = {
  contentIndex: number;
  contentType: ExportV2ContentType;
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
