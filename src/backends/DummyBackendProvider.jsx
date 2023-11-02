import { BackendProvider } from "../contexts/BackendProvider";
import attemptData from "../content/v2attempt.json";

export function DummyBackendProvider({ children }) {
  return (
    <BackendProvider initialData={attemptData} isAttempt={false}>
      {children}
    </BackendProvider>
  );
}
