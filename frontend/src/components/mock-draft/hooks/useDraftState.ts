"use client";

import { useEffect, useMemo, useState } from "react";
import { Player } from "@/types/core/player";
import { API_BASE_URL } from "@/utils/config";
import { getSnakedTeamIndex, NUM_TEAMS } from "@/utils/constants";
import type { DraftConfig, DraftRosterSettings } from "@/types/draft/config";
import type { DraftPick } from "../MockDraft";

/**
 * Encapsulates draft plan, player data, fetch logic, and derived views.
 * Used safely in MockDraft.tsx without changing behavior.
 */
export function useDraftState(
  draftConfig: DraftConfig,
  rosterSettings: DraftRosterSettings,
  userDraftSlot: number | null,
  savedRankings: Player[] | null
) {
  const [draftPlan, setDraftPlan] = useState<DraftPick[]>([]);
  const [scoredPlayers, setScoredPlayers] = useState<Player[]>([]);
  const [adpPlayers, setAdpPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchInitialData() {
      try {
        setLoading(true);
        const res = await fetch(
          `${API_BASE_URL}/api/draft-players?format=${draftConfig.adpFormatKey}`
        );
        const json = await res.json();

        if (!Array.isArray(json.adp) || !Array.isArray(json.scored)) {
          throw new Error("Expected adp and scored arrays from backend");
        }

        setAdpPlayers(json.adp);
        setScoredPlayers(json.scored);

        const totalPicks = rosterSettings.totalRounds * NUM_TEAMS;
        const newDraftPlan: DraftPick[] = Array.from(
          { length: totalPicks },
          (_, i) => {
            const round = Math.floor(i / NUM_TEAMS);
            const pickInRound = i % NUM_TEAMS;
            const teamIndex = getSnakedTeamIndex(round, pickInRound);
            return { pickIndex: i, round, pickInRound, teamIndex };
          }
        );

        setDraftPlan(newDraftPlan);
      } catch (err) {
        console.error("❌ Failed to fetch draft data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchInitialData();
  }, [draftConfig.adpFormatKey, rosterSettings.totalRounds]);

  const draftedPlayers = useMemo(
    () => draftPlan.filter((p) => p.draftedPlayer).map((p) => p.draftedPlayer!),
    [draftPlan]
  );

  const availablePlayers = useMemo(() => {
    const draftedIds = draftPlan
      .map((pick) => pick.draftedPlayer?.player_id)
      .filter(Boolean);

    return adpPlayers
      .filter((p) => !draftedIds.includes(p.player_id))
      .sort((a, b) => a.rank - b.rank);
  }, [adpPlayers, draftPlan]);

  const userRoster = useMemo(() => {
    if (userDraftSlot == null) return [];
    return draftPlan
      .filter((p) => p.teamIndex === userDraftSlot && p.draftedPlayer)
      .map((p) => p.draftedPlayer!);
  }, [draftPlan, userDraftSlot]);

  return {
    draftPlan,
    setDraftPlan,
    scoredPlayers,
    adpPlayers,
    loading,
    draftedPlayers,
    availablePlayers,
    userRoster,
  };
}
