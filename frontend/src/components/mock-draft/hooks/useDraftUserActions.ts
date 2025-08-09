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
  userDraftSlot: number | null,
  draftStarted: boolean // ⬅️ added: respect locking after start
) {
  const handleManualAssignPlayer = (player: Player) => {
    // Disallow manual assignments once the draft has started
    if (draftStarted) {
      setAssignModeIndex(null);
      return;
    }

    if (assignModeIndex === null) return;

    const pickToAssign = draftPlan[assignModeIndex];
    if (!pickToAssign || pickToAssign.draftedPlayer) {
      setAssignModeIndex(null);
      return;
    }

    const alreadyAssigned = draftPlan.some(
      (p) => p.draftedPlayer?.player_id === player.player_id
    );
    if (alreadyAssigned) {
      setAssignModeIndex(null);
      return;
    }

    const updated = draftPlan.map((pick, i) =>
      i === assignModeIndex ? { ...pick, draftedPlayer: player } : pick
    );

    setDraftPlan(updated);
    setAssignModeIndex(null);
  };

  const handleStartDraft = () => {
    setDraftStarted(true);
  };

  return {
    handleManualAssignPlayer,
    handleStartDraft,
  };
}
