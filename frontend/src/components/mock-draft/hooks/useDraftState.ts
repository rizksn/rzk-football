"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { Player } from "@/types/core/player";
import { API_BASE_URL } from "@/utils/config";
import type { DraftConfig, DraftRosterSettings } from "@/types/draft/config";
import type { DraftPick } from "../MockDraft";
import type { User } from "firebase/auth";
import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { initializeDraftPlan } from "@/utils/initializeDraftPlan";

/**
 * Encapsulates draft plan, player data, fetch logic, and derived views.
 * Used safely in MockDraft.tsx without changing behavior.
 */
export function useDraftState(
  draftConfig: DraftConfig,
  rosterSettings: DraftRosterSettings,
  user: User | null,
  isPaidUser: boolean,
  keeperState: {
    mode: "standard" | "keeper";
    keeperSetId: string | null;
  }
) {
  const [draftPlan, setDraftPlan] = useState<DraftPick[]>([]);
  const [scoredPlayers, setScoredPlayers] = useState<Player[]>([]);
  const [adpPlayers, setAdpPlayers] = useState<Player[]>([]);
  const [rankedPlayers, setRankedPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    async function fetchInitialData() {
      try {
        setLoading(true);
        const isDefaultFormat =
          draftConfig.adpFormatKey === "dynasty_1qb_1_ppr_sleeper";
        const url = `${API_BASE_URL}/api/draft-players?format=${draftConfig.adpFormatKey}`;
        const res = isDefaultFormat
          ? await fetch(url, { cache: "no-store", signal: ctrl.signal })
          : await fetchWithAuth(url, {
              cache: "no-store",
              signal: ctrl.signal,
            });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData?.detail || "Failed to fetch draft players");
        }
        const json = await res.json();
        if (!Array.isArray(json.adp) || !Array.isArray(json.scored)) {
          throw new Error("Expected adp and scored arrays from backend");
        }
        setAdpPlayers(json.adp);
        setScoredPlayers(json.scored);
        setRankedPlayers([...json.adp].sort((a, b) => a.rank - b.rank));
        setDraftPlan(
          initializeDraftPlan(draftConfig.num_teams, rosterSettings.totalRounds)
        );
      } catch (err) {
        if ((err as any).name !== "AbortError") {
          console.error("❌ Failed to fetch draft data:", err);
          toast.error("Failed to load draft data");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchInitialData();
    return () => ctrl.abort();
  }, [
    draftConfig.adpFormatKey,
    draftConfig.num_teams,
    rosterSettings.totalRounds,
  ]);

  const loadRankings = useCallback(async () => {
    if (!user) return;

    if (!isPaidUser) {
      toast.error(
        "🔒 Premium required to load saved rankings. Please upgrade."
      );
      return;
    }

    try {
      let savedRankings: string[] = [];

      if (keeperState.mode === "keeper" && keeperState.keeperSetId) {
        const res = await fetchWithAuth(
          `${API_BASE_URL}/api/rankings/load/keeper/${keeperState.keeperSetId}`
        );
        const data = await res.json();
        if (!res.ok)
          throw new Error(data?.message || "Failed to load keeper rankings");
        if (!Array.isArray(data.rankings))
          throw new Error("Invalid rankings format");

        // data.rankings = [{ player_id, rank }]
        const sorted = data.rankings
          .slice()
          .sort((a: any, b: any) => a.rank - b.rank)
          .map((r: any) => r.player_id);

        savedRankings = sorted;
      } else {
        const res = await fetchWithAuth(
          `${API_BASE_URL}/api/rankings/load?format_key=${draftConfig.adpFormatKey}`
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Failed to load");
        if (!Array.isArray(data.rankings))
          throw new Error("Invalid rankings format");

        savedRankings = data.rankings || [];
      }

      const uniqueIds = Array.from(new Set(savedRankings));
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
  }, [
    user,
    isPaidUser,
    draftConfig.adpFormatKey,
    adpPlayers,
    keeperState.mode,
    keeperState.keeperSetId,
  ]);

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

  const saveKeeperRankings = async (keeperSetId: string) => {
    if (!user) return;
    if (!isPaidUser) {
      toast.error("🔒 Premium required to save keeper rankings.");
      return;
    }

    try {
      const payload = {
        adp_format_key: draftConfig.adpFormatKey, // always required by model
        keeper_set_id: keeperSetId,
        player_ids: rankedPlayers.map((p) => p.player_id),
      };

      const res = await fetchWithAuth(`${API_BASE_URL}/api/rankings/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save keeper rankings");
      toast.success("✅ Keeper rankings saved!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to save keeper rankings");
    }
  };

  const resetRankings = () => {
    const sorted = [...adpPlayers].sort((a, b) => a.rank - b.rank);
    setRankedPlayers(sorted);
    toast.success("✅ Rankings reset to ADP (not saved)");
  };

  const esc = (s: string) => `"${String(s).replace(/"/g, '""')}"`;
  const downloadRankings = () => {
    const csv = rankedPlayers
      .map((p, i) => `${i + 1},${esc(p.full_name)},${p.position},${p.team}`)
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

  useEffect(() => {
    if (!user || !isPaidUser) return;
    if (adpPlayers.length === 0) return;
    void loadRankings();
  }, [
    user,
    isPaidUser,
    adpPlayers.length,
    keeperState.mode,
    keeperState.keeperSetId,
    draftConfig.adpFormatKey,
    loadRankings,
  ]);

  const draftedIdsSet = useMemo(
    () =>
      new Set(
        draftPlan
          .map((p) => p.draftedPlayer?.player_id)
          .filter(Boolean) as string[]
      ),
    [draftPlan]
  );

  const rankingPlayers = useMemo(
    () => rankedPlayers.filter((p) => !draftedIdsSet.has(p.player_id)),
    [rankedPlayers, draftedIdsSet]
  );

  const draftedPlayers = useMemo(
    () =>
      draftPlan
        .filter((p) => p.draftedPlayer)
        .map((p) => p.draftedPlayer!) as Player[],
    [draftPlan]
  );

  const availablePlayers = useMemo(
    () =>
      adpPlayers
        .filter((p) => !draftedIdsSet.has(p.player_id))
        .sort((a, b) => a.rank - b.rank),
    [adpPlayers, draftedIdsSet]
  );

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
    saveKeeperRankings,
    resetRankings,
    downloadRankings,
  };
}
