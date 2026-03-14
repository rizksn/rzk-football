"use client";

import { useContext } from "react";

import { DraftSessionContext } from "../session/session.context";

export function useMockDraftSession() {
  const context = useContext(DraftSessionContext);

  if (!context) {
    throw new Error(
      "useMockDraftSession must be used within a DraftSessionProvider",
    );
  }

  return context;
}
