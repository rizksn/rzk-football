"use client";

import { useState } from "react";
import { DEFAULT_ROSTER_SETTINGS } from "@/utils/config";
import type { DraftConfig } from "@/types/draft/config";
import type { DraftRosterSettings } from "@/types/draft/config";

export function useDraftConfig() {
  const [draftConfig, setDraftConfig] = useState<DraftConfig>({
    adpFormatKey: "dynasty_1qb_1_ppr_sleeper",
    leagueFormat: "dynasty",
    qb_setting: "1qb",
    scoring: "1-ppr",
    platform: "sleeper",
    useAI: false,
    num_teams: 12,
  });

  const [rosterSettings, setRosterSettings] = useState<DraftRosterSettings>(
    DEFAULT_ROSTER_SETTINGS
  );

  const updateConfigWithTotalRounds = (
    newConfig: DraftConfig,
    newRosterSettings: DraftRosterSettings
  ) => {
    const { positions, benchCount } = newRosterSettings;
    const totalPositions = Object.values(positions).reduce(
      (sum, slot) => sum + slot.count,
      0
    );

    setDraftConfig(newConfig);
    setRosterSettings({
      ...newRosterSettings,
      totalRounds: totalPositions + benchCount,
    });
  };

  return {
    draftConfig,
    setDraftConfig,
    rosterSettings,
    setRosterSettings,
    updateConfigWithTotalRounds,
  };
}
