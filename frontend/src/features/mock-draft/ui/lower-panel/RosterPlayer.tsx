"use client";

import type { DraftedPlayer } from "@/features/mock-draft/session/session.models";
import PlayerImage from "@/features/shared/PlayerImage";

type RosterPlayerProps = {
  slot: string;
  player: DraftedPlayer | null;
};

const RosterPlayer = ({ slot, player }: RosterPlayerProps) => {
  return (
    <li className="flex items-center justify-between px-3 py-2 bg-[#1c283c3d] rounded text-xs w-full max-h-[32px]">
      <div className="w-[40px] font-semibold">{slot}</div>

      {player ? (
        <>
          {player.playerId ? (
            <PlayerImage playerId={player.playerId} className="ml-4" />
          ) : (
            <div className="w-[22px] h-[22px] bg-slate-600 rounded-full ml-4" />
          )}
          <div className="flex-1 text-center font-medium">
            {player.fullName}
          </div>
          <div className="w-[40px] text-xs text-slate-400 text-right">
            {player.team}
          </div>
        </>
      ) : (
        <div className="flex-1 italic text-slate-400 text-left ml-2">Empty</div>
      )}
    </li>
  );
};

export default RosterPlayer;
