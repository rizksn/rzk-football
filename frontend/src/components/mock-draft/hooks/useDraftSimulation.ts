"use client";

import { useCallback } from "react";
import { API_BASE_URL } from "@/utils/config";
import type { DraftPick } from "../MockDraft";
import type { Player } from "@/types/core/player";
import type { DraftConfig, DraftRosterSettings } from "@/types/draft/config";

/**
 * Encapsulates CPU and user pick simulation logic.
 * Consumes draft state and calls the backend appropriately.
 */
export function useDraftSimulation(
  draftPlan: DraftPick[],
  setDraftPlan: (newPlan: DraftPick[]) => void,
  scoredPlayers: Player[],
  draftConfig: DraftConfig,
  rosterSettings: DraftRosterSettings
) {
  const updateDraftPlanFromBackend = (newPlan: DraftPick[]) => {
    setDraftPlan(newPlan);
  };

  const simulateCpuPick = useCallback(
    async (currentPick: DraftPick | undefined) => {
      if (!currentPick) return;

      const payload = {
        draftPlan,
        scoredPlayers,
        teamIndex: currentPick.teamIndex,
        leagueFormat: draftConfig.leagueFormat,
        adpFormatKey: draftConfig.adpFormatKey,
        roster_config: {
          positions: rosterSettings.positions,
          bench_count: rosterSettings.benchCount,
          total_rounds: rosterSettings.totalRounds,
        },
        use_ai: draftConfig.useAI,
      };

      try {
        const res = await fetch(`${API_BASE_URL}/api/simulate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();
        if (!Array.isArray(data?.draftPlan)) {
          console.error("❌ No draftPlan returned:", data);
          return;
        }

        updateDraftPlanFromBackend(data.draftPlan);
      } catch (err) {
        console.error("❌ Failed to simulate CPU pick:", err);
      }
    },
    [draftPlan, scoredPlayers, draftConfig, rosterSettings]
  );

  const handleUserPick = async (
    player: Player,
    currentPick: DraftPick | undefined,
    setIsTicking: (v: boolean) => void,
    setTimer: (v: number) => void
  ) => {
    if (!currentPick) return;

    const payload = {
      draftPlan,
      scoredPlayers,
      teamIndex: currentPick.teamIndex,
      leagueFormat: draftConfig.leagueFormat,
      adpFormatKey: draftConfig.adpFormatKey,
      roster_config: {
        positions: rosterSettings.positions,
        bench_count: rosterSettings.benchCount,
        total_rounds: rosterSettings.totalRounds,
      },
      use_ai: false,
      selectedPlayerId: player.player_id,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/simulate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!Array.isArray(data?.draftPlan)) {
        console.error("❌ No draftPlan returned:", data);
        return;
      }

      updateDraftPlanFromBackend(data.draftPlan);
      setIsTicking(false);
      setTimer(120);
    } catch (err) {
      console.error("❌ Failed to process user pick:", err);
    }
  };

  return {
    simulateCpuPick,
    handleUserPick,
  };
}
