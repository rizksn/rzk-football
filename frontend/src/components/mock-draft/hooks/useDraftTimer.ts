"use client";

import { useEffect, useState } from "react";
import type { Player } from "@/types/core/player";

/**
 * Handles timer state, ticking control, and auto-pick logic if timer hits 0.
 */
export function useDraftTimer(
  draftStarted: boolean,
  draftComplete: boolean,
  isUserTurn: boolean,
  availablePlayers: Player[],
  handleUserPick: (player: Player) => void
) {
  const [timer, setTimer] = useState(120);
  const [isTicking, setIsTicking] = useState(false);

  useEffect(() => {
    if (!draftStarted || !isUserTurn || draftComplete) return;

    if (timer === 0) {
      console.warn("⏰ Timer expired — forcing pick for user...");

      const topQueuedPlayer = null; // Placeholder for future logic
      const fallbackPlayer = availablePlayers[0];

      if (fallbackPlayer) {
        handleUserPick(fallbackPlayer);
      }

      setTimer(120);
    }
  }, [timer, draftStarted, isUserTurn, draftComplete, availablePlayers]);

  return {
    timer,
    setTimer,
    isTicking,
    setIsTicking,
  };
}
