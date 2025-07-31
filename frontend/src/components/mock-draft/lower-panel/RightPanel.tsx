"use client";

import { useState, useEffect } from "react";
import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

import { Player } from "@/types/core/player";
import Queue from "./Queue";
import Roster from "./Roster";
import Rankings from "./Rankings";
import { User } from "firebase/auth";
import { DraftRosterSettings, DraftConfig } from "@/types/draft/config";
import { toast } from "sonner";
import { API_BASE_URL } from "@/utils/config";

import { Save, Download, FolderOutput } from "lucide-react";

type RightPanelProps = {
  queuedPlayers: Player[];
  userRoster: Player[];
  rosterSettings: DraftRosterSettings;
  onRemoveFromQueue: (playerId: string) => void;
  rankingPlayers: Player[];
  user: User | null;
  draftConfig: DraftConfig;
  adpPlayers: Player[];
};

const RightPanel = ({
  queuedPlayers,
  userRoster,
  rosterSettings,
  onRemoveFromQueue,
  rankingPlayers,
  user,
  draftConfig,
  adpPlayers,
}: RightPanelProps) => {
  const [queueOrder, setQueueOrder] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"queue" | "rankings">("queue");
  const [rankedPlayers, setRankedPlayers] = useState<Player[]>(rankingPlayers);

  // Sync rankedPlayers when rankingPlayers prop changes
  useEffect(() => {
    setRankedPlayers(rankingPlayers);
  }, [rankingPlayers]);

  useEffect(() => {
    if (user && activeTab === "rankings") {
      handleLoadRankings();
    }
  }, [user, activeTab]);

  // Sync queue order
  useEffect(() => {
    setQueueOrder(queuedPlayers.map((p) => p.player_id));
  }, [queuedPlayers]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setQueueOrder((prev) => {
      const oldIndex = prev.indexOf(active.id as string);
      const newIndex = prev.indexOf(over.id as string);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const handleSaveRankings = async () => {
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

  const handleLoadRankings = async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const res = await fetch(
        `${API_BASE_URL}/api/rankings/load?format_key=${draftConfig.adpFormatKey}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to load");

      const savedIds: string[] = data.rankings || [];
      const uniqueIds = [...new Set(savedIds)];
      const savedPlayers = uniqueIds
        .map((id) => adpPlayers.find((p) => p.player_id === id))
        .filter(Boolean) as Player[];

      if (savedPlayers.length === 0) {
        toast.success("✅ No saved rankings found – using default ADP");
        return; // let `useMemo()` handle fallback
      }

      setRankedPlayers(savedPlayers);
      toast.success("✅ Rankings restored");
    } catch (err) {
      toast.error("❌ Failed to load saved rankings");
      console.error(err);
    }
  };

  const handleDownloadRankings = () => {
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

  return (
    <div className="flex h-full w-full bg-[rgba(28,29,46,0.58)] min-h-0">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(rgba(0,255,255,0.08)_1px,transparent_1px)] bg-[size:20px_20px] opacity-40 pointer-events-none" />

      {/* Player Queue */}
      <div className="w-1/2 border-r border-slate-700 px-3 flex flex-col h-full min-h-0">
        <div className="flex justify-between items-center mb-2">
          {/* Left: Queue button */}
          <button
            className={`text-xs px-5 font-semibold rounded uppercase ${
              activeTab === "queue"
                ? "bg-cyan-600 text-white"
                : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
            onClick={() => setActiveTab("queue")}
          >
            Queue
          </button>

          {/* Right: Icons + Rankings button */}
          <div className="flex items-center gap-2">
            {activeTab === "queue" && (
              <button
                onClick={handleLoadRankings}
                className="bg-slate-700 hover:bg-slate-600 text-slate-300 p-2 rounded"
              >
                <FolderOutput size={16} />
              </button>
            )}

            {activeTab === "rankings" && (
              <>
                <button
                  onClick={handleDownloadRankings}
                  className="bg-slate-700 hover:bg-slate-600 text-slate-300 p-2 rounded"
                >
                  <Download size={16} />
                </button>

                <button
                  onClick={handleSaveRankings}
                  className="bg-slate-700 hover:bg-slate-600 text-slate-300 p-2 rounded"
                >
                  <Save size={16} />
                </button>
              </>
            )}

            <button
              className={`text-xs px-5 font-semibold rounded uppercase ${
                activeTab === "rankings"
                  ? "bg-cyan-600 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
              onClick={() => setActiveTab("rankings")}
            >
              Rankings
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === "queue" ? (
            <Queue
              queuedPlayers={queuedPlayers}
              queueOrder={queueOrder}
              onRemoveFromQueue={onRemoveFromQueue}
              onDragEnd={handleDragEnd}
            />
          ) : (
            <Rankings
              rankedPlayers={rankedPlayers}
              setRankedPlayers={setRankedPlayers}
            />
          )}
        </div>
      </div>

      {/* Roster */}
      <div className="w-1/2 pl-4 pr-2 flex flex-col h-full min-h-0">
        <h2 className="text-sm font-semibold text-[#fcf8f8] mb-2">ROSTER</h2>
        <div className="flex-1 min-h-0 overflow-y-auto">
          <Roster userRoster={userRoster} />
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
