"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { Player } from "@/types/core/player";
import { API_BASE_URL } from "@/utils/config";
import { getSnakedTeamIndex, NUM_TEAMS } from "@/utils/constants";
import type { DraftConfig, DraftRosterSettings } from "@/types/draft/config";
import type { DraftPick } from "../MockDraft";
import type { User } from "firebase/auth";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

/**
 * Encapsulates draft plan, player data, fetch logic, and derived views.
 * Used safely in MockDraft.tsx without changing behavior.
 */
export function useDraftState(
  draftConfig: DraftConfig,
  rosterSettings: DraftRosterSettings,
  user: User | null,
  isPaidUser: boolean
) {
  const [draftPlan, setDraftPlan] = useState<DraftPick[]>([]);
  const [scoredPlayers, setScoredPlayers] = useState<Player[]>([]);
  const [adpPlayers, setAdpPlayers] = useState<Player[]>([]);
  const [rankedPlayers, setRankedPlayers] = useState<Player[]>([]);
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
        setRankedPlayers(json.adp);

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

  useEffect(() => {
    const sortedByAdp = [...adpPlayers].sort((a, b) => a.rank - b.rank);
    setRankedPlayers(sortedByAdp);
  }, [adpPlayers]);

  const loadRankings = useCallback(async () => {
    if (!user) return;

    if (!isPaidUser) {
      toast.error(
        "🔒 Premium required to load saved rankings. Please upgrade."
      );
      return;
    }

    try {
      const res = await fetchWithAuth(
        `${API_BASE_URL}/api/rankings/load?format_key=${draftConfig.adpFormatKey}`
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.message || "Failed to load");
      }

      const data = await res.json();
      const savedIds: string[] = data.rankings || [];
      const uniqueIds = Array.from(new Set(savedIds));
      const savedPlayers = uniqueIds
        .map((id) => adpPlayers.find((p) => p.player_id === id))
        .filter(Boolean) as Player[];

      if (savedPlayers.length === 0) {
        toast.success("✅ No saved rankings – using ADP");
        return;
      }

      setRankedPlayers(savedPlayers);
      toast.success("✅ Rankings restored");
    } catch (err) {
      toast.error("❌ Failed to load rankings");
      console.error(err);
    }
  }, [user, isPaidUser, draftConfig.adpFormatKey, adpPlayers]);

  const saveRankings = async () => {
    if (!user) return;

    if (!isPaidUser) {
      toast.error("🔒 Premium required to save rankings. Please upgrade.");
      return;
    }

    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/api/rankings/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adp_format_key: draftConfig.adpFormatKey,
          player_ids: rankedPlayers.map((p) => p.player_id),
        }),
      });

      if (!res.ok) throw new Error("Failed to save rankings");

      toast.success("✅ Rankings saved!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to save rankings");
    }
  };

  const resetRankings = () => {
    const sorted = [...adpPlayers].sort((a, b) => a.rank - b.rank);
    setRankedPlayers(sorted);
    toast.success("✅ Rankings reset to ADP (not saved)");
  };

  const downloadRankings = () => {
    const csv = rankedPlayers
      .map((p, i) => `${i + 1},${p.full_name},${p.position},${p.team}`)
      .join("\n");
    const blob = new Blob([`Rank,Name,Position,Team\n${csv}`], {
      type: "text/csv",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "rankings.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const rankingPlayers = useMemo(() => {
    const draftedIds = draftPlan
      .map((p) => p.draftedPlayer?.player_id)
      .filter(Boolean);
    return rankedPlayers.filter((p) => !draftedIds.includes(p.player_id));
  }, [rankedPlayers, draftPlan]);

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

  return {
    draftPlan,
    setDraftPlan,
    scoredPlayers,
    adpPlayers,
    loading,
    draftedPlayers,
    availablePlayers,
    rankedPlayers,
    setRankedPlayers,
    rankingPlayers,
    loadRankings,
    saveRankings,
    resetRankings,
    downloadRankings,
  };
}
