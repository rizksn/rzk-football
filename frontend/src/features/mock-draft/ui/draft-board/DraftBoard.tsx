"use client";

import { useMemo, useState } from "react";

import DraftSlot from "./DraftSlot";
import type { DraftPick } from "@/features/mock-draft/session/session.models";

type DraftBoardProps = {
  draftPlan: DraftPick[];
  numTeams: number;
  totalRounds: number;
  currentPickIndex: number | null;
  claimedTeamIndex: number | null;
  onClaimTeam: (teamIndex: number | null) => void;
  draftStarted: boolean;
};

const DraftBoard = ({
  draftPlan,
  numTeams,
  totalRounds,
  currentPickIndex,
  claimedTeamIndex,
  onClaimTeam,
  draftStarted,
}: DraftBoardProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const picksByIndex = useMemo(() => {
    return new Map(draftPlan.map((pick) => [pick.pickIndex, pick]));
  }, [draftPlan]);

  const draftGrid = useMemo(() => {
    if (numTeams <= 0 || totalRounds <= 0) return [];

    const rows: Array<
      Array<{
        pickIndex: number;
        round: number;
        pickInRound: number;
        pick: DraftPick | undefined;
      }>
    > = [];

    for (let round = 0; round < totalRounds; round += 1) {
      const row = [];

      for (let pickInRound = 0; pickInRound < numTeams; pickInRound += 1) {
        const pickIndex = round * numTeams + pickInRound;

        row.push({
          pickIndex,
          round,
          pickInRound,
          pick: picksByIndex.get(pickIndex),
        });
      }

      rows.push(row);
    }

    return rows;
  }, [numTeams, totalRounds, picksByIndex]);

  return (
    <div className="w-full px-[2vw] py-4">
      {/* Header row with claim buttons */}
      <div
        className="mb-2 grid gap-0.5"
        style={{
          gridTemplateColumns: `repeat(${numTeams}, minmax(110px, 1fr))`,
        }}
      >
        {Array.from({ length: numTeams }, (_, teamIndex) => {
          const isClaimed = claimedTeamIndex === teamIndex;

          return (
            <button
              key={`claim-${teamIndex}`}
              type="button"
              disabled={draftStarted}
              onClick={() => onClaimTeam(isClaimed ? null : teamIndex)}
              className={`text-[10px] py-0 px-2 rounded-md font-bold tracking-wide transition-all ${
                isClaimed
                  ? "bg-[#0bf1074e] text-black"
                  : "bg-[#07f1dd] hover:bg-[#ec5100] text-black"
              } ${draftStarted ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isClaimed ? "CLAIMED" : "CLAIM"}
            </button>
          );
        })}
      </div>

      {draftGrid.map((round, roundIndex) => {
        const row = roundIndex % 2 === 0 ? round : [...round].reverse();

        return (
          <div
            key={`round-${roundIndex}`}
            className="mb-0.5 grid gap-0.5"
            style={{
              gridTemplateColumns: `repeat(${numTeams}, minmax(110px, 1fr))`,
            }}
          >
            {row.map(({ pickIndex, round, pickInRound, pick }) => {
              const pickLabel = `${round + 1}.${pickInRound + 1}`;
              const isHovered = hoveredIndex === pickIndex;
              const isCurrentPick = currentPickIndex === pickIndex;

              return (
                <div
                  key={pickIndex}
                  onMouseEnter={() => setHoveredIndex(pickIndex)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <DraftSlot
                    pickNumber={pickLabel}
                    player={pick?.draftedPlayer ?? null}
                    isHovered={isHovered}
                    isCurrentPick={isCurrentPick}
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
