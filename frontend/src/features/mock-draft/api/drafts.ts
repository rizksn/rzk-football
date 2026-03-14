import { API_BASE_URL } from "@/utils/config";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

import type {
  CreateDraftRequestDto,
  DraftStateResponseDto,
  SimulateRequestDto,
  SimulateStateResponseDto,
} from "./dto";

type ApiErrorDetailItem = {
  loc?: Array<string | number>;
  msg?: string;
  type?: string;
};

type ApiErrorBody = {
  detail?: string | ApiErrorDetailItem[] | Record<string, unknown> | null;
  message?: string | null;
};

async function parseJsonSafe<T>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

function formatApiErrorMessage(
  data: ApiErrorBody | null,
  fallbackMessage: string,
): string {
  if (!data) {
    return fallbackMessage;
  }

  if (typeof data.detail === "string" && data.detail.trim()) {
    return data.detail;
  }

  if (Array.isArray(data.detail) && data.detail.length > 0) {
    const first = data.detail[0];
    if (first?.msg) {
      return first.msg;
    }
  }

  if (typeof data.message === "string" && data.message.trim()) {
    return data.message;
  }

  return fallbackMessage;
}

async function handleApiResponse<T>(
  res: Response,
  fallbackMessage: string,
): Promise<T> {
  const data = await parseJsonSafe<T | ApiErrorBody>(res);

  if (!res.ok) {
    const message = formatApiErrorMessage(
      (data as ApiErrorBody | null) ?? null,
      fallbackMessage,
    );
    throw new Error(message);
  }

  if (!data) {
    throw new Error(fallbackMessage);
  }

  return data as T;
}

/**
 * POST /api/drafts
 *
 * Expects the exact backend request DTO.
 * Does not generate requestId or reshape frontend state.
 */
export async function createDraft(
  payload: CreateDraftRequestDto,
): Promise<DraftStateResponseDto> {
  const res = await fetchWithAuth(`${API_BASE_URL}/api/drafts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleApiResponse<DraftStateResponseDto>(
    res,
    "Failed to create draft",
  );
}

/**
 * GET /api/drafts/{draftId}/state
 */
export async function fetchDraftState(
  draftId: string,
): Promise<DraftStateResponseDto> {
  const res = await fetchWithAuth(
    `${API_BASE_URL}/api/drafts/${draftId}/state`,
    {
      method: "GET",
    },
  );

  return handleApiResponse<DraftStateResponseDto>(
    res,
    "Failed to load draft state",
  );
}

/**
 * POST /api/simulate
 *
 * Expects the exact backend request DTO.
 * The caller should own requestId creation/reuse for idempotency.
 */
export async function simulateDraftPick(
  payload: SimulateRequestDto,
): Promise<SimulateStateResponseDto> {
  const res = await fetchWithAuth(`${API_BASE_URL}/api/simulate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  return handleApiResponse<SimulateStateResponseDto>(
    res,
    "Failed to simulate draft pick",
  );
}
