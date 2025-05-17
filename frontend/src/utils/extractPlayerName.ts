import { Player } from '@/types';
import { standardizeName } from '@/utils/standardizeName';

export function extractPlayerName(responseText: string | undefined, playerPool: Player[]): string | null {
  if (!responseText) return null;
  const cleaned = standardizeName(responseText);

  for (const player of playerPool) {
    const normalized = standardizeName(player.name);
    if (cleaned === normalized || cleaned.includes(normalized) || normalized.includes(cleaned)) {
      console.log("🧠 Extracted match:", player.name);
      return player.name;
    }
  }

  console.warn("⚠️ No match found for:", cleaned);
  return null;
}