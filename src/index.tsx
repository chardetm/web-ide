import WebIDE from "./pages/WebIDE";
import { BackendProvider } from "./contexts/BackendProvider";
import { IDEStateProvider } from "./contexts/IDEStateProvider";
import { Window } from "./features/windows/Window";

import {
  useIDEState,
  useIDEStateDispatch,
  useIDEInitialState,
  useIDEInitialStateDispatch,
  useIDEGetExportData,
} from "./contexts/IDEStateProvider";

import example1 from "./content/example1.json";
import { ExportV2 } from "./state/types";

type ExamplesType = {
  [key: string]: ExportV2;
};

const webIDEExamples: ExamplesType = {
  example1: example1 as ExportV2,
};

export {
  WebIDE as WebIDE,
  BackendProvider as WebIDEBackendProvider,
  IDEStateProvider as WebIDEStateProvider,
  Window as WebIDEWindow,
  useIDEState as useWebIDEState,
  useIDEStateDispatch as useWebIDEStateDispatch,
  useIDEInitialState as useWebIDEInitialState,
  useIDEInitialStateDispatch as useWebIDEInitialStateDispatch,
  useIDEGetExportData as useWebIDEGetExportData,
  webIDEExamples as webIDEExamples,
};
