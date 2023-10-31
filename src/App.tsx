import "./App.scss";
import { FileBackendProvider } from "./backends/FileBackendProvider";

import { IDEStateProvider } from "./contexts/IDEStateProvider";
import Exercise from "./pages/Exercise";

function App() {
  return (
    <div className="App" id="app">
      <IDEStateProvider>
        <FileBackendProvider>
          <Exercise />
        </FileBackendProvider>
      </IDEStateProvider>
    </div>
  );
}

export default App;
