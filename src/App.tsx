import "./App.scss";
import FileBackendProvider from "./backends/BasicFileBackendProvider";

import { IDEStateProvider } from "./contexts/IDEStateProvider";
import WebIDE from "./pages/WebIDE";

function App() {
  return (
    <div className="App" id="app">
      <IDEStateProvider>
        <FileBackendProvider>
          <WebIDE />
        </FileBackendProvider>
      </IDEStateProvider>
    </div>
  );
}

export default App;
