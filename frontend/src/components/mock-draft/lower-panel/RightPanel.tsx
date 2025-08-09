"use client";

import { useState, useMemo, useRef } from "react";
import { DragEndEvent } from "@dnd-kit/core";
import { toast } from "sonner";

import { Player } from "@/types/core/player";
import Queue from "./Queue";
import Roster from "./Roster";
import Rankings from "./Rankings";

import { Save, Download, FolderOutput, RotateCcw, SquareX } from "lucide-react";
import type { DraftRosterSettings } from "@/types/draft/config";
import type { DraftPick } from "@/components/mock-draft/MockDraft";

type RightPanelProps = {
  queuedPlayers: Player[];
  queueOrder: string[];
  handleQueueDragEnd: (event: DragEndEvent) => void;
  userRoster: Player[];
  rosterSettings: DraftRosterSettings;
  onRemoveFromQueue: (playerId: string) => void;
  rankingPlayers: Player[];
  setRankedPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  loadRankings: () => Promise<void>;
  onSaveRankings: () => Promise<void>;
  resetRankings: () => void;
  downloadRankings: () => void;
  isPaidUser: boolean;
  setQueueOrder: React.Dispatch<React.SetStateAction<string[]>>;
  showOnly?: "queue" | "roster";
  keeperState: {
    mode: "standard" | "keeper";
    keeperSetId: string | null;
  };
  draftStarted: boolean;
  draftPlan: DraftPick[];
  userDraftSlot: number | null;
  canEditRankings: boolean;
};

const RightPanel = ({
  queuedPlayers,
  queueOrder,
  handleQueueDragEnd,
  userRoster,
  rosterSettings,
  onRemoveFromQueue,
  rankingPlayers,
  setRankedPlayers,
  loadRankings,
  onSaveRankings,
  resetRankings,
  downloadRankings,
  isPaidUser,
  setQueueOrder,
  showOnly,
  keeperState,
  draftStarted,
  draftPlan,
  userDraftSlot,
  canEditRankings,
}: RightPanelProps) => {
  const [activeTab, setActiveTab] = useState<"queue" | "rankings">("queue");
  const [saving, setSaving] = useState(false);

  const hasLoaded = useRef(false);

  const disableSave = useMemo(() => {
    if (saving) return true;
    if (draftStarted) return true;
    if (!isPaidUser) return true;
    if (!canEditRankings) return true;
    return false;
  }, [saving, draftStarted, isPaidUser, canEditRankings]);

  return (
    <div className="flex h-full w-full bg-[rgba(28,29,46,0.58)] min-h-0">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(rgba(0,255,255,0.08)_1px,transparent_1px)] bg-[size:20px_20px] opacity-40 pointer-events-none" />

      {/* Player Queue & Rankings */}
      {showOnly !== "roster" && (
        <div
          className={`${
            showOnly === "queue" ? "w-full" : "w-1/2"
          } border-r border-slate-700 px-3 flex flex-col h-full min-h-0`}
        >
          <div className="flex items-center justify-between mb-2">
            {/* Left Side (Queue tab only) */}
            <div className="flex items-center gap-2">
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

              {activeTab === "queue" && (
                <button
                  onClick={() => {
                    if (queueOrder.length === 0) {
                      toast.info("Queue is already empty");
                      return;
                    }

                    setQueueOrder([]);
                    toast.success("✅ Queue cleared");
                  }}
                  className="bg-slate-700 hover:bg-slate-600 text-slate-300 p-2 rounded"
                  title="Clear Queue"
                >
                  <SquareX size={16} />
                </button>
              )}

              {activeTab === "queue" && (
                <button
                  onClick={() => {
                    if (!isPaidUser) {
                      toast.error(
                        "🔒 Upgrade to premium to migrate rankings to queue!"
                      );
                      return;
                    }

                    setQueueOrder(rankingPlayers.map((p) => p.player_id));
                    toast.success("✅ Rankings migrated to queue!");
                  }}
                  className="bg-slate-700 hover:bg-slate-600 text-slate-300 p-2 rounded"
                >
                  <FolderOutput size={16} />
                </button>
              )}
            </div>

            {/* Right Side (Rankings tab only) */}
            <div className="flex items-center gap-2">
              {activeTab === "rankings" && (
                <>
                  <button
                    title={
                      disableSave
                        ? draftStarted
                          ? "Draft started – rankings are locked"
                          : "Manual assignments detected – save or load a keeper set first"
                        : "Save your current rankings"
                    }
                    onClick={async () => {
                      if (disableSave) return;
                      setSaving(true);
                      try {
                        await onSaveRankings();
                        toast.success("✅ Rankings saved!");
                      } catch (err) {
                        console.error(err);
                        toast.error("❌ Failed to save rankings");
                      } finally {
                        setSaving(false);
                      }
                    }}
                    disabled={disableSave}
                    className={`bg-slate-700 hover:bg-slate-600 text-slate-300 p-2 rounded ${
                      disableSave ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    <Save size={16} />
                  </button>

                  <button
                    onClick={() => {
                      if (!isPaidUser) {
                        toast.error("🔒 Upgrade to premium to reset rankings!");
                        return;
                      }
                      resetRankings();
                    }}
                    className="bg-slate-700 hover:bg-slate-600 text-slate-300 p-2 rounded"
                  >
                    <RotateCcw size={16} />
                  </button>

                  <button
                    onClick={() => {
                      if (!isPaidUser) {
                        toast.error(
                          "🔒 Upgrade to premium to download rankings!"
                        );
                        return;
                      }
                      downloadRankings();
                    }}
                    className="bg-slate-700 hover:bg-slate-600 text-slate-300 p-2 rounded"
                  >
                    <Download size={16} />
                  </button>
                </>
              )}

              <button
                className={`text-xs px-5 font-semibold rounded uppercase ${
                  activeTab === "rankings"
                    ? "bg-cyan-600 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
                onClick={() => {
                  if (activeTab === "rankings") {
                    if (!isPaidUser) {
                      toast.error(
                        "🔒 Upgrade to premium to load saved rankings!"
                      );
                      return;
                    }
                    loadRankings();
                    toast.success("✅ Saved rankings reloaded");
                  } else {
                    setActiveTab("rankings");
                  }
                }}
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
                onDragEnd={handleQueueDragEnd}
              />
            ) : (
              <Rankings
                rankedPlayers={rankingPlayers}
                setRankedPlayers={setRankedPlayers}
                isPaidUser={isPaidUser}
                canEditRankings={canEditRankings}
              />
            )}
          </div>
        </div>
      )}

      {/* Roster */}
      {showOnly !== "queue" && (
        <div
          className={`${
            showOnly === "roster" ? "w-full" : "w-1/2"
          } pl-4 pr-2 flex flex-col h-full min-h-0`}
        >
          <h2 className="text-sm font-semibold text-[#fcf8f8] mt-2 mb-2">
            ROSTER
          </h2>
          <div className="flex-1 min-h-0 overflow-y-auto">
            <Roster userRoster={userRoster} rosterSettings={rosterSettings} />
          </div>
        </div>
      )}
    </div>
  );
};

export default RightPanel;
