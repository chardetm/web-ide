import WebIDE from "./pages/WebIDE";
import { BackendProvider } from "./contexts/BackendProvider";
import { IDEStateProvider } from "./contexts/IDEStateProvider";

import {
  useIDEState,
  useIDEStateDispatch,
  useIDEInitialState,
  useIDEInitialStateDispatch,
  useIDEGetExportData,
} from "./contexts/IDEStateProvider";

export {
  WebIDE as WebIDE,
  BackendProvider as WebIDEBackendProvider,
  IDEStateProvider as WebIDEStateProvider,
  useIDEState as useWebIDEState,
  useIDEStateDispatch as useWebIDEStateDispatch,
  useIDEInitialState as useWebIDEInitialState,
  useIDEInitialStateDispatch as useWebIDEInitialStateDispatch,
  useIDEGetExportData as useWebIDEGetExportData,
};
