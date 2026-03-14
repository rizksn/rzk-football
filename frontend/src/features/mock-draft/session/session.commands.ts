import { createDraft, fetchDraftState, simulateDraftPick } from "../api/drafts";
import {
  mapDraftStateResponseDtoToSnapshot,
  mapSimulateStateResponseDtoToSnapshot,
} from "../api/mapper";
import { buildCreateDraftRequestDto } from "../setup/setup.helpers";
import type { DraftSetupState } from "../setup/setup.types";
import type { DraftSessionSnapshot } from "./session.models";
import type { DraftSessionAction } from "./session.types";
import type { Dispatch } from "react";

type SessionDispatch = Dispatch<DraftSessionAction>;

function createRequestId(): string {
  return crypto.randomUUID();
}

/**
 * Creates a new draft from frontend-owned setup state.
 *
 * Flow:
 * - build exact backend DTO from setup state
 * - dispatch create start
 * - call POST /api/drafts
 * - map backend DTO -> DraftSessionSnapshot
 * - dispatch success/error
 */
export async function createDraftFromSetup(
  dispatch: SessionDispatch,
  setup: DraftSetupState,
): Promise<DraftSessionSnapshot> {
  const requestId = createRequestId();

  dispatch({
    type: "CREATE_DRAFT_START",
    requestId,
  });

  try {
    const payload = buildCreateDraftRequestDto(setup, requestId);
    const responseDto = await createDraft(payload);
    const snapshot = mapDraftStateResponseDtoToSnapshot(responseDto);

    dispatch({
      type: "CREATE_DRAFT_SUCCESS",
      payload: snapshot,
    });

    return snapshot;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to create draft";

    dispatch({
      type: "CREATE_DRAFT_ERROR",
      error: message,
    });

    throw error;
  }
}

/**
 * Hydrates the authoritative draft state from the backend.
 *
 * Flow:
 * - dispatch hydrate start
 * - call GET /api/drafts/{draftId}/state
 * - map backend DTO -> DraftSessionSnapshot
 * - dispatch success/error
 */
export async function hydrateDraftSession(
  dispatch: SessionDispatch,
  draftId: string,
): Promise<DraftSessionSnapshot> {
  dispatch({
    type: "HYDRATE_DRAFT_START",
  });

  try {
    const responseDto = await fetchDraftState(draftId);
    const snapshot = mapDraftStateResponseDtoToSnapshot(responseDto);

    dispatch({
      type: "HYDRATE_DRAFT_SUCCESS",
      payload: snapshot,
    });

    return snapshot;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load draft state";

    dispatch({
      type: "HYDRATE_DRAFT_ERROR",
      error: message,
    });

    throw error;
  }
}

/**
 * Submits a user pick for the active draft.
 *
 * Flow:
 * - generate requestId for idempotency
 * - dispatch simulate start
 * - call POST /api/simulate with selectedPlayerId
 * - map backend DTO -> DraftSessionSnapshot
 * - dispatch success/error
 */
export async function submitUserPick(
  dispatch: SessionDispatch,
  draftId: string,
  selectedPlayerId: string,
): Promise<DraftSessionSnapshot> {
  const requestId = createRequestId();

  dispatch({
    type: "SIMULATE_PICK_START",
    requestId,
  });

  try {
    const responseDto = await simulateDraftPick({
      requestId,
      draftId,
      selectedPlayerId,
      use_ai: false,
    });

    const snapshot = mapSimulateStateResponseDtoToSnapshot(responseDto);

    dispatch({
      type: "SIMULATE_PICK_SUCCESS",
      payload: snapshot,
    });

    return snapshot;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to submit user pick";

    dispatch({
      type: "SIMULATE_PICK_ERROR",
      error: message,
    });

    throw error;
  }
}

/**
 * Submits a CPU pick for the active draft.
 *
 * Flow:
 * - generate requestId for idempotency
 * - dispatch simulate start
 * - call POST /api/simulate without selectedPlayerId
 * - map backend DTO -> DraftSessionSnapshot
 * - dispatch success/error
 */
export async function submitCpuPick(
  dispatch: SessionDispatch,
  draftId: string,
  useAi = false,
): Promise<DraftSessionSnapshot> {
  const requestId = createRequestId();

  dispatch({
    type: "SIMULATE_PICK_START",
    requestId,
  });

  try {
    const responseDto = await simulateDraftPick({
      requestId,
      draftId,
      selectedPlayerId: null,
      use_ai: useAi,
    });

    const snapshot = mapSimulateStateResponseDtoToSnapshot(responseDto);

    dispatch({
      type: "SIMULATE_PICK_SUCCESS",
      payload: snapshot,
    });

    return snapshot;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to submit CPU pick";

    dispatch({
      type: "SIMULATE_PICK_ERROR",
      error: message,
    });

    throw error;
  }
}

/**
 * Clears the current session error.
 */
export function clearSessionError(dispatch: SessionDispatch): void {
  dispatch({
    type: "CLEAR_SESSION_ERROR",
  });
}

/**
 * Resets the active session to its initial empty state.
 */
export function resetSession(dispatch: SessionDispatch): void {
  dispatch({
    type: "RESET_SESSION",
  });
}
