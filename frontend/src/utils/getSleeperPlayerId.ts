import sleeperIndex from '@/data/sleeperPlayerIndex.json';

type SleeperPlayer = {
  player_id: string;
  first_name: string;
  last_name: string;
  [key: string]: any; // optional: in case there are extra fields we don't care about
};

const typedSleeperIndex = sleeperIndex as Record<string, SleeperPlayer>;

function normalizeName(name: string): string {
  return name
    .replace(/\./g, '')                  // 👈 remove periods like "D.K."
    .replace(/\b(Jr|Sr|II|III|IV)\b\.?/gi, '') // remove Jr., Sr., II, III, etc.
    .trim()
    .toLowerCase();
}


export function getSleeperPlayerId(playerName: string): string | undefined {
  const normalized = normalizeName(playerName);

  for (const id in typedSleeperIndex) {
    const player = typedSleeperIndex[id];
    const fullName = `${player.first_name} ${player.last_name}`.toLowerCase();
    if (normalizeName(fullName) === normalized) {
      return player.player_id;
    }
  }

  return undefined;
}
