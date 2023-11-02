import { BackendProvider } from "../contexts/BackendProvider";
import { downloadTextFile } from "../utils";

import attemptData from "../content/v2attempt.json";


export function DummyBackendProvider({ children }) {
  async function load() {
    return attemptData;
  }
  async function save(data) {
    downloadTextFile("export.json", JSON.stringify(data, null, 2));
  }

  return (
    <BackendProvider load={load} save={save}>
      {children}
    </BackendProvider>
  );
}