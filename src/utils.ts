import { useState } from "react";
import { saveAs } from "file-saver";
import Mime from "mime/lite.js";
import { allowedTextFileTypes } from "./appSettings";

export const isValidFilename = (function () {
  // https://stackoverflow.com/questions/11100821/javascript-regex-for-validating-filenames
  const rg1 = /^[^\\/:*?"<>|]+$/; // forbidden characters \ / : * ? " < > |
  const rg2 = /\./; // cannot contain dot (.)
  const rg3 = /^(nul|prn|con|lpt[0-9]|com[0-9])(\.|$)/i; // forbidden file names
  const rg4 = /^ /; // cannot start with a space
  const rg5 = / $/; // cannot end with a space
  return function isValid(fileName, existingFileNames = []) {
    if (!rg1.test(fileName)) {
      return [
        false,
        "Le nom de fichier ne peut pas contenir de caractères spéciaux",
      ];
    }
    if (rg2.test(fileName)) {
      return [false, "Le nom de fichier ne peut pas contenir de point"];
    }
    if (rg3.test(fileName)) {
      return [false, "Ce nom de fichier est interdit"];
    }
    if (rg4.test(fileName)) {
      return [false, "Le nom de fichier ne peut pas commencer par un espace"];
    }
    if (rg5.test(fileName)) {
      return [false, "Le nom de fichier ne peut pas finir par un espace"];
    }
    if (existingFileNames.includes(fileName)) {
      return [false, "Un fichier avec ce nom existe déjà"];
    }
    return [true, " "];
  };
})();

export function splitFileNameExtension(fileName) {
  if (!fileName.includes(".")) return [fileName, ""]; // no extension
  const [extension] = fileName.split(".").reverse();
  const name = fileName.slice(0, -extension.length - 1);
  return [name, extension];
}

export function getMime(fileName) {
  const mime = Mime.getType(fileName);
  // Assurance for .js files (debate going on)
  if (mime === "text/javascript") return "application/javascript";
  return mime;
}

export function getExtension(mime) {
  const extension = Mime.getExtension(mime);
  return extension;
}

export function appendClassnames(...classNames) {
  return classNames.filter((c) => c).join(" ");
}

export function objectMap<
  SourceKey extends string,
  SourceValue,
  TargetKey extends string,
  TargetValue,
>(
  obj: { [key in SourceKey]: SourceValue },
  map_fn: (
    key: SourceKey,
    value: SourceValue,
    index: number
  ) => [TargetKey, TargetValue] | null
): { [key in TargetKey]: TargetValue } {
  //@ts-ignore
  return Object.fromEntries(
    Object.entries(obj)
      //@ts-ignore
      .map(([k, v], i) => map_fn(k, v, i))
      .filter((x) => x)
  );
}

export function getNumberOfLines(content) {
  return content.split("\n").length;
}

// Hook to force the rerender of a component
export function useForceUpdate() {
  const [, setValue] = useState(0);
  return () => setValue((value) => value + 1);
}

export function downloadTextFile(fileName, fileContent) {
  const blob = new Blob([fileContent], {
    type: getMime(fileName),
  });
  saveAs(blob, fileName);
}

export function downloadBase64File(fileName, fileContent) {
  const a = document.createElement("a");
  a.download = fileName;
  a.href = fileContent;
  a.click();
  a.remove();
}

export function downloadFile(fileName, fileContent) {
  if (
    (allowedTextFileTypes as string[]).includes(getMime(fileName)) ||
    !fileContent.includes("base64,")
  ) {
    downloadTextFile(fileName, fileContent);
  } else {
    downloadBase64File(fileName, fileContent);
  }
}
