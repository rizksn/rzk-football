import type {
  DraftSetupKeeperState,
  DraftSetupLeagueState,
  DraftSetupMetadataState,
  DraftSetupRosterPositions,
  DraftSetupRosterState,
  DraftSetupState,
  DraftSetupTimerState,
} from "./setup.types";

/**
 * Default league settings for a brand-new mock draft setup.
 *
 * These align with the backend default/free format:
 * dynasty_1qb_1_ppr_sleeper
 */
export const DEFAULT_DRAFT_SETUP_LEAGUE: DraftSetupLeagueState = {
  format: "dynasty",
  qbType: "1qb",
  scoring: "1_ppr",
  platform: "sleeper",
};

/**
 * Default roster slot counts before a draft is created.
 */
export const DEFAULT_DRAFT_SETUP_ROSTER_POSITIONS: DraftSetupRosterPositions = {
  QB: 1,
  RB: 2,
  WR: 2,
  TE: 1,
  FLX: 1,
  SF: 0,
  K: 0,
};

export const DEFAULT_DRAFT_SETUP_ROSTER: DraftSetupRosterState = {
  numTeams: 12,
  positions: {
    ...DEFAULT_DRAFT_SETUP_ROSTER_POSITIONS,
  },
  benchCount: 8,
};

/**
 * Default timer configuration before a draft is created.
 *
 * null means unlimited / no pick clock.
 */
export const DEFAULT_DRAFT_SETUP_TIMER: DraftSetupTimerState = {
  enabled: true,
  secondsPerPick: 120,
};

/**
 * Default keeper configuration before a draft is created.
 */
export const DEFAULT_DRAFT_SETUP_KEEPER: DraftSetupKeeperState = {
  keeperMode: "standard",
  keeperSetId: null,
};

/**
 * Default draft-create metadata.
 */
export const DEFAULT_DRAFT_SETUP_METADATA: DraftSetupMetadataState = {
  title: "",
  notes: "",
};

export const DEFAULT_DRAFT_SETUP_STATE: DraftSetupState = {
  league: {
    ...DEFAULT_DRAFT_SETUP_LEAGUE,
  },
  roster: {
    numTeams: DEFAULT_DRAFT_SETUP_ROSTER.numTeams,
    positions: {
      ...DEFAULT_DRAFT_SETUP_ROSTER.positions,
    },
    benchCount: DEFAULT_DRAFT_SETUP_ROSTER.benchCount,
  },
  timer: {
    ...DEFAULT_DRAFT_SETUP_TIMER,
  },
  keeper: {
    ...DEFAULT_DRAFT_SETUP_KEEPER,
  },
  metadata: {
    ...DEFAULT_DRAFT_SETUP_METADATA,
  },
};
