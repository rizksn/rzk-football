export type DraftSetupFormat = "redraft" | "dynasty" | "rookie" | "bestball";
export type DraftSetupQbType = "1qb" | "superflex";
export type DraftSetupScoring = string;
export type DraftSetupPlatform = string;
export type DraftKeeperMode = "standard" | "keeper";

export interface DraftSetupLeagueState {
  format: DraftSetupFormat;
  qbType: DraftSetupQbType;
  scoring: DraftSetupScoring;
  platform: DraftSetupPlatform;
}

export interface DraftSetupRosterPositions {
  QB: number;
  RB: number;
  WR: number;
  TE: number;
  FLX: number;
  SF: number;
  K: number;
}

export interface DraftSetupRosterState {
  numTeams: number;
  positions: DraftSetupRosterPositions;
  benchCount: number;
}

export interface DraftSetupUserState {
  userTeamIndex: number | null;
}

export interface DraftSetupTimerState {
  enabled: boolean;
  secondsPerPick: number | null;
}

export interface DraftSetupKeeperState {
  keeperMode: DraftKeeperMode;
  keeperSetId: string | null;
}

export interface DraftSetupMetadataState {
  title: string;
  notes: string;
}

export interface DraftSetupState {
  league: DraftSetupLeagueState;
  roster: DraftSetupRosterState;
  timer: DraftSetupTimerState;
  keeper: DraftSetupKeeperState;
  metadata: DraftSetupMetadataState;
  user: DraftSetupUserState;
}
