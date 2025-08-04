"use client";

import React from "react";
import type { DraftRosterSettings, DraftConfig } from "@/types/draft/config";

const POSITION_LIMITS: Record<string, number> = {
  RB: 5,
  WR: 5,
  TE: 3,
  FLEX: 5,
  K: 2,
};
const MAX_BENCH_COUNT = 15;

interface Props {
  rosterSettings: DraftRosterSettings;
  setRosterSettings: (settings: DraftRosterSettings) => void;
  draftConfig: DraftConfig;
  setDraftConfig: (config: DraftConfig) => void;
  isPaidUser: boolean;
  onConfirm: () => void;
}

function recalculateTotalRounds(settings: DraftRosterSettings): number {
  const startingSpots = Object.values(settings.positions).reduce(
    (sum, pos) => sum + (pos?.count || 0),
    0
  );
  return startingSpots + settings.benchCount;
}

export default function RosterSettingsForm({
  rosterSettings,
  setRosterSettings,
  draftConfig,
  isPaidUser,
  onConfirm,
  setDraftConfig,
}: Props) {
  return (
    <div>
      <div className="mb-6">
        <label className="block text-sm font-semibold text-white mb-2">
          Number of Teams
        </label>
        <select
          value={draftConfig.num_teams}
          onChange={(e) => {
            const updatedConfig = {
              ...draftConfig,
              num_teams: parseInt(e.target.value),
            };
            setDraftConfig(updatedConfig);
          }}
          className="w-full px-3 py-2 text-sm bg-slate-800 text-white border border-slate-600 rounded-md"
        >
          {[8, 10, 12].map((n) => (
            <option key={n} value={n}>
              {n} Teams
            </option>
          ))}
        </select>
      </div>

      <h2 className="text-xl font-bold mb-4 text-white">
        Roster Configuration
      </h2>

      <div className="space-y-4">
        {Object.entries(rosterSettings.positions).map(([position, config]) => (
          <div key={position} className="flex items-center justify-between">
            <label className="font-medium text-white">{position}</label>
            <input
              type="number"
              min={0}
              max={POSITION_LIMITS[position] ?? 5}
              value={config.count}
              disabled={config.locked}
              onChange={(e) => {
                const count = parseInt(e.target.value);
                const updated = {
                  ...rosterSettings,
                  positions: {
                    ...rosterSettings.positions,
                    [position]: { ...config, count },
                  },
                };
                updated.totalRounds = recalculateTotalRounds(updated);
                setRosterSettings(updated);
              }}
              className="w-16 px-2 py-1 bg-slate-800 text-white rounded border border-slate-600 disabled:opacity-50"
            />
          </div>
        ))}

        <div className="pt-6 space-y-2">
          <div className="flex items-center justify-between">
            <label className="font-medium text-white">Bench Spots</label>
            <input
              type="number"
              min={0}
              max={MAX_BENCH_COUNT}
              value={rosterSettings.benchCount}
              onChange={(e) => {
                const updated = {
                  ...rosterSettings,
                  benchCount: parseInt(e.target.value),
                };
                updated.totalRounds = recalculateTotalRounds(updated);
                setRosterSettings(updated);
              }}
              className="w-16 px-2 py-1 bg-slate-800 text-white rounded border border-slate-600"
            />
          </div>
        </div>

        <div className="pt-6 flex justify-end">
          <button
            onClick={onConfirm}
            className="bg-blue-600 hover:bg-green-600 text-white px-4 py-2 rounded shadow-md hover:shadow-lg transition"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
