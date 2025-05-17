'use client';

import { Player } from '@/types';
import PlayerImage from '@/components/shared/PlayerImage';

type RosterPlayerProps = {
  slot: string;
  player: Player | null;
  playerId: string | null;
};

const RosterPlayer = ({ slot, player, playerId }: RosterPlayerProps) => {
  return (
    <li className="flex items-center justify-between px-3 py-2 bg-[#1c283c3d] rounded text-xs w-full max-h-[32px]">
      {/* Slot Label */}
      <div className="w-[40px] font-semibold">{slot}</div>

      {/* Player Data or Empty */}
      {player ? (
        <>
          {playerId ? (
            <PlayerImage playerId={playerId} className="ml-4" />
          ) : (
            <div className="w-[22px] h-[22px] bg-slate-600 rounded-full ml-4" />
          )}
          <div className="flex-1 text-center font-medium">{player.name}</div>
          <div className="w-[40px] text-xs text-slate-400 text-right">{player.team}</div>
        </>
      ) : (
        <div className="flex-1 italic text-slate-400 text-left ml-2">Empty</div>
      )}
    </li>
  );
};

export default RosterPlayer;