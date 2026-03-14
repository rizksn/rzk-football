"use client";

import {
  createContext,
  useMemo,
  useReducer,
  type Dispatch,
  type PropsWithChildren,
} from "react";

import {
  draftSessionReducer,
  INITIAL_DRAFT_SESSION_STATE,
} from "./session.reducer";
import type { DraftSessionAction, DraftSessionState } from "./session.types";

export interface DraftSessionContextValue {
  state: DraftSessionState;
  dispatch: Dispatch<DraftSessionAction>;
}

export const DraftSessionContext =
  createContext<DraftSessionContextValue | null>(null);

export function DraftSessionProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(
    draftSessionReducer,
    INITIAL_DRAFT_SESSION_STATE,
  );

  const value = useMemo<DraftSessionContextValue>(
    () => ({
      state,
      dispatch,
    }),
    [state],
  );

  return (
    <DraftSessionContext.Provider value={value}>
      {children}
    </DraftSessionContext.Provider>
  );
}
