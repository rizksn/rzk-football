import type {
  CreateDraftResponseDto,
  DraftPickDto,
  DraftRosterConfigResponseDto,
  DraftRosterPositionsDto,
  DraftStateResponseDto,
  DraftedPlayerDto,
  ScoredPlayerDto,
  SimulateStateResponseDto,
} from "./dto";

import type {
  Draft,
  DraftPick,
  DraftRosterConfig,
  DraftRosterPositions,
  DraftSessionSnapshot,
  DraftedPlayer,
  ScoredPlayer,
} from "../session/session.models";

export function mapDraftedPlayerDtoToModel(
  dto: DraftedPlayerDto,
): DraftedPlayer {
  return {
    playerId: dto.player_id,
    fullName: dto.full_name,
    position: dto.position,
    team: dto.team,
  };
}

export function mapDraftPickDtoToModel(dto: DraftPickDto): DraftPick {
  return {
    pickIndex: dto.pickIndex,
    round: dto.round,
    pickInRound: dto.pickInRound,
    teamIndex: dto.teamIndex,
    draftedPlayer: dto.draftedPlayer
      ? mapDraftedPlayerDtoToModel(dto.draftedPlayer)
      : null,
  };
}

export function mapScoredPlayerDtoToModel(dto: ScoredPlayerDto): ScoredPlayer {
  return {
    playerId: dto.player_id,
    fullName: dto.full_name,
    searchFullName: dto.search_full_name,
    firstName: dto.first_name,
    lastName: dto.last_name,
    team: dto.team,
    position: dto.position,

    rank: dto.rank,
    adp: dto.adp,
    scoring: dto.scoring,
    platform: dto.platform,
    type: dto.type,

    absoluteAdp: dto.absolute_adp,
    finalScore: dto.final_score,
    debug: dto.debug,
  };
}

export function mapDraftRosterPositionsDtoToModel(
  dto: DraftRosterPositionsDto,
): DraftRosterPositions {
  return {
    QB: dto.QB,
    RB: dto.RB,
    WR: dto.WR,
    TE: dto.TE,
    FLX: dto.FLX,
    SF: dto.SF,
    K: dto.K,
  };
}

export function mapDraftRosterConfigDtoToModel(
  dto: DraftRosterConfigResponseDto,
): DraftRosterConfig {
  return {
    numTeams: dto.numTeams,
    positions: mapDraftRosterPositionsDtoToModel(dto.positions),
    benchCount: dto.benchCount,
    totalRounds: dto.totalRounds,
  };
}

export function mapDraftDtoToModel(dto: CreateDraftResponseDto): Draft {
  return {
    draftId: dto.draftId,
    status: dto.status,
    leagueFormat: dto.leagueFormat,
    adpFormatKey: dto.adpFormatKey,
    rosterConfig: mapDraftRosterConfigDtoToModel(dto.rosterConfig),

    title: dto.title,
    notes: dto.notes,

    createdAt: dto.createdAt,
    updatedAt: dto.updatedAt,
    pausedAt: dto.pausedAt,
    completedAt: dto.completedAt,
  };
}

export function mapDraftStateResponseDtoToSnapshot(
  dto: DraftStateResponseDto,
): DraftSessionSnapshot {
  return {
    draft: mapDraftDtoToModel(dto.draft),
    scoredPlayers: dto.scoredPlayers.map(mapScoredPlayerDtoToModel),
    draftPlan: dto.draftPlan.map(mapDraftPickDtoToModel),
  };
}

export function mapSimulateStateResponseDtoToSnapshot(
  dto: SimulateStateResponseDto,
): DraftSessionSnapshot {
  return {
    draft: mapDraftDtoToModel(dto.draft),
    scoredPlayers: dto.scoredPlayers.map(mapScoredPlayerDtoToModel),
    draftPlan: dto.draftPlan.map(mapDraftPickDtoToModel),
  };
}
