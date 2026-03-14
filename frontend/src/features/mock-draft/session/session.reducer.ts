import type {
  DraftSessionAction,
  DraftSessionRequestState,
  DraftSessionState,
} from "./session.types";

export const INITIAL_DRAFT_SESSION_REQUEST_STATE: DraftSessionRequestState = {
  status: "idle",
  requestId: null,
  error: null,
};

export const INITIAL_DRAFT_SESSION_STATE: DraftSessionState = {
  snapshot: null,
  request: INITIAL_DRAFT_SESSION_REQUEST_STATE,
};

export function draftSessionReducer(
  state: DraftSessionState,
  action: DraftSessionAction,
): DraftSessionState {
  switch (action.type) {
    case "CREATE_DRAFT_START":
      return {
        ...state,
        request: {
          status: "creating",
          requestId: action.requestId,
          error: null,
        },
      };

    case "CREATE_DRAFT_SUCCESS":
      return {
        snapshot: action.payload,
        request: {
          status: "idle",
          requestId: null,
          error: null,
        },
      };

    case "CREATE_DRAFT_ERROR":
      return {
        ...state,
        request: {
          status: "idle",
          requestId: null,
          error: action.error,
        },
      };

    case "HYDRATE_DRAFT_START":
      return {
        ...state,
        request: {
          status: "hydrating",
          requestId: null,
          error: null,
        },
      };

    case "HYDRATE_DRAFT_SUCCESS":
      return {
        snapshot: action.payload,
        request: {
          status: "idle",
          requestId: null,
          error: null,
        },
      };

    case "HYDRATE_DRAFT_ERROR":
      return {
        ...state,
        request: {
          status: "idle",
          requestId: null,
          error: action.error,
        },
      };

    case "SIMULATE_PICK_START":
      return {
        ...state,
        request: {
          status: "simulating",
          requestId: action.requestId,
          error: null,
        },
      };

    case "SIMULATE_PICK_SUCCESS":
      return {
        snapshot: action.payload,
        request: {
          status: "idle",
          requestId: null,
          error: null,
        },
      };

    case "SIMULATE_PICK_ERROR":
      return {
        ...state,
        request: {
          status: "idle",
          requestId: null,
          error: action.error,
        },
      };

    case "CLEAR_SESSION_ERROR":
      return {
        ...state,
        request: {
          ...state.request,
          error: null,
        },
      };

    case "RESET_SESSION":
      return INITIAL_DRAFT_SESSION_STATE;

    default: {
      const exhaustiveCheck: never = action;
      return exhaustiveCheck;
    }
  }
}
