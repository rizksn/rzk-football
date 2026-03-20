import { API_BASE_URL } from "@/utils/config";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

import type {
  CreateDraftRequestDto,
  DraftStateResponseDto,
  SimulateRequestDto,
  SimulateStateResponseDto,
} from "./dto";
import { handleApiResponse } from "./client";

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
