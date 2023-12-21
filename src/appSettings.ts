export const dataFormatVersion = 2;

export const fileTypesInfo = {
  "text/html": {
    label: "Page web (HTML)",
    name: "HTML",
    shortName: "HTML",
    extension: "html",
  },
  "text/css": {
    label: "Feuille de style (CSS)",
    name: "CSS",
    shortName: "CSS",
    extension: "css",
  },
  "application/javascript": {
    label: "Script (Javascript)",
    name: "Javascript",
    shortName: "JS",
    extension: "js",
  },
  "image/apng": {
    label: "PNG animé (APNG)",
    name: "APNG",
    shortName: "APNG",
    extension: "apng",
  },
  "image/avif": {
    label: "Format d'image AV1 (AVIF)",
    name: "AVIF",
    shortName: "AVIF",
    extension: "avif",
  },
  "image/gif": {
    label: "Graphics Interchange Format (GIF)",
    name: "GIF",
    shortName: "GIF",
    extension: "gif",
  },
  "image/jpeg": {
    label: "JPEG",
    name: "JPEG",
    shortName: "JPEG",
    extension: "jpg",
  },
  "image/png": {
    label: "Portable Network Graphics (PNG)",
    name: "PNG",
    shortName: "PNG",
    extension: "png",
  },
  "image/svg+xml": {
    label: "Scalable Vector Graphics (SVG)",
    name: "SVG",
    shortName: "SVG",
    extension: "svg",
  },
  "image/webp": {
    label: "WebP",
    name: "WebP",
    shortName: "WebP",
    extension: "webp",
  },
  "audio/mpeg": {
    label: "MP3",
    name: "MP3",
    shortName: "MP3",
    extension: "mp3",
  },
  "audio/ogg": {
    label: "OGG",
    name: "OGG",
    shortName: "OGG",
    extension: "ogg",
  },
  "audio/wav": {
    label: "WAV",
    name: "WAV",
    shortName: "WAV",
    extension: "wav",
  },
  "audio/aac": {
    label: "AAC",
    name: "AAC",
    shortName: "AAC",
    extension: "aac",
  },
};

export type FileType = keyof typeof fileTypesInfo;

export const allowedTextFileTypes: FileType[] = [
  "text/html",
  "text/css",
  "application/javascript",
];

export const allowedImageFileTypes = [
  "image/apng",
  "image/avif",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "image/webp",
];

export const allowedAudioFileTypes = [
  "audio/mpeg",
  "audio/ogg",
  "audio/wav",
  "audio/aac",
];

export const editModesBooleanSettings = {
  canSeeFilesList: "Voir la liste des fichiers",
  canOpenAndCloseTabs: "Ouvrir et fermer des onglets",
  canUploadTextFiles: "Téléverser des fichiers texte",
  canUploadImageFiles: "Téléverser des images",
  canUploadAudioFiles: "Téléverser des fichiers audio",
  canDownloadFiles: "Télécharger les fichiers",
  canSeeOutOfBounds: "Voir le code caché",
};

export const allowedSyntaxCheckers = {
  "text/html": {},
};
