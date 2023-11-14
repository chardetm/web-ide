import { createContext, useContext, useMemo } from "react";
import { ExportV2 } from "../state/types";
import {
  PartialExportV2Data,
  dataWithMissingFields,
} from "../state/versionCompatibility";

const BackendMarkDirtyContext = createContext(() => {});
const BackendIsAttemptContext = createContext(false);
const BackendInitialDataContext = createContext<ExportV2>(null);

interface BackendProviderProps {
  children: React.ReactNode;
  initialData: ExportV2;
  isAttempt?: boolean;
  markDirty?: () => void;
}

export function BackendProvider({
  children,
  initialData,
  isAttempt,
  markDirty = () => {},
}: BackendProviderProps) {
  const checkedInitialData = useMemo(
    () => dataWithMissingFields(initialData as PartialExportV2Data),
    [initialData]
  );

  return (
    <BackendMarkDirtyContext.Provider value={markDirty}>
      <BackendIsAttemptContext.Provider value={isAttempt}>
        <BackendInitialDataContext.Provider value={checkedInitialData}>
          {children}
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
