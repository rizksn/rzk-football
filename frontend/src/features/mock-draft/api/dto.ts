/**
 * Exact backend API DTOs for the mock draft feature.
 *
 * These types should mirror the FastAPI/Pydantic request and response models
 * as closely as possible.
 *
 * Notes:
 * - Keep backend field names/casing exactly as-is here.
 * - Datetime fields are modeled as ISO strings over the wire.
 * - Do not mix UI/domain-specific types into this file.
 */

export interface DraftRosterPositionsDto {
  QB: number;
  RB: number;
  WR: number;
  TE: number;
  FLX: number;
  SF: number;
  K: number;
}

/**
 * Request shape for rosterConfig when creating a draft.
 * Mirrors backend DraftRosterConfig input fields.
 */
export interface DraftRosterConfigRequestDto {
  numTeams: number;
  positions: DraftRosterPositionsDto;
  benchCount: number;
}

/**
 * Response shape for rosterConfig returned by backend.
 * Includes computed totalRounds from the backend.
 */
export interface DraftRosterConfigResponseDto {
  numTeams: number;
  positions: DraftRosterPositionsDto;
  benchCount: number;
  totalRounds: number;
}

export interface DraftedPlayerDto {
  player_id: string;
  full_name: string;
  position: string;
  team: string;
}

export interface DraftPickDto {
  pickIndex: number;
  round: number;
  pickInRound: number;
  teamIndex: number;
  draftedPlayer: DraftedPlayerDto | null;
}

export interface ScoredPlayerDto {
  player_id: string;
  full_name: string;
  search_full_name: string;
  first_name: string;
  last_name: string;
  team: string;
  position: string;

  rank: number;
  adp: string;
  scoring: string;
  platform: string;
  type: string;

  absolute_adp: number;
  final_score: number;
  debug: Record<string, unknown> | null;
}

/**
 * POST /drafts
 */
export interface CreateDraftRequestDto {
  requestId: string;
  title?: string | null;
  notes?: string | null;
  adpFormatKey: string;
  rosterConfig: DraftRosterConfigRequestDto;
}

export interface CreateDraftResponseDto {
  draftId: string;
  status: string;
  leagueFormat: string;
  adpFormatKey: string;
  rosterConfig: DraftRosterConfigResponseDto;

  title: string | null;
  notes: string | null;

  createdAt: string;
  updatedAt: string;
  pausedAt: string | null;
  completedAt: string | null;
}

/**
 * GET /drafts/{draft_id}/state
 */
export interface DraftStateResponseDto {
  draft: CreateDraftResponseDto;
  scoredPlayers: ScoredPlayerDto[];
  draftPlan: DraftPickDto[];
}

/**
 * POST /simulate
 */
export interface SimulateRequestDto {
  requestId?: string | null;
  draftId: string;
  selectedPlayerId?: string | null;
  use_ai?: boolean;
}

export interface SimulateStateResponseDto {
  draft: CreateDraftResponseDto;
  scoredPlayers: ScoredPlayerDto[];
  draftPlan: DraftPickDto[];
  pickedPlayer: DraftedPlayerDto;
  explanation: string | null;
}
