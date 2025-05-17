import { Player } from '@/types';
import { standardizeName } from '@/utils/standardizeName';

export function resolvePlayer(playerNameRaw: string, playerPool: Player[]): Player | null {
  const aiName = standardizeName(playerNameRaw);

  for (const player of playerPool) {
    const poolName = standardizeName(player.name);
    if (aiName === poolName || poolName.includes(aiName) || aiName.includes(poolName)) {
      return player;
    }
  }

  return null;
}