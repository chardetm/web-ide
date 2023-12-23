import { useState } from "react";
import { saveAs } from "file-saver";
import Mime from "mime/lite.js";
import { FileType, allowedTextFileTypes } from "./appSettings";

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

export function splitFileNameExtension(fileName: string) {
  if (!fileName.includes(".")) return [fileName, ""]; // no extension
  const [extension] = fileName.split(".").reverse();
  const name = fileName.slice(0, -extension.length - 1);
  return [name, extension];
}

export function getMime(fileName: string): string {
  const mime = Mime.getType(fileName);
  // Assurance for .js files (debate going on)
  if (mime === "text/javascript") return "application/javascript";
  return mime;
}

export function getExtension(mime: FileType): string {
  const extension = Mime.getExtension(mime);
  return extension;
}

export function appendClassnames(...classNames: string[]): string {
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

export function getNumberOfLines(content: string): number {
  return content.split("\n").length;
}

// Hook to force the rerender of a component
export function useForceUpdate() {
  const [, setValue] = useState(0);
  return () => setValue((value) => value + 1);
}

export function downloadTextFile(fileName: string, fileContent: string) {
  const blob = new Blob([fileContent], {
    type: getMime(fileName),
  });
  saveAs(blob, fileName);
}

export function downloadBase64File(fileName: string, fileContent: string) {
  const a = document.createElement("a");
  a.download = fileName;
  a.href = fileContent;
  a.click();
  a.remove();
}

export function downloadFile(fileName: string, fileContent: string | Blob) {
  if (fileContent instanceof Blob) {
    saveAs(fileContent, fileName);
  } else {
    downloadTextFile(fileName, fileContent);
  }
}

export function blobToUrlBase64(blob: Blob): Promise<string> {
  // from https://stackoverflow.com/questions/18650168/convert-blob-to-base64
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
}

function urlBase64ToBase64(urlBase64: string): string {
  return urlBase64.split(",")[1];
}

export function urlBase64ToBlob(urlBase64: string): Blob {
  const mime = urlBase64.split(";")[0].split(":")[1];
  return base64toBlob(urlBase64ToBase64(urlBase64), mime);
}

export function base64toBlob(base64: string, mime: string): Blob {
  // from https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
  debugger;
  const contentType = mime || "";
  var sliceSize = 1024;
  var byteCharacters = atob(base64);
  var bytesLength = byteCharacters.length;
  var slicesCount = Math.ceil(bytesLength / sliceSize);
  var byteArrays = new Array(slicesCount);

  for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    var begin = sliceIndex * sliceSize;
    var end = Math.min(begin + sliceSize, bytesLength);

    var bytes = new Array(end - begin);
    for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
}

function base64ToBytes(base64: string): Uint8Array {
  const binString = atob(base64);
  return Uint8Array.from(binString, (m) => m.codePointAt(0));
}

function bytesToBase64(bytes: Uint8Array): string {
  // from https://stackoverflow.com/questions/63020540/converting-a-larger-byte-array-to-a-string
  let rs = [];
  let batch = 32767; // Supported 'all' browsers
  for (let i = 0; i < bytes.length; ) {
    let e = i + batch;
    // Build batch section, defer to Array.join.
    rs.push(String.fromCodePoint.apply(null, bytes.slice(i, e)));
    i = e;
  }
  return btoa(rs.join(""));
}

/* // has a size limit
function bytesToBase64(bytes: Uint8Array): string {
  const binString = String.fromCodePoint(...bytes);
  return btoa(binString);
}*/

export function stringToBase64(str: string): string {
  return bytesToBase64(new TextEncoder().encode(str));
}

export function base64ToUrlBase64(mime: string, base64: string): string {
  return "data:" + mime + ";base64," + base64;
}

export function stringToUrlBase64(mime: string, str: string): string {
  return base64ToUrlBase64(mime, stringToBase64(str));
}

export function base64ToString(base64: string): string {
  return new TextDecoder().decode(base64ToBytes(base64));
}
