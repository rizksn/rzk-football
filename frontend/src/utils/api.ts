import { Player } from "@/types/core/player";

export async function fetchPlayerStats(
  statType: string,
  year: number = 2024
): Promise<Player[]> {
  const res = await fetch(`/api/player-data/${statType}/${year}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch player stats for ${statType} ${year}`);
  }
  return await res.json();
}
