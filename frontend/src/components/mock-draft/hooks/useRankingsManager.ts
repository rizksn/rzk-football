import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/utils/config";
import { Player } from "@/types/core/player";
import { DraftConfig } from "@/types/draft/config";
import { User } from "firebase/auth";
import type { DraftPick } from "@/components/mock-draft/MockDraft";

export function useRankingsManager(
  user: User | null,
  draftConfig: DraftConfig,
  adpPlayers: Player[],
  draftPlan: DraftPick[]
) {
  const [rankedPlayers, setRankedPlayers] = useState<Player[]>(adpPlayers);

  useEffect(() => {
    setRankedPlayers(adpPlayers);
  }, [adpPlayers]);

  const loadRankings = useCallback(async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch(
        `${API_BASE_URL}/api/rankings/load?format_key=${draftConfig.adpFormatKey}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to load");

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
  }, [user, draftConfig.adpFormatKey, adpPlayers]); // 💡 only redefined if one of these changes

  const saveRankings = async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      await fetch(`${API_BASE_URL}/api/rankings/save`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adp_format_key: draftConfig.adpFormatKey,
          player_ids: rankedPlayers.map((p) => p.player_id),
        }),
      });
      toast.success("✅ Rankings saved!");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to save rankings");
    }
  };

  const resetRankings = () => {
    setRankedPlayers([...adpPlayers]);
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

  return {
    rankedPlayers,
    setRankedPlayers,
    rankingPlayers,
    loadRankings,
    saveRankings,
    resetRankings,
    downloadRankings,
  };
}
