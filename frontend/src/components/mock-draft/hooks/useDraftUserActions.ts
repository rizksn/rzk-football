"use client";

import type { DraftPick } from "../MockDraft";
import type { Player } from "@/types/core/player";

/**
 * Encapsulates user-initiated actions like starting the draft
 * and manually assigning players to a slot.
 */
export function useDraftUserActions(
  draftPlan: DraftPick[],
  setDraftPlan: (plan: DraftPick[]) => void,
  assignModeIndex: number | null,
  setAssignModeIndex: (index: number | null) => void,
  setDraftStarted: (v: boolean) => void,
  setIsTicking: (v: boolean) => void,
  userDraftSlot: number | null,
  setUserRoster: React.Dispatch<React.SetStateAction<Player[]>>
) {
  const handleManualAssignPlayer = (player: Player) => {
    if (assignModeIndex === null) return;

    const pickToAssign = draftPlan[assignModeIndex];
    if (!pickToAssign || pickToAssign.draftedPlayer) return;

    const updated = [...draftPlan];
    updated[assignModeIndex] = {
      ...pickToAssign,
      draftedPlayer: player,
    };

    if (pickToAssign.teamIndex === userDraftSlot) {
      setUserRoster((prev) => [...prev, player]);
    }

    setDraftPlan(updated);
    setAssignModeIndex(null);
  };

  const handleStartDraft = () => {
    setDraftStarted(true);
    setIsTicking(true);
  };

  return {
    handleManualAssignPlayer,
    handleStartDraft,
  };
}
