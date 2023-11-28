import { createContext, useContext, useMemo } from "react";
import { ExportV2 } from "../state/types";
import {
  PartialExportV2Data,
  dataWithMissingFields,
} from "../state/versionCompatibility";
import { WebIDELayout } from "..";

const BackendMarkDirtyContext = createContext(() => {});
const BackendIsAttemptContext = createContext(false);
const BackendInitialDataContext = createContext<ExportV2>(null);
const BackendLayoutContext = createContext<WebIDELayout>("auto");

interface BackendProviderProps {
  children: React.ReactNode;
  initialData: ExportV2;
  isAttempt?: boolean;
  markDirty?: () => void;
  layout?: WebIDELayout;
}

export function BackendProvider({
  children,
  initialData,
  isAttempt,
  markDirty = () => {},
  layout = "auto",
}: BackendProviderProps) {
  const checkedInitialData = useMemo(
    () => dataWithMissingFields(initialData as PartialExportV2Data),
    [initialData]
  );

  return (
    <BackendMarkDirtyContext.Provider value={markDirty}>
      <BackendIsAttemptContext.Provider value={isAttempt}>
        <BackendInitialDataContext.Provider value={checkedInitialData}>
          <BackendLayoutContext.Provider value={layout}>
            {children}
          </BackendLayoutContext.Provider>
        </BackendInitialDataContext.Provider>
      </BackendIsAttemptContext.Provider>
    </BackendMarkDirtyContext.Provider>
  );
}

export function useBackendMarkDirty() {
  return useContext(BackendMarkDirtyContext);
}

export function useBackendIsAttempt() {
  return useContext(BackendIsAttemptContext);
}

export function useBackendInitialdata() {
  return useContext(BackendInitialDataContext);
}

export function useBackendLayout() {
  return useContext(BackendLayoutContext);
}
