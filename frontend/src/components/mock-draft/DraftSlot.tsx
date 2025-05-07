'use client';

import { Player } from '@/types';

/**
 * Props for each individual draft slot cell.
 *
 * @property {string} pickNumber - The pick label (e.g. "1.01", "3.05").
 * @property {Player} [player] - The drafted player (if this pick has been made).
 */
type DraftSlotProps = {
  pickNumber: string;
  player?: Player;
};

/**
 * Formats a player's name as "F. Lastname"
 */
function formatPlayerName(fullName?: string): string {
  if (!fullName) return 'Unknown Player';
  const [first, ...rest] = fullName.split(' ');
  const last = rest.join(' ');
  return `${first.charAt(0)}. ${last}`;
}

/**
 * Returns a background color class based on the player's position.
 */
function getPositionColor(position: string): string {
  switch (position) {
    case 'WR':
      return '#04005786'; // purple-ish
    case 'RB':
      return '#00340196'; // dark greenish
    case 'QB':
      return '#5b050096'; // deep red
    case 'TE':
      return '#b12f0096'; // lavender
    default:
      return '#1e293bcc'; // slate-800 fallback
  }
}


/**
 * DraftSlot component displays a single draft grid cell.
 */
const DraftSlot = ({ pickNumber, player }: DraftSlotProps) => {
  const backgroundColor = player ? getPositionColor(player.position) : 'bg-gray-800';

  return (
    <div
      className={`relative h-[44px] w-full min-w-[90px] rounded-md border border-slate-700 transition-colors duration-200 ${backgroundColor}`}
      style={{ backgroundColor }}
    >
      {/* Pick number in top right */}
      <div className="absolute top-[2px] right-[3px] text-[8.5px] text-[#a1fe00]">
        {pickNumber}
      </div>

      {/* Drafted player info */}
      <div className="h-full w-full flex flex-col justify-center px-2 leading-tight text-[11px] text-white font-medium">
        {player && (
          <>
            <div className="text-left">{formatPlayerName(player.name)}</div>
            <div className="text-left text-[9px] text-slate-400 mt-[1px]">
              {player.position}&nbsp;&nbsp;{player.team}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DraftSlot;
