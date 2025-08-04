export interface DraftConfig {
  adpFormatKey: string;
  leagueFormat: string;
  qb_setting: string;
  scoring: string;
  platform: string;
  useAI: boolean;
  num_teams: number;
}

export type RosterPosition = "QB" | "RB" | "WR" | "TE" | "FLX" | "SF" | "K";

export type RosterSlotConfig = {
  count: number;
  locked?: boolean;
};

export type RosterConfig = {
  [position in RosterPosition]?: RosterSlotConfig;
};

export interface DraftRosterSettings {
  positions: RosterConfig;
  benchCount: number;
  totalRounds: number;
}
