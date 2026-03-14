import type {
  CreateDraftRequestDto,
  DraftRosterConfigRequestDto,
} from "../api/dto";

import type {
  DraftSetupLeagueState,
  DraftSetupMetadataState,
  DraftSetupRosterState,
  DraftSetupState,
} from "./setup.types";

/**
 * The backend expects "best_ball" in adpFormatKey, while the setup UI uses "bestball".
 */
function toAdpFormatPrefix(format: DraftSetupLeagueState["format"]): string {
  switch (format) {
    case "redraft":
      return "redraft";
    case "dynasty":
      return "dynasty";
    case "rookie":
      return "rookie";
    case "bestball":
      return "best_ball";
    default: {
      const exhaustiveCheck: never = format;
      return exhaustiveCheck;
    }
  }
}

/**
 * Builds the exact adpFormatKey expected by the backend.
 *
 * Example:
 * dynasty + 1qb + 1_ppr + sleeper
 * => "dynasty_1qb_1_ppr_sleeper"
 */
export function buildAdpFormatKey(league: DraftSetupLeagueState): string {
  const prefix = toAdpFormatPrefix(league.format);
  return `${prefix}_${league.qbType}_${league.scoring}_${league.platform}`;
}

/**
 * Applies known roster invariants from the current setup rules/UI:
 * - QB is always locked to 1
 * - SF is 1 for superflex, otherwise 0
 *
 * This keeps the backend request aligned with the actual setup rules,
 * instead of relying on scattered modal-side effects.
 */
export function normalizeRosterForLeague(
  roster: DraftSetupRosterState,
  league: DraftSetupLeagueState,
): DraftSetupRosterState {
  return {
    numTeams: roster.numTeams,
    positions: {
      QB: 1,
      RB: roster.positions.RB,
      WR: roster.positions.WR,
      TE: roster.positions.TE,
      FLX: roster.positions.FLX,
      SF: league.qbType === "superflex" ? 1 : 0,
      K: roster.positions.K,
    },
    benchCount: roster.benchCount,
  };
}

/**
 * Converts setup roster state into the exact backend rosterConfig DTO shape.
 */
export function buildRosterConfigDto(
  roster: DraftSetupRosterState,
): DraftRosterConfigRequestDto {
  return {
    numTeams: roster.numTeams,
    positions: {
      QB: roster.positions.QB,
      RB: roster.positions.RB,
      WR: roster.positions.WR,
      TE: roster.positions.TE,
      FLX: roster.positions.FLX,
      SF: roster.positions.SF,
      K: roster.positions.K,
    },
    benchCount: roster.benchCount,
  };
}

/**
 * Normalizes optional text so we do not send whitespace-only strings.
 */
function normalizeOptionalText(value: string): string | undefined {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

/**
 * Builds optional draft metadata for the create-draft request.
 *
 * Because title/notes are optional in the backend contract, this helper
 * omits them entirely when not provided.
 */
export function buildDraftMetadata(
  metadata: DraftSetupMetadataState,
): Partial<Pick<CreateDraftRequestDto, "title" | "notes">> {
  const title = normalizeOptionalText(metadata.title);
  const notes = normalizeOptionalText(metadata.notes);

  return {
    ...(title !== undefined ? { title } : {}),
    ...(notes !== undefined ? { notes } : {}),
  };
}

/**
 * Converts full frontend setup state into the exact backend create-draft request DTO.
 *
 * This is the main bridge between:
 * - frontend-owned pre-draft setup state
 * - backend POST /api/drafts contract
 *
 * Notes:
 * - timer and keeper are part of frontend setup state, but are not included here yet
 *   because the current backend create-draft contract does not accept them.
 */
export function buildCreateDraftRequestDto(
  setup: DraftSetupState,
  requestId: string,
): CreateDraftRequestDto {
  const normalizedRoster = normalizeRosterForLeague(setup.roster, setup.league);

  return {
    requestId,
    adpFormatKey: buildAdpFormatKey(setup.league),
    rosterConfig: buildRosterConfigDto(normalizedRoster),
    ...buildDraftMetadata(setup.metadata),
  };
}
