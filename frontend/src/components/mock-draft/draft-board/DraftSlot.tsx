"use client";

import { Player } from "@/types/core/player";
import { PlusCircle } from "lucide-react";
import classNames from "classnames";

type DraftSlotProps = {
  pickNumber: string;
  player?: Player;
  isHovered?: boolean;
  isAssigning?: boolean;
  onClick?: () => void;
};

function formatPlayerName(fullName?: string): string {
  if (!fullName) return "Unknown Player";
  const [first, ...rest] = fullName.split(" ");
  const last = rest.join(" ");
  return `${first.charAt(0)}. ${last}`;
}

function getPositionColor(position: string): string {
  switch (position) {
    case "WR":
      return "#04005786";
    case "RB":
      return "#00340196";
    case "QB":
      return "#5b050096";
    case "TE":
      return "#b12f0096";
    default:
      return "#1e293bcc";
  }
}

const DraftSlot = ({
  pickNumber,
  player,
  isHovered = false,
  isAssigning = false,
  onClick,
}: DraftSlotProps) => {
  const backgroundColor = player
    ? getPositionColor(player.position)
    : "bg-[#0e172c9f]";

  return (
    <div
      className={classNames(
        "relative h-[44px] w-full min-w-[110px] rounded-md border border-slate-700 transition-all duration-200",
        !player && "cursor-pointer",
        isHovered && !player && "bg-cyan-900/40",
        isAssigning && "ring-4 ring-cyan-400 animate-pulse"
      )}
      style={{ backgroundColor: player ? backgroundColor : undefined }}
      onClick={onClick}
    >
      {/* ➕ Green Plus Icon (hovered) */}
      {isHovered && !player && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <PlusCircle className="text-green-400 w-6 h-6 opacity-90" />
        </div>
      )}

      {/* Pick number */}
      <div className="absolute top-[2px] right-[3px] text-[8.5px] text-[#07f1dd] z-10">
        {pickNumber}
      </div>

      {/* Player Info */}
      <div className="h-full w-full flex flex-col justify-center px-2 leading-tight text-[11px] text-white font-medium z-10">
        {player && (
          <>
            <div className="text-left">
              {formatPlayerName(player.full_name)}
            </div>
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
