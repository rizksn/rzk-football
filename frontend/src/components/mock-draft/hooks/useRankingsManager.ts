import { useState, useEffect } from "react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/utils/config";
import { Player } from "@/types/core/player";
import { DraftConfig } from "@/types/draft/config";
import { User } from "firebase/auth";

export function useRankingsManager(
  user: User | null,
  draftConfig: DraftConfig,
  adpPlayers: Player[]
) {
  const [rankedPlayers, setRankedPlayers] = useState<Player[]>(adpPlayers);

  useEffect(() => {
    setRankedPlayers(adpPlayers);
  }, [adpPlayers]);

  const loadRankings = async () => {
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
  };

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

  return {
    rankedPlayers,
    setRankedPlayers,
    loadRankings,
    saveRankings,
    resetRankings,
    downloadRankings,
  };
}
