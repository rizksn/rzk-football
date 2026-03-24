"use client";

import React, { useEffect, useState } from "react";

import type { AdpPlayerResponseDto } from "@/features/mock-draft/api/dto";
import PlayerImage from "@/features/shared/PlayerImage";
import { API_BASE_URL } from "@/utils/config";

interface Props {
  player: AdpPlayerResponseDto | null;
  wide?: boolean;
}

type PlayerStats = Record<string, string | number>;

function chunk<T>(arr: T[], size: number): T[][] {
  const res: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    res.push(arr.slice(i, i + size));
  }
  return res;
}

export default function DisplayPanel({ player, wide = false }: Props) {
  const [year, setYear] = useState<"2024" | "2023">("2024");
  const [category, setCategory] = useState<"passing" | "receiving" | "rushing">(
    "receiving",
  );
  const [stats, setStats] = useState<
    Record<"2024" | "2023", PlayerStats | null>
  >({
    "2024": null,
    "2023": null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!player?.position || !player.playerId) return;

    const playerPosition = player.position;
    const playerId = player.playerId;
    const playerName = player.fullName ?? "Unknown Player";

    const fetchStats = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_BASE_URL}/api/player-data/${playerPosition.toLowerCase()}/${year}?player_id=${playerId}`,
        );
        const json = await res.json();
        const playerData = Array.isArray(json)
          ? json.find((row) => row.player_id === playerId)
          : null;

        if (playerData) {
          setStats((prev) => ({ ...prev, [year]: playerData }));
        } else {
          console.warn(
            `No data found for ${playerName} (${playerId}) in ${year}`,
          );
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    void fetchStats();
  }, [player?.playerId, player?.position, player?.fullName, year]);

  const STAT_LABELS: Record<string, string> = {
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

    if (loading) {
      return (
        <p className="italic text-[10px] text-gray-400">
          Loading {year} stats...
        </p>
      );
    }

    if (!statData) {
      return (
        <p className="italic text-[10px] text-gray-400">
          No {year} stats available.
        </p>
      );
    }

    const order =
      category === "receiving"
        ? RECEIVING_ORDER
        : category === "rushing"
          ? RUSHING_ORDER
          : PASSING_ORDER;

    return (
      <div className="px-4 space-y-1">
        {chunk(
          order.filter((key) => statData[key] != null),
          5,
        ).map((row, idx) => (
          <div
            key={idx}
            className="grid grid-cols-5 rounded-md bg-[#0486a367] py-0.5 pl-10 text-[11px] leading-tight text-white"
          >
            {row.map((key) => (
              <div key={key} className="whitespace-nowrap">
                <span className="font-mono text-[#40ff33]">
                  {formatStatLabel(key)}:
                </span>{" "}
                <span className="font-semibold text-white">
                  {statData[key]}
                </span>
              </div>
            ))}
          </div>
        ))}
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
        ${wide ? "min-h-[110px]" : ""}
      `}
    >
      <div className="absolute inset-0 z-0 bg-[rgba(16,94,82,0.51)] blur-sm pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(rgba(0,255,255,0.08)_1px,transparent_1px)] bg-[size:20px_20px] opacity-40 pointer-events-none" />

      <div className="relative z-10 flex h-full flex-row items-center text-white">
        {player ? (
          <>
            <div
              className={`relative flex h-full w-[120px] flex-col items-center justify-center rounded-md px-1 ${
                player.team ? `bg-team-${player.team}` : "bg-transparent"
              }`}
            >
              <div className="absolute inset-0 rounded-md bg-black bg-opacity-20 pointer-events-none" />

              <span className="absolute top-1 left-1 text-[10px] font-bold uppercase">
                {player.position ?? "--"}
              </span>
              <span className="absolute top-1 right-1 text-[10px] font-bold uppercase">
                {player.team ?? "--"}
              </span>

              <PlayerImage
                playerId={player.playerId}
                alt={player.fullName ?? "Player"}
                height={64}
                className="brightness-110"
              />
              <span className="mt-1 text-center text-xs">
                {player.fullName ?? "Unknown Player"}
              </span>
            </div>

            <div
              className={`h-full flex-1 overflow-y-auto px-2 ${
                player ? "bg-[#0b1e21]" : "bg-transparent"
              }`}
            >
              <div className="mb-4 flex w-full justify-center">
                <div className="flex items-center gap-10 text-[11px] font-medium uppercase">
                  <div className="flex overflow-hidden rounded-sm bg-[#0b0b0b]">
                    {["2024", "2023"].map((y) => (
                      <button
                        key={y}
                        onClick={() => setYear(y as "2024" | "2023")}
                        className={`relative h-[24px] px-3 text-[11px] font-semibold uppercase tracking-wide transition-all duration-200 ${
                          year === y
                            ? "text-cyan-300"
                            : "text-white/40 hover:text-white"
                        }`}
                      >
                        {y}
                        {year === y && (
                          <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-cyan-300" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="flex overflow-hidden rounded-sm bg-[#0b0b0b]">
                    {["passing", "receiving", "rushing"].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setCategory(cat as typeof category)}
                        className={`relative h-[24px] px-3 text-[10px] font-semibold uppercase tracking-wide transition-all duration-200 ${
                          category === cat
                            ? "text-cyan-300"
                            : "text-white/50 hover:text-white"
                        }`}
                      >
                        {cat}
                        {category === cat && (
                          <span className="absolute bottom-0 left-0 h-[2px] w-full rounded-full bg-cyan-300" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {renderStats()}
            </div>
          </>
        ) : (
          <p className="px-4 text-sm italic text-gray-500">
            No player selected
          </p>
        )}
      </div>
    </div>
  );
}
