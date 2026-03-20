import { API_BASE_URL } from "@/utils/config";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

import type { AdpPlayersResponseDto } from "./dto";
import { handleApiResponse } from "./client";

export async function fetchAdpPlayers(
  adpFormatKey: string,
): Promise<AdpPlayersResponseDto> {
  const url = new URL(`${API_BASE_URL}/api/adp/players`);
  url.searchParams.set("adpFormatKey", adpFormatKey);

  const res = await fetchWithAuth(url.toString(), {
    method: "GET",
  });

  return handleApiResponse<AdpPlayersResponseDto>(
    res,
    "Failed to load ADP players",
  );
}
