'use client';

import DraftSlot from '../draft-board/DraftSlot';
import type { DraftPick } from '@/components/mock-draft/MockDraft';

type DraftBoardProps = {
  draftStarted: boolean;
  draftGrid: DraftPick[][];
  claimedTeamIndex: number | null;
  onClaimTeam: (teamIndex: number) => void;
  numTeams: number;
  numRounds: number;
};

const DraftBoard = ({
  draftStarted,
  draftGrid,
  claimedTeamIndex,
  onClaimTeam,
  numTeams,
  numRounds,
}: DraftBoardProps) => {
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
                ? 'bg-green-600 text-white'
                : 'bg-[#5907f1] hover:bg-[#ec5100] text-white'
            } ${draftStarted ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {claimedTeamIndex === teamIndex ? 'CLAIMED' : 'CLAIM'}
          </button>
        ))}
      </div>

      {/* 🧠 Draft Grid — NO logic here */}
      {draftGrid.map((round, roundIndex) => {
        const row = roundIndex % 2 === 0 ? round : [...round].reverse(); 
        return (
          <div key={`round-${roundIndex}`} className="grid grid-cols-12 gap-0.5 mb-0.5">
            {row.map((pick, pickIndex) => {
              const pickLabel = `${pick.round + 1}.${pick.pickInRound + 1}`;
              return (
                <DraftSlot
                  key={pickLabel}
                  pickNumber={pickLabel}
                  player={pick.draftedPlayer}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default DraftBoard;
