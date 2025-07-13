export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

import {
  DraftRosterSettings,
  RosterConfig,
  RosterPosition,
} from "@/types/draft/config";

export const DEFAULT_ROSTER_SETTINGS: DraftRosterSettings = {
  positions: {
    QB: { count: 1, locked: true },
    RB: { count: 2 },
    WR: { count: 2 },
    TE: { count: 1 },
    FLX: { count: 2 },
    SF: { count: 0 },
    K: { count: 1 },
  },
  benchCount: 6,
  totalRounds: 15,
};
