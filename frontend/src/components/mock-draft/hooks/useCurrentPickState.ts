"use client";

import { useMemo } from "react";
import type { DraftPick } from "../MockDraft";

/**
 * Returns current pick info based on the draftPlan and current user state.
 */
export function useCurrentPickState(
  draftPlan: DraftPick[],
  draftStarted: boolean,
  userDraftSlot: number | null
) {
  const currentPickIndex = useMemo(() => {
    return draftPlan.findIndex((p) => !p.draftedPlayer);
  }, [draftPlan]);

  const currentPick = useMemo(() => {
    return draftPlan[currentPickIndex];
  }, [draftPlan, currentPickIndex]);

  const draftComplete = useMemo(() => {
    return currentPickIndex === -1;
  }, [currentPickIndex]);

  const isUserTurn = useMemo(() => {
    return draftStarted && userDraftSlot === currentPick?.teamIndex;
  }, [draftStarted, userDraftSlot, currentPick]);

  return {
    currentPickIndex,
    currentPick,
    draftComplete,
    isUserTurn,
  };
}
