"use client";

import { PlusCircle } from "lucide-react";
import classNames from "classnames";

import type { DraftedPlayer } from "@/features/mock-draft/session/session.models";

type DraftSlotProps = {
  pickNumber: string;
  player: DraftedPlayer | null;
  isHovered?: boolean;
  isCurrentPick?: boolean;
};

function formatPlayerName(fullName?: string): string {
  if (!fullName) return "Unknown Player";
  const [first, ...rest] = fullName.split(" ");
  const last = rest.join(" ");
  return last ? `${first.charAt(0)}. ${last}` : fullName;
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
  isCurrentPick = false,
}: DraftSlotProps) => {
  const backgroundColor = player
    ? getPositionColor(player.position)
    : undefined;

  return (
    <div
      className={classNames(
        "relative h-[44px] w-full min-w-[110px] rounded-md border border-slate-700 transition-all duration-200",
        !player && "bg-[#0e172c9f]",
        isHovered && !player && "bg-cyan-900/40",
        isCurrentPick && "ring-2 ring-cyan-400",
      )}
      style={{ backgroundColor }}
    >
      {isHovered && !player && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <PlusCircle className="h-6 w-6 text-green-400 opacity-90" />
        </div>
      )}

      <div className="absolute right-[3px] top-[2px] z-10 text-[8.5px] text-[#07f1dd]">
        {pickNumber}
      </div>

      <div className="z-10 flex h-full w-full flex-col justify-center px-2 text-[11px] font-medium leading-tight text-white">
        {player && (
          <>
            <div className="text-left">{formatPlayerName(player.fullName)}</div>
            <div className="mt-[1px] text-left text-[9px] text-slate-400">
              {player.position}&nbsp;&nbsp;{player.team}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DraftSlot;
