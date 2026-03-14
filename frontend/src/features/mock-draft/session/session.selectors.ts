import type {
  Draft,
  DraftPick,
  DraftRosterConfig,
  DraftSessionSnapshot,
  DraftedPlayer,
  ScoredPlayer,
} from "./session.models";
import type {
  DraftSessionState,
  DraftSessionRequestStatus,
} from "./session.types";

/**
 * Core snapshot selectors
 */

export function selectDraftSessionSnapshot(
  state: DraftSessionState,
): DraftSessionSnapshot | null {
  return state.snapshot;
}

export function selectDraft(state: DraftSessionState): Draft | null {
  return state.snapshot?.draft ?? null;
}

export function selectScoredPlayers(state: DraftSessionState): ScoredPlayer[] {
  return state.snapshot?.scoredPlayers ?? [];
}

export function selectDraftPlan(state: DraftSessionState): DraftPick[] {
  return state.snapshot?.draftPlan ?? [];
}

/**
 * Request lifecycle selectors
 */

export function selectSessionRequestStatus(
  state: DraftSessionState,
): DraftSessionRequestStatus {
  return state.request.status;
}

export function selectSessionRequestId(
  state: DraftSessionState,
): string | null {
  return state.request.requestId;
}

export function selectSessionError(state: DraftSessionState): string | null {
  return state.request.error;
}

export function selectIsSessionBusy(state: DraftSessionState): boolean {
  return state.request.status !== "idle";
}

/**
 * Basic draft metadata selectors
 */

export function selectDraftId(state: DraftSessionState): string | null {
  return state.snapshot?.draft.draftId ?? null;
}

export function selectDraftStatus(state: DraftSessionState): string | null {
  return state.snapshot?.draft.status ?? null;
}

export function selectRosterConfig(
  state: DraftSessionState,
): DraftRosterConfig | null {
  return state.snapshot?.draft.rosterConfig ?? null;
}

/**
 * Pick progress selectors
 */

export function selectCurrentPickIndex(
  state: DraftSessionState,
): number | null {
  const draftPlan = selectDraftPlan(state);

  const nextOpenIndex = draftPlan.findIndex(
    (pick) => pick.draftedPlayer === null,
  );

  return nextOpenIndex === -1 ? null : nextOpenIndex;
}

export function selectCurrentPick(state: DraftSessionState): DraftPick | null {
  const currentPickIndex = selectCurrentPickIndex(state);
  if (currentPickIndex === null) {
    return null;
  }

  const draftPlan = selectDraftPlan(state);
  return draftPlan[currentPickIndex] ?? null;
}

export function selectTotalPickCount(state: DraftSessionState): number {
  return selectDraftPlan(state).length;
}

export function selectPublishedPickCount(state: DraftSessionState): number {
  return selectDraftPlan(state).filter((pick) => pick.draftedPlayer !== null)
    .length;
}

export function selectIsDraftComplete(state: DraftSessionState): boolean {
  const draft = selectDraft(state);
  if (!draft) {
    return false;
  }

  if (draft.status === "COMPLETED") {
    return true;
  }

  return selectCurrentPickIndex(state) === null;
}

/**
 * Player-pool selectors
 */

export function selectDraftedPlayers(
  state: DraftSessionState,
): DraftedPlayer[] {
  return selectDraftPlan(state)
    .map((pick) => pick.draftedPlayer)
    .filter((player): player is DraftedPlayer => player !== null);
}

export function selectDraftedPlayerIds(state: DraftSessionState): Set<string> {
  return new Set(selectDraftedPlayers(state).map((player) => player.playerId));
}

export function selectAvailableScoredPlayers(
  state: DraftSessionState,
): ScoredPlayer[] {
  const scoredPlayers = selectScoredPlayers(state);
  const draftedIds = selectDraftedPlayerIds(state);

  return scoredPlayers.filter((player) => !draftedIds.has(player.playerId));
}

/**
 * Team-based selectors
 */

export function selectPicksForTeam(
  state: DraftSessionState,
  teamIndex: number,
): DraftPick[] {
  return selectDraftPlan(state).filter((pick) => pick.teamIndex === teamIndex);
}

export function selectDraftedPlayersForTeam(
  state: DraftSessionState,
  teamIndex: number,
): DraftedPlayer[] {
  return selectPicksForTeam(state, teamIndex)
    .map((pick) => pick.draftedPlayer)
    .filter((player): player is DraftedPlayer => player !== null);
}

/**
 * Convenience selector for looking up a scored player by id
 */

export function selectScoredPlayerById(
  state: DraftSessionState,
  playerId: string,
): ScoredPlayer | null {
  return (
    selectScoredPlayers(state).find((player) => player.playerId === playerId) ??
    null
  );
}
