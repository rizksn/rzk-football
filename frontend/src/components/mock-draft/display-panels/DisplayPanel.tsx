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

  const STAT_LABELS: Record<string, string> = {
    // 🔴 Passing
    pass_yds: "Yds",
    pass_td: "TDs",
    pass_cmp: "Cmp",
    pass_att: "Att",
    pass_int: "INT",
    pass_sck: "Sck",
    pass_rate: "Rate",
    pass_long: "Long",
    pass_cmp_percent: "Cmp %",
    pass_first: "1st",
    pass_first_percent: "1st %",
    pass_scky: "Sack Yds",
    pass_20_plus: "20+",
    pass_40_plus: "40+",
    pass_yds_att: "Y/A",

    // 🔵 Receiving (already defined)
    rec_yds: "Yds",
    rec_td: "TDs",
    rec_long: "Long",
    rec_yac_per_rec: "YAC/Rec",
    rec_targets: "Tgt",
    rec_first: "1st",
    rec_first_percent: "1st %",
    rec_20_plus: "20+",
    rec_40_plus: "40+",
    rec_fum: "Fum",

    // 🟢 Rushing
    rush_yds: "Yds",
    rush_td: "TDs",
    rush_att: "Att",
    rush_long: "Long",
    rush_first: "1st",
    rush_first_percent: "1st %",
    rush_20_plus: "20+",
    rush_40_plus: "40+",
    rush_fum: "Fum",
  };

  const RECEIVING_ORDER = [
    "rec_targets",
    "rec_yds",
    "rec_td",
    "rec_20_plus",
    "rec_40_plus",
    "rec_yac_per_rec",
    "rec_first",
    "rec_first_percent",
    "rec_long",
    "rec_fum",
  ];

  const RUSHING_ORDER = [
    "rush_att",
    "rush_yds",
    "rush_td",
    "rush_20_plus",
    "rush_40_plus",
    "rush_first",
    "rush_first_percent",
    "rush_long",
    "rush_fum",
  ];

  const PASSING_ORDER = [
    "pass_att",
    "pass_cmp",
    "pass_cmp_percent",
    "pass_yds",
    "pass_td",
    "pass_int",
    "pass_20_plus",
    "pass_40_plus",
    "pass_first",
    "pass_first_percent",
    "pass_rate",
    "pass_long",
    "pass_sck",
    "pass_scky",
    "pass_yds_att",
  ];

  const formatStatLabel = (key: string) =>
    STAT_LABELS[key] || key.replaceAll("_", " ").toUpperCase();

  const renderStats = () => {
    const statData = stats[year];
    if (loading)
      return (
        <p className="italic text-[10px] text-gray-400">
          Loading {year} stats...
        </p>
      );
    if (!statData)
      return (
        <p className="italic text-[10px] text-gray-400">
          No {year} stats available.
        </p>
      );

    const order =
      category === "receiving"
        ? RECEIVING_ORDER
        : category === "rushing"
        ? RUSHING_ORDER
        : PASSING_ORDER;

    return (
      <div className="grid grid-cols-5 gap-x-3 gap-y-[6px] text-[11px] leading-tight text-white pr-1 pt-2">
        {order.map((key) => {
          if (statData[key] == null) return null; // skip if stat doesn't exist
          return (
            <div key={key} className="whitespace-nowrap">
              <span className="text-[#40ff33] font-mono">
                {formatStatLabel(key)}:
              </span>{" "}
              <span className="font-semibold text-white">{statData[key]}</span>
            </div>
          );
        })}
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
      <div className="relative z-10 flex flex-row items-center h-full text-white">
        {player ? (
          <>
            {/* LEFT SQUARE */}
            <div
              className={`relative w-[120px] h-full flex flex-col items-center justify-center px-1 ${
                player ? `bg-team-${player.team}` : "bg-transparent"
              }`}
            >
              {/* Match only the left side corners */}
              {player && (
                <div className="absolute inset-0 bg-black bg-opacity-20 pointer-events-none rounded-l-md" />
              )}
              <span className="absolute top-1 left-1 text-[10px] font-bold uppercase">
                {player.position}
              </span>
              <span className="absolute top-1 right-1 text-[10px] font-bold uppercase">
                {player.team}
              </span>

              <PlayerImage
                playerId={player.player_id}
                alt={player.full_name}
                height={64}
                className="brightness-110"
              />
              <span className="text-xs mt-1 text-center">
                {player.full_name}
              </span>
            </div>

            {/* RIGHT PANEL */}
            <div
              className={`flex-1 h-full ${
                player ? "bg-[#0b1e21]" : "bg-transparent"
              } px-3 py-1.5 overflow-y-auto`}
            >
              {/* Moved Controls Here */}
              {player && (
                <div className="w-full flex justify-center mb-2">
                  <div className="flex gap-6 text-[10px]">
                    {/* Year Selector */}
                    <div className="flex bg-white/10 rounded px-2">
                      {["2024", "2023"].map((y) => (
                        <button
                          key={y}
                          className={`px-1.5 py-0.5 font-semibold rounded ${
                            year === y ? "text-[#2ba0ba]" : "text-white/60"
                          }`}
                          onClick={() => setYear(y as "2024" | "2023")}
                        >
                          {y}
                        </button>
                      ))}
                    </div>

                    {/* Category Selector */}
                    <div className="flex bg-white/10 rounded px-2">
                      {["passing", "receiving", "rushing"].map((cat) => (
                        <button
                          key={cat}
                          className={`px-1.5 py-0.5 capitalize font-semibold rounded ${
                            category === cat ? "text-cyan-300" : "text-white/60"
                          }`}
                          onClick={() => setCategory(cat as typeof category)}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {renderStats()}
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-500 italic px-4">
            No player selected
          </p>
        )}
      </div>
    </div>
  );
}

// #0b1e21      #16585a.    #006db0.    #ff2700
