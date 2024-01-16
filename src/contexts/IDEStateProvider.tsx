import React, { ReactNode, createContext, useContext, useReducer } from "react";
import ideStateReducer, { IDEStateAction } from "../state/reducer";
import { exportV2 } from "../state/state";
import { ExportV2, IDEState } from "src/state/types";

const IDEStateContext = createContext<IDEState>(undefined);
const IDEStateDispatchContext =
  createContext<React.Dispatch<IDEStateAction>>(undefined);
const IDEInitialStateContext = createContext<IDEState>(undefined);
const IDEInitialStateDispatchContext =
  createContext<React.Dispatch<IDEStateAction>>(undefined);
const IDEChosenStateContext = createContext<IDEState>(undefined);
const IDEChosenStateDispatchContext =
  createContext<React.Dispatch<IDEStateAction>>(undefined);
const IDEGetExportDataContext =
  createContext<(isAttempt: boolean) => Promise<ExportV2>>(undefined);

interface IDEStateProviderProps {
  children: ReactNode;
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

export function IDEChosenStateProvider({
  children,
  initial,
}: {
  children?: ReactNode;
  initial: boolean;
}) {
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
