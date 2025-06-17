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
        const res = await fetch('https://rzk-anubis.onrender.com/simulate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ draftBoard, teamIndex }),
        });
    
        const data = await res.json();
    
        // Backend now returns the full player object as `data.result`
        const aiPick = data.result as Player;
    
        if (!aiPick) {
          return console.error('❌ AI pick not found in backend response');
        }
    
        console.log('🧠 ANUBIS pick:', aiPick);
    
        onCpuPick(aiPick);
    
      } catch (err) {
        console.error('❌ CPU pick failed:', err);
      }
    };    

    const timeout = setTimeout(runCpuPick, 1000);
    return () => clearTimeout(timeout);
  }, [draftStarted, isUserTurn, currentPickIndex, draftBoard, players]);
}
