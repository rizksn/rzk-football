"use client";

import { useEffect, useState, useRef } from "react";
import type { Player } from "@/types/core/player";

export function useDraftTimer(
  draftStarted: boolean,
  draftComplete: boolean,
  isUserTurn: boolean,
  availablePlayers: Player[],
  handleUserPick: (player: Player) => void,
  timerDisabled: boolean,
  isPaused: boolean,
  initialTimerDuration: number
) {
  const [timer, setTimer] = useState(initialTimerDuration);
  const [isTicking, setIsTicking] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 🎬 Start ticking ONLY if: user turn, draft is active, and timer isn't disabled
  useEffect(() => {
    if (
      !draftStarted ||
      draftComplete ||
      isPaused ||
      !isUserTurn ||
      timerDisabled
    ) {
      setIsTicking(false);
      return;
    }
    setIsTicking(true);
  }, [draftStarted, draftComplete, isPaused, isUserTurn, timerDisabled]);

  // ⏱ Tick down
  useEffect(() => {
    if (!isTicking) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimer((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isTicking]);

  // 🧠 Auto-pick at 0
  useEffect(() => {
    if (
      timer === 0 &&
      draftStarted &&
      isUserTurn &&
      !draftComplete &&
      !timerDisabled &&
      !isPaused
    ) {
      const fallbackPlayer = availablePlayers[0];
      if (fallbackPlayer) {
        handleUserPick(fallbackPlayer);
      }
    }
  }, [
    timer,
    draftStarted,
    draftComplete,
    isUserTurn,
    timerDisabled,
    availablePlayers,
    handleUserPick,
  ]);

  const pause = () => setIsTicking(false);
  const resume = () => setIsTicking(true);

  const showPauseButton = draftStarted && isTicking && !draftComplete;
  const showPlayButton =
    draftStarted &&
    !isTicking &&
    isUserTurn &&
    !timerDisabled &&
    !draftComplete;

  return {
    timer,
    setTimer,
    isTicking,
    pause,
    resume,
    showPauseButton,
    showPlayButton,
  };
}
