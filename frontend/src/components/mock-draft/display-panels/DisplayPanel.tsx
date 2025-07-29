"use client";

import React, { useState, useEffect } from "react";
import { Player } from "@/types/core/player";
import PlayerImage from "@/components/shared/PlayerImage";
import { API_BASE_URL } from "@/utils/config";

interface Props {
  player: Player | null;
  wide?: boolean;
}

type PlayerStats = Record<string, string | number>;

export default function DisplayPanel({ player, wide = false }: Props) {
  const [year, setYear] = useState<"2024" | "2023">("2024");
  const [category, setCategory] = useState<"passing" | "receiving" | "rushing">(
    "receiving"
  );
  const [stats, setStats] = useState<
    Record<"2024" | "2023", PlayerStats | null>
  >({
    "2024": null,
    "2023": null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!player) return;

    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/player-data/${player.position.toLowerCase()}/${year}?player_id=${
            player.player_id
          }`
        );
        const json = await res.json();
        const playerData = Array.isArray(json)
          ? json.find((row) => row.player_id === player.player_id)
          : null;

        if (playerData) {
          setStats((prev) => ({ ...prev, [year]: playerData }));
        } else {
          console.warn(
            `No data found for ${player.full_name} (${player.player_id}) in ${year}`
          );
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [player?.player_id, year]);

  const renderStats = () => {
    const statData = stats[year];
    if (loading)
      return (
        <p className="italic text-sm text-gray-400">Loading {year} stats...</p>
      );
    if (!statData)
      return (
        <p className="italic text-sm text-gray-400">
          No {year} stats available.
        </p>
      );

    const entries = Object.entries(statData);
    const filters = {
      passing: entries.filter(([key]) => key.startsWith("pass_")),
      receiving: entries.filter(([key]) => key.startsWith("rec_")),
      rushing: entries.filter(([key]) => key.startsWith("rush_")),
    };

    const StatGroup = ({
      title,
      entries,
    }: {
      title: string;
      entries: [string, any][];
    }) => (
      <div className="mb-2">
        <div className="text-white text-[10px] tracking-wider mb-1 border-b border-white/20 uppercase">
          {title}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-1 text-[10px] text-gray-300">
          {entries.map(([key, value]) => (
            <div key={key}>
              <span className="font-bold text-white">
                {key.replaceAll("_", " ")}:
              </span>{" "}
              {value}
            </div>
          ))}
        </div>
      </div>
    );

    const selectedStats = filters[category];

    return (
      <div className="flex flex-col gap-2">
        {selectedStats.length > 0 ? (
          <StatGroup
            title={category.charAt(0).toUpperCase() + category.slice(1)}
            entries={selectedStats}
          />
        ) : (
          <p className="italic text-sm text-gray-400">
            No {category} stats available for {year}.
          </p>
        )}
      </div>
    );
  };

  return (
    <div
      className={`
    w-full h-[110px]
    ${player ? "bg-panel-on" : "bg-panel-off"}
    rounded-md ring-1 ring-[#010a0db4] relative
    overflow-hidden transition-all duration-300
    [transform:rotateX(3deg)] [transform-style:preserve-3d] [backface-visibility:hidden]
  `}
    >
      {/* Glow + Dot Grid */}
      <div className="absolute inset-0 z-0 bg-[rgba(16,94,82,0.51)] blur-sm pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(rgba(0,255,255,0.08)_1px,transparent_1px)] bg-[size:20px_20px] opacity-40 pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-row items-center h-full px-4 py-2 gap-4 text-white">
        {player ? (
          <>
            {/* LEFT: Player Image and Info */}
            <div className="relative flex flex-col items-center w-[80px]">
              <span className="absolute top-0 left-0 text-[10px] font-bold uppercase">
                {player.position}
              </span>
              <span className="absolute top-0 right-0 text-[10px] font-bold uppercase">
                {player.team}
              </span>

              <PlayerImage
                playerId={player.player_id}
                alt={player.full_name}
                height={64}
                className="rounded-full ring-slate-600"
              />

              <span className="text-xs mt-1 text-center">
                {player.full_name}
              </span>
            </div>

            {/* CENTER/RIGHT: Stats */}
            <div className="flex-1 overflow-y-auto pr-2 pb-4">
              {renderStats()}
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-500 italic">No player selected</p>
        )}
      </div>

      {/* Bottom Controls */}
      {player && (
        <div className="absolute bottom-1 w-full flex justify-center z-10">
          <div className="flex gap-10">
            {/* Year Selector */}
            <div className="text-white text-xs flex items-center gap-x-2 bg-black/30 px-3 rounded-sm">
              <button
                className={`font-bold ${
                  year === "2024" ? "text-cyan-300" : "text-white/60"
                }`}
                onClick={() => setYear("2024")}
              >
                2024
              </button>
              <span>|</span>
              <button
                className={`font-bold ${
                  year === "2023" ? "text-cyan-300" : "text-white/60"
                }`}
                onClick={() => setYear("2023")}
              >
                2023
              </button>
            </div>

            {/* Category Selector */}
            <div className="text-white text-xs flex items-center gap-x-2 bg-black/30 px-3 py-0.5 rounded-sm">
              <button
                className={`font-bold ${
                  category === "passing" ? "text-cyan-300" : "text-white/60"
                }`}
                onClick={() => setCategory("passing")}
              >
                Passing
              </button>
              <span>|</span>
              <button
                className={`font-bold ${
                  category === "receiving" ? "text-cyan-300" : "text-white/60"
                }`}
                onClick={() => setCategory("receiving")}
              >
                Receiving
              </button>
              <span>|</span>
              <button
                className={`font-bold ${
                  category === "rushing" ? "text-cyan-300" : "text-white/60"
                }`}
                onClick={() => setCategory("rushing")}
              >
                Rushing
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
