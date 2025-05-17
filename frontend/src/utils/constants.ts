export const NUM_TEAMS = 12;
export const NUM_ROUNDS = 15;
export const TOTAL_PICKS = NUM_TEAMS * NUM_ROUNDS;

export function getSnakedTeamIndex(round: number, indexInRound: number): number {
  return round % 2 === 0 ? indexInRound : NUM_TEAMS - 1 - indexInRound;
}