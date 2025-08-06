"use client";

import { useEffect, useState, useRef } from "react";
import type { Player } from "@/types/core/player";

export function useDraftTimer(
  draftStarted: boolean,
  draftComplete: boolean,
  isUserTurn: boolean,
  availablePlayers: Player[],
  handleUserPick: (player: Player) => void,
  timerDisabled: boolean
) {
  const [timer, setTimer] = useState(120);
  const [isTicking, setIsTicking] = useState(false);
  const [wasManuallyPaused, setWasManuallyPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 🎬 Start ticking unless user paused manually
  useEffect(() => {
    if (!draftStarted || draftComplete || timerDisabled) return;

    if (!wasManuallyPaused) {
      setIsTicking(true);
    }
  }, [draftStarted, draftComplete, wasManuallyPaused, timerDisabled]);

  // ⏱ Tick every second
  useEffect(() => {
    if (!isTicking) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isTicking]);

  // 🧠 Auto-pick if user time runs out
  useEffect(() => {
    if (!draftStarted || !isUserTurn || draftComplete || timerDisabled) return;

    if (timer === 0) {
      const fallbackPlayer = availablePlayers[0];
      if (fallbackPlayer) {
        handleUserPick(fallbackPlayer);
      }

      setTimer(120);
      setIsTicking(false);
    }
  }, [
    timer,
    draftStarted,
    isUserTurn,
    draftComplete,
    availablePlayers,
    timerDisabled,
  ]);

  // 🧷 Controls
  const pause = () => {
    setIsTicking(false);
    setWasManuallyPaused(true);
  };

  const resume = () => {
    setIsTicking(true);
    setWasManuallyPaused(false);
  };

  const showPauseButton = draftStarted && isTicking && !draftComplete;
  const showPlayButton =
    draftStarted && !isTicking && wasManuallyPaused && !draftComplete;

  return {
    timer,
    setTimer,
    isTicking,
    setIsTicking,
    pause,
    resume,
    showPauseButton,
    showPlayButton,
  };
}
