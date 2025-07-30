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

import { Save, Download, FolderOutput } from "lucide-react";

type RightPanelProps = {
  queuedPlayers: Player[];
  userRoster: Player[];
  rosterSettings: DraftRosterSettings;
  onRemoveFromQueue: (playerId: string) => void;
  rankingPlayers: Player[];
};

const RightPanel = ({
  queuedPlayers,
  userRoster,
  rosterSettings,
  onRemoveFromQueue,
  rankingPlayers,
}: RightPanelProps) => {
  const [queueOrder, setQueueOrder] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"queue" | "rankings">("queue");
  const [rankedPlayers, setRankedPlayers] = useState<Player[]>(rankingPlayers);

  // Sync rankedPlayers when rankingPlayers prop changes
  useEffect(() => {
    setRankedPlayers(rankingPlayers);
  }, [rankingPlayers]);

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

  // const handleSaveRankings = async () => {
  //   if (!user) return;

  //   const rankedIds = rankedPlayers.map((p) => p.player_id);
  //   const payload = {
  //     user_id: user.uid,
  //     adp_format_key: draftConfig.adpFormatKey,
  //     rankings: rankedIds,
  //   };

  //   try {
  //     const res = await fetch(`${API_BASE_URL}/api/rankings/save`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${await user.getIdToken()}`,
  //       },
  //       body: JSON.stringify(payload),
  //     });

  //     if (res.ok) {
  //       toast.success("Rankings saved!");
  //     } else {
  //       toast.error("Failed to save rankings.");
  //     }
  //   } catch (err) {
  //     console.error("Save rankings error:", err);
  //     toast.error("Unexpected error saving rankings.");
  //   }
  // };

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
                onClick={() => {
                  console.log("📂 Import rankings into queue");
                  setQueueOrder(rankedPlayers.map((p) => p.player_id));
                }}
                className="bg-slate-700 hover:bg-slate-600 text-slate-300 p-2 rounded"
              >
                <FolderOutput size={16} />
              </button>
            )}

            {activeTab === "rankings" && (
              <>
                <button
                  onClick={() => {
                    console.log("⬇️ Download rankings clicked");
                    // TODO: Implement download logic
                  }}
                  className="bg-slate-700 hover:bg-slate-600 text-slate-300 p-2 rounded"
                >
                  <Download size={16} />
                </button>

                <button
                  onClick={() => {
                    console.log("💾 Save rankings clicked");
                    // TODO: POST current rankings
                  }}
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
