import { getJSONExample } from "../content/files";
import { BackendProvider } from "../contexts/BackendProvider";
import { downloadTextFile } from "../utils";


export function DummyBackendProvider({ children }) {
  async function load() {
    return getJSONExample();
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