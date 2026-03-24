"use client";

import { useMemo } from "react";
import { ChevronsLeft, ChevronsRight, ListPlus } from "lucide-react";
import classNames from "classnames";

import type { LeftPanelProps } from "./lower-panel.types";

const POSITIONS = ["All", "QB", "RB", "WR", "TE", "FLEX", "K"] as const;

const LeftPanel = ({
  players,
  playerTable,
  canDraft,
  onDraftPlayer,
  onAddToQueue,
  onSetSearchText,
  onSetPositionFilter,
  onSetLeftDisplayPlayer,
  onSetRightDisplayPlayer,
}: LeftPanelProps) => {
  const filteredPlayers = useMemo(() => {
    const search = playerTable.searchText.trim().toLowerCase();

    let next = players.filter((player) => {
      const fullName = player.fullName ?? "";
      const position = player.position ?? "";

      const matchesSearch =
        search.length === 0 || fullName.toLowerCase().includes(search);

      const matchesPosition =
        !playerTable.positionFilter ||
        playerTable.positionFilter === "All" ||
        (playerTable.positionFilter === "FLEX"
          ? ["WR", "RB", "TE"].includes(position)
          : position === playerTable.positionFilter);

      return matchesSearch && matchesPosition;
    });

    next = [...next].sort((a, b) => {
      const { sortKey, sortDirection } = playerTable;
      const direction = sortDirection === "asc" ? 1 : -1;

      const aRank = a.rank ?? Number.POSITIVE_INFINITY;
      const bRank = b.rank ?? Number.POSITIVE_INFINITY;

      const aAdp = Number(a.adp ?? Number.POSITIVE_INFINITY);
      const bAdp = Number(b.adp ?? Number.POSITIVE_INFINITY);

      const aName = a.fullName ?? "";
      const bName = b.fullName ?? "";

      const aPosition = a.position ?? "";
      const bPosition = b.position ?? "";

      const aTeam = a.team ?? "";
      const bTeam = b.team ?? "";

      switch (sortKey) {
        case "rank":
          return (aRank - bRank) * direction;
        case "adp":
          return (aAdp - bAdp) * direction;
        case "name":
          return aName.localeCompare(bName) * direction;
        case "position":
          return aPosition.localeCompare(bPosition) * direction;
        case "team":
          return aTeam.localeCompare(bTeam) * direction;
        default:
          return 0;
      }
    });

    return next;
  }, [players, playerTable]);

  return (
    <div className="relative flex h-full w-full flex-col overflow-visible rounded-md bg-[rgba(92,149,247,0.17)]">
      <div className="relative flex h-full w-full flex-col overflow-visible rounded-md bg-[rgba(92,149,247,0.17)]">
        <div className="relative flex h-[36px] w-full items-center px-3 py-2">
          <input
            type="text"
            placeholder="Search players..."
            value={playerTable.searchText}
            onChange={(e) => onSetSearchText(e.target.value)}
            className="z-10 w-[160px] rounded bg-slate-800 px-2 py-1 text-xs text-white"
          />

          <div className="absolute left-1/2 z-0 flex -translate-x-1/2 gap-1">
            {POSITIONS.map((pos) => (
              <button
                key={pos}
                onClick={() => onSetPositionFilter(pos === "All" ? "All" : pos)}
                className={`rounded px-2 py-1 text-xs ${
                  playerTable.positionFilter === pos ||
                  (!playerTable.positionFilter && pos === "All")
                    ? "bg-cyan-700 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {pos}
              </button>
            ))}
          </div>
        </div>

        <div className="h-full w-full overflow-y-auto border-slate-800">
          <table className="w-full text-xs text-white">
            <thead className="sticky top-0 z-20">
              <tr>
                <th className="px-3 py-2 text-left">DRAFT</th>
                <th className="px-1 py-2 text-left">RANK</th>
                <th className="px-2 py-1 text-left">NAME</th>
                <th className="px-2 py-1 text-left">POS</th>
                <th className="px-2 py-1 text-left">TEAM</th>
                <th className="px-2 py-1 text-left">L</th>
                <th className="px-2 py-1 text-left">R</th>
                <th className="px-2 py-1 text-right">ADD</th>
              </tr>
            </thead>

            <tbody>
              {filteredPlayers.map((player, index) => (
                <tr
                  key={player.playerId}
                  className={classNames(
                    "border-b border-slate-700 transition-all duration-150",
                    index % 2 === 0
                      ? "bg-[rgba(28,29,46,0.23)]"
                      : "bg-[rgba(28,29,46,0.05)]",
                  )}
                >
                  <td className="px-2 py-0">
                    <button
                      disabled={!canDraft}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (canDraft) {
                          onDraftPlayer(player.playerId);
                        }
                      }}
                      className={`rounded px-2 py-0.5 text-[9px] font-bold transition ${
                        canDraft
                          ? "cursor-pointer bg-[#181c28] text-[#ff2600] hover:bg-[#617fb9]"
                          : "cursor-not-allowed bg-slate-700 text-slate-400"
                      }`}
                    >
                      DRAFT
                    </button>
                  </td>

                  <td className="px-2 py-1.5 text-slate-300">
                    {player.rank ?? "--"}
                  </td>
                  <td className="px-2 py-1.5 text-slate-300">
                    {player.fullName ?? "--"}
                  </td>
                  <td className="px-2 py-1.5 text-slate-300">
                    {player.position ?? "--"}
                  </td>
                  <td className="px-2 py-1.5 text-slate-300">
                    {player.team ?? "--"}
                  </td>

                  <td className="px-0 py-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSetLeftDisplayPlayer(player.playerId);
                      }}
                      title="Left"
                      className="rounded bg-cyan-900 p-[2px] text-white hover:bg-cyan-700"
                    >
                      <ChevronsLeft size={14} />
                    </button>
                  </td>

                  <td className="px-0 py-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSetRightDisplayPlayer(player.playerId);
                      }}
                      title="Right"
                      className="rounded bg-cyan-900 p-[2px] text-white hover:bg-cyan-700"
                    >
                      <ChevronsRight size={14} />
                    </button>
                  </td>

                  <td className="px-3 py-1 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToQueue(player.playerId);
                      }}
                      aria-label={`Add ${player.fullName ?? "player"} to queue`}
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
