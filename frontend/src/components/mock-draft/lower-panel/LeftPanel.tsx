"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { Player } from "@/types/core/player";
import { ChevronsLeft, ChevronsRight, ListPlus } from "lucide-react";
import classNames from "classnames";

const POSITIONS = ["All", "QB", "RB", "WR", "TE", "FLEX", "K"] as const;

type LeftPanelProps = {
  players: Player[];
  onAddToQueue: (player: Player) => void;
  onDraftClick: (player: Player) => void;
  isUserTurn: boolean;
  onDisplayLeft: (player: Player) => void;
  onDisplayRight: (player: Player) => void;
  assignModeIndex?: number | null;
  onManualAssignPlayer?: (player: Player) => void;
  onExitAssignMode: () => void;
};

const LeftPanel = ({
  players,
  onAddToQueue,
  onDraftClick,
  isUserTurn,
  onDisplayLeft,
  onDisplayRight,
  assignModeIndex,
  onManualAssignPlayer,
  onExitAssignMode, // NEW prop
}: LeftPanelProps & { onExitAssignMode: () => void }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState<"All" | string>("All");
  const panelRef = useRef<HTMLDivElement>(null);

  const filteredPlayers = useMemo(() => {
    return players.filter((p) => {
      const matchesSearch = p.full_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesPosition =
        positionFilter === "All" ||
        (positionFilter === "FLEX"
          ? ["WR", "RB", "TE"].includes(p.position)
          : p.position === positionFilter);

      return matchesSearch && matchesPosition;
    });
  }, [players, searchTerm, positionFilter]);

  function isDescendantOrSelf(
    parent: Node | null,
    child: Node | null
  ): boolean {
    if (!parent || !child) return false;
    let node: Node | null = child;
    while (node) {
      if (node === parent) return true;
      node = node.parentNode;
    }
    return false;
  }

  function handleClickOutside(event: MouseEvent) {
    if (
      assignModeIndex !== null &&
      panelRef.current &&
      !isDescendantOrSelf(panelRef.current, event.target as Node)
    ) {
      onExitAssignMode();
    }
  }

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [assignModeIndex, onExitAssignMode]);

  return (
    <div
      ref={panelRef}
      className="relative flex flex-col h-full w-full overflow-visible bg-[rgba(92,149,247,0.17)] rounded-md"
    >
      <div className="relative flex flex-col h-full w-full overflow-visible bg-[rgba(92,149,247,0.17)] rounded-md">
        {/* Row: Search left, filters centered absolutely */}
        <div className="relative w-full px-3 py-2 flex items-center h-[36px]">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search players..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-800 text-white text-xs rounded px-2 py-1 w-[160px] z-10"
          />

          {/* Centered Filters */}
          <div className="absolute left-1/2 -translate-x-1/2 flex gap-1 z-0">
            {POSITIONS.map((pos) => (
              <button
                key={pos}
                onClick={() => setPositionFilter(pos)}
                className={`px-2 py-1 text-xs rounded ${
                  positionFilter === pos
                    ? "bg-cyan-700 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {pos}
              </button>
            ))}
          </div>
        </div>

        {/* Player Table */}
        <div className="overflow-y-auto h-full w-full border-slate-800">
          <table className="w-full text-xs text-white">
            <thead className="sticky top-0 z-20">
              <tr>
                <th className="text-left px-3 py-2">DRAFT</th>
                <th className="text-left px-1 py-2">RANK</th>
                <th className="text-left px-2 py-1">NAME</th>
                <th className="text-left px-2 py-1">POS</th>
                <th className="text-left px-2 py-1">TEAM</th>
                <th className="text-left px-2 py-1">L</th>
                <th className="text-left px-2 py-1">R</th>
                <th className="text-right px-2 py-1">ADD</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlayers.map((p, index) => (
                <tr
                  key={`${p.full_name}-${p.team}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (assignModeIndex !== null && onManualAssignPlayer) {
                      onManualAssignPlayer(p);
                    }
                  }}
                  className={classNames(
                    "border-b border-slate-700 transition-all duration-150",
                    index % 2 === 0
                      ? "bg-[rgba(28,29,46,0.23)]"
                      : "bg-[rgba(28,29,46,0.05)]",
                    assignModeIndex !== null &&
                      "border border-cyan-400 animate-pulse-border cursor-copy"
                  )}
                  style={{
                    animationDelay:
                      assignModeIndex !== null
                        ? `${(index % 6) * 100}ms`
                        : undefined,
                  }}
                >
                  <td className="px-2 py-0">
                    <button
                      disabled={!isUserTurn}
                      onClick={() => isUserTurn && onDraftClick(p)}
                      className={`text-[9px] font-bold px-2 py-0.5 rounded transition ${
                        isUserTurn
                          ? "bg-[#181c28] hover:bg-[#617fb9] text-[#ff2600] cursor-pointer"
                          : "bg-slate-700 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      DRAFT
                    </button>
                  </td>
                  <td className="px-2 py-1.5 text-slate-300">{p.rank}</td>
                  <td className="px-2 py-1.5 text-slate-300">{p.full_name}</td>
                  <td className="px-2 py-1.5 text-slate-300">{p.position}</td>
                  <td className="px-2 py-1.5 text-slate-300">{p.team}</td>
                  <td className="px-1 py-1">
                    <button
                      onClick={() => onDisplayLeft(p)}
                      title="Left"
                      className="p-[2px] text-white bg-cyan-900 hover:bg-cyan-700 rounded"
                    >
                      <ChevronsLeft size={14} />
                    </button>
                  </td>
                  <td className="px-1 py-1">
                    <button
                      onClick={() => onDisplayRight(p)}
                      title="Right"
                      className="p-[2px] text-white bg-cyan-900 hover:bg-cyan-700 rounded"
                    >
                      <ChevronsRight size={14} />
                    </button>
                  </td>
                  <td className="px-2 py-1 text-right">
                    <button
                      onClick={() => onAddToQueue(p)}
                      aria-label={`Add ${p.full_name} to queue`}
                      className="text-green-400 hover:text-green-300"
                    >
                      <ListPlus size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;
