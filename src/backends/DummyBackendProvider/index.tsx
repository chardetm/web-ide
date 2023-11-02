import { BackendProvider } from "../../contexts/BackendProvider";
import exampleAttempt from "../../content/example1.json";
import { ExportV2 } from "src/state/types";

function DummyBackendProvider({ children }) {
  return (
    <BackendProvider initialData={exampleAttempt as ExportV2} isAttempt={false}>
      {children}
    </BackendProvider>
  );
}

export default DummyBackendProvider;
