import { getSnakedTeamIndex } from "@/utils/constants";
import type { DraftPick } from "@/components/mock-draft/MockDraft";

export function initializeDraftPlan(
  numTeams: number,
  totalRounds: number
): DraftPick[] {
  const totalPicks = numTeams * totalRounds;

  return Array.from({ length: totalPicks }, (_, i) => {
    const round = Math.floor(i / numTeams);
    const pickInRound = i % numTeams;
    const teamIndex = getSnakedTeamIndex(round, pickInRound);
    return {
      pickIndex: i,
      round,
      pickInRound,
      teamIndex,
    };
  });
}
