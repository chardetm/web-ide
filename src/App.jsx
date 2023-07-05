import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import "./App.scss";
import { FileBackendProvider } from "./backends/FileBackendProvider";
import { CapytaleBackendProvider } from "./backends/CapytaleBackendProvider";

import { useMemo } from "react";
import { IDEStateProvider } from "./contexts/IDEStateProvider";
import Exercise from "./pages/Exercise";

function getId() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get("id");
  return id;
}

function App() {
  const SelectedBackendProvider = useMemo(() => {
    const id = getId();
    return id ? CapytaleBackendProvider : FileBackendProvider;
  }, []);

  return (
    <div className="App" id="app">
      <IDEStateProvider>
        <SelectedBackendProvider>
          <Exercise />
        </SelectedBackendProvider>
      </IDEStateProvider>
    </div>
  );
}

export default App;
