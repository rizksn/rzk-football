import { useEffect } from 'react';
import { Player } from '@/types';

interface UseCpuDraftProps {
  draftStarted: boolean;
  isUserTurn: boolean;
  currentPickIndex: number;
  draftBoard: (Player | null)[][];
  players: Player[];
  onCpuPick: (player: Player) => void;
  totalPicks: number;
  numTeams: number;
  leagueFormat: string;
  useAI: boolean;
}

export function useCpuDraft({
  draftStarted,
  isUserTurn,
  currentPickIndex,
  draftBoard,
  players,
  onCpuPick,
  totalPicks,
  numTeams,
  leagueFormat,
  useAI,
}: UseCpuDraftProps) {
  useEffect(() => {
    if (!draftStarted || isUserTurn || currentPickIndex >= totalPicks) return;

    const round = Math.floor(currentPickIndex / numTeams);
    const indexInRound = currentPickIndex % numTeams;
    const teamIndex = round % 2 === 0 ? indexInRound : numTeams - 1 - indexInRound;

    const runCpuPick = async () => {
      try {
        const res = await fetch('https://rzk-anubis.onrender.com/api/simulate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            draftBoard,
            teamIndex,
            use_ai: useAI,
            leagueFormat,
          }),
        });

        const data = await res.json();

        if (!data?.result) {
          console.error('❌ AI pick missing from response:', data);
          return;
        }

        const aiPick = data.result as Player;
        console.log(`🤖 CPU pick (Team ${teamIndex}):`, aiPick.full_name);
        onCpuPick(aiPick);
      } catch (err) {
        console.error('❌ CPU pick failed:', err);
      }
    };

    const timeout = setTimeout(runCpuPick, 800);
    return () => clearTimeout(timeout);
  }, [
    draftStarted,
    isUserTurn,
    currentPickIndex,
    draftBoard,
    players,
    totalPicks,
    numTeams,
    leagueFormat,
    useAI,
    onCpuPick,
  ]);
}