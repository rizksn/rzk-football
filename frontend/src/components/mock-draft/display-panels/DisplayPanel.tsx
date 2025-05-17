import React from 'react';
import { Player } from '@/types';

interface Props {
  player: Player | null;
  wide?: boolean;
}

export default function DisplayPanel({ player, wide = false }: Props) {
  return (
    <div
      className={`
      w-full
      min-h-[90px]
      xl:min-h-[100px]
      2xl:min-h-[150px]
      max-h-[200px]
      bg-[#000000af] rounded-md ring-1 ring-[#010a0db4] relative
      overflow-hidden transition-all duration-300
      [transform:rotateX(3deg)] [transform-style:preserve-3d] [backface-visibility:hidden]
        `}
    >
      {/* ✅ Glow surface tint */}
      <div className="absolute inset-0 z-0 bg-[rgba(16,94,82,0.51)] blur-sm pointer-events-none" />

      {/* ✅ Dot grid pattern */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(rgba(0,255,255,0.08)_1px,transparent_1px)] bg-[size:20px_20px] opacity-40 pointer-events-none" />

      {/* Main content */}
      <div className="relative z-10 p-4 text-white flex flex-col justify-center h-full">
        {player ? (
          <>
            <h2 className="text-lg font-semibold mb-1">{player.name}</h2>
            <p className="text-sm text-gray-300">
              {player.position} – {player.team}
            </p>
          </>
        ) : (
          <p className="text-sm text-gray-500 italic">No player selected</p>
        )}
      </div>
    </div>
  );
}

// bg-[rgba(0,153,255,0.18)]  bg-[rgb(0,153,255)]   bg-[rgb(0,183,255)]  bg-[rgba(0,115,255,0.3)]

// winner so far: bg-[rgb(0,255,251)]  bg-[rgb(11,67,59)]   bg-[rgb(16,94,82)]