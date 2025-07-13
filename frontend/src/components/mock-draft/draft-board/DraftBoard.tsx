'use client';

import DraftSlot from '../draft-board/DraftSlot';
import { Player } from '@/types/core/player';
import type { DraftPick } from '@/components/mock-draft/MockDraft';

type DraftBoardProps = {
  draftStarted: boolean;
  draftPlan: DraftPick[]; 
  claimedTeamIndex: number | null;
  onClaimTeam: (teamIndex: number) => void;
  numTeams: number;
  numRounds: number;
};

const DraftBoard = ({
  draftStarted,
  draftPlan,
  claimedTeamIndex,
  onClaimTeam,
  numTeams,
  numRounds,
}: DraftBoardProps) => {
  const totalPicks = draftPlan.length;
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

      {/* Draft Grid */}
      <div className="grid grid-cols-12 gap-0.5">
        {draftPlan.map((pick, pickIndex) => {
          const round = Math.floor(pickIndex / numTeams);
          const pickInRound = pickIndex % numTeams;

          // Handle snake logic
          const teamIndex =
            round % 2 === 0 ? pickInRound : numTeams - 1 - pickInRound;

          const pickLabel = `${round + 1}.${teamIndex + 1}`;

          return (
            <DraftSlot
              key={pickLabel}
              pickNumber={pickLabel}
              player={pick.draftedPlayer || undefined}
            />
          );
        })}
      </div>
    </div>
  );
};

export default DraftBoard;
