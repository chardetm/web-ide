import { BackendProvider } from "../contexts/BackendProvider";
import exampleAttempt from "../content/example1.json";

export function DummyBackendProvider({ children }) {
  return (
    <BackendProvider initialData={exampleAttempt} isAttempt={false}>
      {children}
    </BackendProvider>
  );
}
