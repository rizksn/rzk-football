import type { DraftSessionSnapshot } from "./session.models";

export type DraftSessionRequestStatus =
  | "idle"
  | "creating"
  | "hydrating"
  | "simulating"
  | "savingSettings"
  | "undoingPick"
  | "restartingDraft"
  | "pausingTimer"
  | "resumingTimer";

export interface DraftSessionRequestState {
  status: DraftSessionRequestStatus;
  requestId: string | null;
  error: string | null;
}

export interface DraftSessionState {
  snapshot: DraftSessionSnapshot | null;
  request: DraftSessionRequestState;
}

export type DraftSessionAction =
  | {
      type: "CREATE_DRAFT_START";
      requestId: string;
    }
  | {
      type: "CREATE_DRAFT_SUCCESS";
      payload: DraftSessionSnapshot;
    }
  | {
      type: "CREATE_DRAFT_ERROR";
      error: string;
    }
  | {
      type: "HYDRATE_DRAFT_START";
    }
  | {
      type: "HYDRATE_DRAFT_SUCCESS";
      payload: DraftSessionSnapshot;
    }
  | {
      type: "HYDRATE_DRAFT_ERROR";
      error: string;
    }
  | {
      type: "SIMULATE_PICK_START";
      requestId: string;
    }
  | {
      type: "SIMULATE_PICK_SUCCESS";
      payload: DraftSessionSnapshot;
    }
  | {
      type: "SIMULATE_PICK_ERROR";
      error: string;
    }
  | {
      type: "CLEAR_SESSION_ERROR";
    }
  | {
      type: "RESET_SESSION";
    };
