"use client";

import { useMemo, useState } from "react";

import DraftSlot from "./DraftSlot";
import type { DraftPick } from "@/features/mock-draft/session/session.models";

type DraftBoardProps = {
  draftPlan: DraftPick[];
  numTeams: number;
  totalRounds: number;
  currentPickIndex: number | null;
};

const DraftBoard = ({
  draftPlan,
  numTeams,
  totalRounds,
  currentPickIndex,
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
