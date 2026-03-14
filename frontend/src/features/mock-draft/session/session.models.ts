/**
 * Frontend runtime models for an active draft session.
 *
 * These are the canonical objects the frontend uses after a draft
 * has been created or hydrated from the backend.
 *
 * Notes:
 * - These are NOT raw API DTOs
 * - These are NOT reducer/action types
 * - These should reflect backend-owned runtime draft truth in
 *   frontend-friendly naming
 */

export interface DraftedPlayer {
  playerId: string;
  fullName: string;
  position: string;
  team: string;
}

export interface DraftPick {
  pickIndex: number;
  round: number;
  pickInRound: number;
  teamIndex: number;
  draftedPlayer: DraftedPlayer | null;
}

export interface ScoredPlayer {
  playerId: string;
  fullName: string;
  searchFullName: string;
  firstName: string;
  lastName: string;
  team: string;
  position: string;

  rank: number;
  adp: string;
  scoring: string;
  platform: string;
  type: string;

  absoluteAdp: number;
  finalScore: number;
  debug: Record<string, unknown> | null;
}

export interface DraftRosterPositions {
  QB: number;
  RB: number;
  WR: number;
  TE: number;
  FLX: number;
  SF: number;
  K: number;
}

export interface DraftRosterConfig {
  numTeams: number;
  positions: DraftRosterPositions;
  benchCount: number;
  totalRounds: number;
}

export interface Draft {
  draftId: string;
  status: string;
  leagueFormat: string;
  adpFormatKey: string;
  rosterConfig: DraftRosterConfig;

  title: string | null;
  notes: string | null;

  createdAt: string;
  updatedAt: string;
  pausedAt: string | null;
  completedAt: string | null;
}

export interface DraftSessionSnapshot {
  draft: Draft;
  scoredPlayers: ScoredPlayer[];
  draftPlan: DraftPick[];
}
