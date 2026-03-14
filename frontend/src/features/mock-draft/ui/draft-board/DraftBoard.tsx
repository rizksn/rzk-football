"use client";

import { useState } from "react";
import DraftSlot from "./DraftSlot";
import type { DraftPick } from "@/features/mock-draft/MockDraft";

type DraftBoardProps = {
  draftStarted: boolean;
  draftGrid: DraftPick[][];
  claimedTeamIndex: number | null;
  onClaimTeam: (teamIndex: number) => void;
  numTeams: number;
  numRounds: number;
  assignModeIndex: number | null;
  setAssignModeIndex: (index: number | null) => void;
};

const DraftBoard = ({
  draftStarted,
  draftGrid,
  claimedTeamIndex,
  onClaimTeam,
  numTeams,
  numRounds,
  assignModeIndex,
  setAssignModeIndex,
}: DraftBoardProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="w-full px-[2vw] py-4">
      {/* Header row with claim buttons */}
      <div className="grid grid-cols-12 gap-0.5 mb-2">
        {Array.from({ length: numTeams }).map((_, teamIndex) => (
          <button
            key={`claim-${teamIndex}`}
            disabled={draftStarted}
            onClick={() => onClaimTeam(teamIndex)}
            className={`text-[10px] py-0 px-2 rounded-md font-bold tracking-wide transition-all ${
              claimedTeamIndex === teamIndex
                ? "bg-[#0bf1074e] text-black"
                : "bg-[#07f1dd] hover:bg-[#ec5100] text-black"
            } ${draftStarted ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {claimedTeamIndex === teamIndex ? "CLAIMED" : "CLAIM"}
          </button>
        ))}
      </div>

      {/* Draft grid */}
      {draftGrid.map((round, roundIndex) => {
        const row = roundIndex % 2 === 0 ? round : [...round].reverse();
        return (
          <div
            key={`round-${roundIndex}`}
            className="grid grid-cols-12 gap-0.5 mb-0.5"
          >
            {row.map((pick) => {
              const flatIndex = pick.pickIndex;
              const pickLabel = `${pick.round + 1}.${pick.pickInRound + 1}`;
              const isHovered = hoveredIndex === flatIndex;
              const isAssigning = assignModeIndex === flatIndex;

              return (
                <div
                  key={pickLabel}
                  onMouseEnter={() => setHoveredIndex(flatIndex)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <DraftSlot
                    pickNumber={pickLabel}
                    player={pick.draftedPlayer}
                    isHovered={isHovered}
                    isAssigning={isAssigning}
                    onClick={() =>
                      setAssignModeIndex(
                        assignModeIndex === flatIndex ? null : flatIndex,
                      )
                    }
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default DraftBoard;
