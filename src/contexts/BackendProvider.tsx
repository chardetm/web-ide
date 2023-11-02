import { createContext, useContext } from "react";
import { ExportV2 } from "src/state/types";

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
  return (
    <BackendMarkDirtyContext.Provider value={markDirty}>
      <BackendIsAttemptContext.Provider value={isAttempt}>
        <BackendInitialDataContext.Provider value={initialData}>
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
