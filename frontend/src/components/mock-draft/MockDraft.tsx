'use client';

import { useState, useEffect } from 'react';
import { Player } from '@/types';
import MockNavbar from './MockNavbar';
import DraftBoard from './DraftBoard';
import LowerPanel from './lower-panel/LowerPanel';

const NUM_TEAMS = 12;
const NUM_ROUNDS = 15;
const TOTAL_PICKS = NUM_TEAMS * NUM_ROUNDS;

const getSnakedTeamIndex = (round: number, indexInRound: number): number =>
  round % 2 === 0 ? indexInRound : NUM_TEAMS - 1 - indexInRound;

const extractPlayerName = (
  responseText: string | undefined,
  playerPool: Player[]
): string | null => {
  if (!responseText) return null;

  const cleanText = responseText.replace(/\*\*(.*?)\*\*/g, '$1').toLowerCase();

  // 👇 Try strict match first
  const match = cleanText.match(/player name:\s*([a-z]+\s[a-z]+)/i);
  if (match?.[1]) return match[1];

  // 👇 Fallback: fuzzy match against player pool
  for (const player of playerPool) {
    const name = player.name.toLowerCase();
    if (cleanText.includes(name)) return player.name;
  }

  return null;
};

const resolvePlayer = (
  playerNameRaw: string,
  playerPool: Player[]
): Player | null => {
  const normalize = (name: string) =>
    name.replace(/[^\w\s]/gi, '').toLowerCase().trim();

  const aiName = normalize(playerNameRaw);

  for (const player of playerPool) {
    const poolName = normalize(player.name);
    if (poolName === aiName) return player;
    if (poolName.includes(aiName) || aiName.includes(poolName)) return player;
  }

  return null;
};

type Props = {
  initialPlayers: Player[];
};

export default function MockDraft({ initialPlayers }: Props) {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [draftPlan, setDraftPlan] = useState<Player[]>([]);
  const [draftBoard, setDraftBoard] = useState<(Player | null)[][]>(
    Array.from({ length: NUM_ROUNDS }, () => Array(NUM_TEAMS).fill(null))
  );
  const [currentPickIndex, setCurrentPickIndex] = useState(0);
  const [userDraftSlot, setUserDraftSlot] = useState<number | null>(null);
  const [draftStarted, setDraftStarted] = useState(false);
  const [queuePlayers, setQueuePlayers] = useState<Player[]>([]);
  const [userRoster, setUserRoster] = useState<Player[]>([]);

  const round = Math.floor(currentPickIndex / NUM_TEAMS);
  const indexInRound = currentPickIndex % NUM_TEAMS;
  const teamIndex = getSnakedTeamIndex(round, indexInRound);
  const isUserTurn = draftStarted && userDraftSlot === teamIndex;

  useEffect(() => {
    const runCpuPick = async () => {
      if (!draftStarted || isUserTurn || currentPickIndex >= TOTAL_PICKS) return;
  
      const round = Math.floor(currentPickIndex / NUM_TEAMS);
      const indexInRound = currentPickIndex % NUM_TEAMS;
      const teamIndex = getSnakedTeamIndex(round, indexInRound);
  
      try {
        const res = await fetch('http://127.0.0.1:8000/simulate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ draftBoard, teamIndex }),
        });
  
        const data = await res.json();
        const text = data.result as string;
        console.log("🧠 ANUBIS response:", text);
  
        const rawName = extractPlayerName(text, players);
        if (!rawName) {
          console.error("❌ Could not extract player name from AI response");
          return;
        }
  
        const aiPick = resolvePlayer(rawName, players);
        if (!aiPick) {
          console.error("❌ AI recommended player not found in pool:", rawName);
          return;
        }
  
        makePick(aiPick);
      } catch (err) {
        console.error("❌ CPU draft error:", err);
      }
    };
  
    const timeout = setTimeout(runCpuPick, 1000);
    return () => clearTimeout(timeout);
  }, [currentPickIndex, draftStarted, isUserTurn, draftBoard, players]);
  
  const makePick = (player: Player) => {
    const round = Math.floor(currentPickIndex / NUM_TEAMS);
    const indexInRound = currentPickIndex % NUM_TEAMS;
    const snakedTeamIndex = getSnakedTeamIndex(round, indexInRound);

    setDraftBoard(prev => {
      const updated = [...prev.map(row => [...row])];
      updated[round][snakedTeamIndex] = player;
      return updated;
    });

    setDraftPlan(prev => prev.filter(p => p.id !== player.id));
    setPlayers(prev => prev.filter(p => p.id !== player.id));
    setQueuePlayers(prev => prev.filter(p => p.id !== player.id));
    setCurrentPickIndex(prev => prev + 1);
  };

  const handleUserPick = (player: Player) => {
    if (!isUserTurn) return;
    setUserRoster(prev => [...prev, player]);
    makePick(player);
  };

  const handleStartDraft = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          draftBoard,
          teamIndex: userDraftSlot ?? 11,
        }),
      });

      const data = await res.json();
      const text = data.result as string;
      console.log("\ud83e\udde0 ANUBIS response:", text);

      const rawName = extractPlayerName(text, players);
      if (!rawName) {
        console.error("\u274c Could not extract player name from AI response");
        return;
      }

      const aiPick = resolvePlayer(rawName, players);
      if (!aiPick) {
        console.error("\u274c AI recommended player not found in pool:", rawName);
        return;
      }

      setDraftPlan([aiPick]);
      setDraftBoard(
        Array.from({ length: NUM_ROUNDS }, () => Array(NUM_TEAMS).fill(null))
      );
      setCurrentPickIndex(0);
      setDraftStarted(true);
    } catch (err) {
      console.error("\u274c Draft simulation crashed:", err);
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <MockNavbar draftStarted={draftStarted} onStartDraft={handleStartDraft} />
      <div className="flex-1 overflow-y-auto relative z-0">
        <DraftBoard
          draftStarted={draftStarted}
          draftGrid={draftBoard}
          claimedTeamIndex={userDraftSlot}
          onClaimTeam={setUserDraftSlot}
        />
      </div>
      <div className="h-[50vh] bg-transparent shadow-2xl relative z-10">
        <LowerPanel
          players={players}
          draftedPlayers={draftBoard.flat().filter(Boolean) as Player[]}
          isUserTurn={isUserTurn}
          onDraftPlayer={handleUserPick}
          onAddToQueue={player =>
            setQueuePlayers(prev =>
              prev.some(p => p.id === player.id) ? prev : [...prev, player]
            )
          }
          onRemoveFromQueue={id =>
            setQueuePlayers(prev => prev.filter(p => p.id !== id))
          }
          queuePlayers={queuePlayers}
          userRoster={userRoster}
        />
      </div>
    </div>
  );
}
