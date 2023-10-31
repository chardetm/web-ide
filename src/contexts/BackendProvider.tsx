import { createContext, useContext } from "react";

const BackendMarkDirtyContext = createContext(() => {});
const BackendIsAttemptContext = createContext(false);

interface BackendProviderProps {
    children: React.ReactNode;
    isAttempt?: boolean;
    markDirty?: () => void;
}

export function BackendProvider({
  children,
  isAttempt,
  markDirty = () => {},
}: BackendProviderProps) {
  return (
    <BackendMarkDirtyContext.Provider value={markDirty}>
      <BackendIsAttemptContext.Provider value={isAttempt}>
        {children}
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
