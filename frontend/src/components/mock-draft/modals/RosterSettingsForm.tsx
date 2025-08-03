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
  updateConfigWithTotalRounds: (
    config: DraftConfig,
    settings: DraftRosterSettings
  ) => void;
  isPaidUser: boolean;
  onConfirm: () => void;
}

export default function RosterSettingsForm({
  rosterSettings,
  setRosterSettings,
  draftConfig,
  updateConfigWithTotalRounds,
  isPaidUser,
  onConfirm,
}: Props) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-white">
        Roster Configuration
      </h2>

      {!isPaidUser ? (
        <div className="text-white/60 text-sm">
          Subscribe to unlock roster configuration.{" "}
          <button
            onClick={() => (window.location.href = "/subscribe")}
            className="text-blue-400 underline"
          >
            Upgrade now →
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(rosterSettings.positions).map(
            ([position, config]) => (
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
                    updateConfigWithTotalRounds(draftConfig, updated);
                  }}
                  className="w-16 px-2 py-1 bg-slate-800 text-white rounded border border-slate-600 disabled:opacity-50"
                />
              </div>
            )
          )}

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
                  updateConfigWithTotalRounds(draftConfig, updated);
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
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
