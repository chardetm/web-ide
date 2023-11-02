import { createContext, useContext, useReducer } from "react";
import ideStateReducer from "../state/reducer";
import { exportV2 } from "../state/state";

const IDEStateContext = createContext(undefined);
const IDEStateDispatchContext = createContext(undefined);
const IDEInitialStateContext = createContext(undefined);
const IDEInitialStateDispatchContext = createContext(undefined);
const IDEChosenStateContext = createContext(undefined);
const IDEChosenStateDispatchContext = createContext(undefined);
const IDEGetExportDataContext = createContext(undefined);

interface IDEStateProviderProps {
  children: React.ReactNode;
}

export function IDEStateProvider({ children }: IDEStateProviderProps) {
  const [initialState, initialDispatch] = useReducer(ideStateReducer, null);
  const [state, dispatch] = useReducer(ideStateReducer, null);

  return (
    <IDEInitialStateContext.Provider value={initialState}>
      <IDEInitialStateDispatchContext.Provider value={initialDispatch}>
        <IDEStateContext.Provider value={state}>
          <IDEStateDispatchContext.Provider value={dispatch}>
            <IDEGetExportDataContext.Provider
              value={(isAttempt) => {
                return exportV2(initialState, state, isAttempt);
              }}
            >
              {children}
            </IDEGetExportDataContext.Provider>
          </IDEStateDispatchContext.Provider>
        </IDEStateContext.Provider>
      </IDEInitialStateDispatchContext.Provider>
    </IDEInitialStateContext.Provider>
  );
}

export function useIDEGetExportData() {
  return useContext(IDEGetExportDataContext);
}

export function useIDEState() {
  return useContext(IDEStateContext);
}

export function useIDEInitialState() {
  return useContext(IDEInitialStateContext);
}

export function useIDEStateDispatch() {
  return useContext(IDEStateDispatchContext);
}

export function useIDEInitialStateDispatch() {
  return useContext(IDEInitialStateDispatchContext);
}

export function IDEChosenStateProvider({ children, initial }) {
  const initialState = useIDEInitialState();
  const state = useIDEState();
  const chosenState = initial ? initialState : state;
  const initialDispatch = useIDEInitialStateDispatch();
  const dispatch = useIDEStateDispatch();
  const chosenDispatch = initial ? initialDispatch : dispatch;
  return (
    <IDEChosenStateContext.Provider value={chosenState}>
      <IDEChosenStateDispatchContext.Provider value={chosenDispatch}>
        {children}
      </IDEChosenStateDispatchContext.Provider>
    </IDEChosenStateContext.Provider>
  );
}

export function useIDEChosenState() {
  return useContext(IDEChosenStateContext);
}

export function useIDEChosenStateDispatch() {
  return useContext(IDEChosenStateDispatchContext);
}
