'use client';

import DraftSlot from '../draft-board/DraftSlot';
import { Player } from '@/types';

type DraftBoardProps = {
  draftStarted: boolean;
  draftGrid: (Player | null)[][];
  claimedTeamIndex: number | null;
  onClaimTeam: (teamIndex: number) => void;
};

const DraftBoard = ({
  draftStarted,
  draftGrid,
  claimedTeamIndex,
  onClaimTeam,
}: DraftBoardProps) => {
  const numRounds = draftGrid.length;
  const numTeams = draftGrid[0]?.length || 0;

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
                : 'bg-[#f13607] hover:bg-blue-700 text-white'
            } ${draftStarted ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {claimedTeamIndex === teamIndex ? 'CLAIMED' : 'CLAIM'}
          </button>
        ))}
      </div>

      {/* Draft Grid */}
      <div className="grid grid-cols-12 gap-0.5">
        {draftGrid.map((round, roundIndex) =>
          round.map((player, teamIndex) => {
            const actualTeamIndex = roundIndex % 2 === 0 ? teamIndex : numTeams - 1 - teamIndex;
            const pickLabel = `${roundIndex + 1}.${actualTeamIndex + 1}`;

            return (
              <DraftSlot
                key={pickLabel}
                pickNumber={pickLabel}
                player={player || undefined}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default DraftBoard;
