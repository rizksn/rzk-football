export interface DraftConfig {
  adpFormatKey: string;
  leagueFormat: string;
  qbSetting: string;
  scoring: string;
  platform: string;
  numTeams: number;
  useAI: boolean;
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
