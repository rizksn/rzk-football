import { useEffect } from 'react';
import { Player } from '@/types';
import { extractPlayerName } from '@/utils/extractPlayerName';
import { resolvePlayer } from '@/utils/resolvePlayer';

interface UseCpuDraftProps {
  draftStarted: boolean;
  isUserTurn: boolean;
  currentPickIndex: number;
  draftBoard: (Player | null)[][];
  players: Player[];
  onCpuPick: (player: Player) => void;
  totalPicks: number;
  numTeams: number;
}

export function useCpuDraft({
  draftStarted,
  isUserTurn,
  currentPickIndex,
  draftBoard,
  players,
  onCpuPick,
  totalPicks,
  numTeams
}: UseCpuDraftProps) {
  useEffect(() => {
    const runCpuPick = async () => {
      if (!draftStarted || isUserTurn || currentPickIndex >= totalPicks) return;

      const round = Math.floor(currentPickIndex / numTeams);
      const indexInRound = currentPickIndex % numTeams;
      const teamIndex = round % 2 === 0 ? indexInRound : numTeams - 1 - indexInRound;

      try {
        const res = await fetch('http://127.0.0.1:8000/simulate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ draftBoard, teamIndex }),
        });

        const data = await res.json();
        const text = data.result as string;
        console.log('🧠 ANUBIS response:', text);

        const rawName = extractPlayerName(text, players);
        if (!rawName) return console.error('❌ Failed to extract player name');

        const aiPick = resolvePlayer(rawName, players);
        if (!aiPick) return console.error('❌ AI pick not found:', rawName);

        onCpuPick(aiPick);
      } catch (err) {
        console.error('❌ CPU pick failed:', err);
      }
    };

    const timeout = setTimeout(runCpuPick, 1000);
    return () => clearTimeout(timeout);
  }, [draftStarted, isUserTurn, currentPickIndex, draftBoard, players]);
}
