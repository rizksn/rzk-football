'use client';

import { useState } from 'react';
import { Player } from '@/types';
import { useCpuDraft } from './hooks/useCpuDraft';
import { extractPlayerName } from '@/utils/extractPlayerName';
import { resolvePlayer } from '@/utils/resolvePlayer';
import { NUM_TEAMS, NUM_ROUNDS, TOTAL_PICKS, getSnakedTeamIndex } from '@/utils/constants';

import MockNavbar from './MockNavbar';
import DraftBoard from './draft-board/DraftBoard';
import LowerPanel from './lower-panel/LowerPanel';

type Props = {
  initialPlayers: Player[];
};

export default function MockDraft({ initialPlayers }: Props) {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [draftBoard, setDraftBoard] = useState<(Player | null)[][]>(
    Array.from({ length: NUM_ROUNDS }, () => Array(NUM_TEAMS).fill(null))
  );
  const [currentPickIndex, setCurrentPickIndex] = useState(0);
  const [userDraftSlot, setUserDraftSlot] = useState<number | null>(null);
  const [draftStarted, setDraftStarted] = useState(false);
  const [queuePlayers, setQueuePlayers] = useState<Player[]>([]);
  const [userRoster, setUserRoster] = useState<Player[]>([]);
  const [leftPlayer, setLeftPlayer] = useState<Player | null>(null);
  const [rightPlayer, setRightPlayer] = useState<Player | null>(null);
  const [isSplit, setIsSplit] = useState(true); // add a UI toggle 

  const round = Math.floor(currentPickIndex / NUM_TEAMS);
  const indexInRound = currentPickIndex % NUM_TEAMS;
  const teamIndex = getSnakedTeamIndex(round, indexInRound);
  const isUserTurn = draftStarted && userDraftSlot === teamIndex;

  useCpuDraft({
    draftStarted,
    isUserTurn,
    currentPickIndex,
    draftBoard,
    players,
    onCpuPick: makePick,
    totalPicks: TOTAL_PICKS,
    numTeams: NUM_TEAMS,
  });

  function makePick(player: Player) {
    const round = Math.floor(currentPickIndex / NUM_TEAMS);
    const indexInRound = currentPickIndex % NUM_TEAMS;
    const snakedTeamIndex = getSnakedTeamIndex(round, indexInRound);

    setDraftBoard(prev => {
      const updated = [...prev.map(row => [...row])];
      player.team_index = snakedTeamIndex; 
      updated[round][snakedTeamIndex] = player;
      return updated;
    });

    setPlayers(prev => prev.filter(p => p.id !== player.id));
    setQueuePlayers(prev => prev.filter(p => p.id !== player.id));
    setCurrentPickIndex(prev => prev + 1);
  }

  const handleUserPick = (player: Player) => {
    if (!isUserTurn) return;
    setUserRoster(prev => [...prev, player]);
    makePick(player);
  };

  const handleStartDraft = async () => {
    const round = Math.floor(currentPickIndex / NUM_TEAMS);
    const indexInRound = currentPickIndex % NUM_TEAMS;
    const teamIndex = getSnakedTeamIndex(round, indexInRound);
  
    try {
      const res = await fetch('https://rzk-anubis.onrender.com/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          draftBoard,
          teamIndex,
        }),
      });
  
      const data = await res.json();
      const text = data.result as string;
      console.log('🧠 ANUBIS response:', text);
  
      const rawName = extractPlayerName(text, players);
      if (!rawName) return console.error('❌ Could not extract player name');
  
      const aiPick = resolvePlayer(rawName, players);
      if (!aiPick) return console.error('❌ AI player not found:', rawName);
  
      setDraftBoard(
        Array.from({ length: NUM_ROUNDS }, () => Array(NUM_TEAMS).fill(null))
      );
      setCurrentPickIndex(0);
      setDraftStarted(true);
      makePick(aiPick);
    } catch (err) {
      console.error('❌ Draft simulation crashed:', err);
    }
  };  

  return (
    <div className="w-full max-w-[1600px] min-w-[1250px] mx-auto h-full">
      <div className="flex flex-col h-screen overflow-hidden">
        
        <MockNavbar draftStarted={draftStarted} onStartDraft={handleStartDraft} />

        {/* Draft Grid Area */}
        <div className="flex-1 overflow-y-auto relative z-0">
          <DraftBoard
            draftStarted={draftStarted}
            draftGrid={draftBoard}
            claimedTeamIndex={userDraftSlot}
            onClaimTeam={setUserDraftSlot}
          />
        </div>

        {/* Lower Panel */}
        <div className="h-[55vh] min-h-[300px] overflow-visible relative z-10">
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
            leftPlayer={leftPlayer}
            rightPlayer={rightPlayer}
            isSplit={isSplit}
          />
        </div>
      </div>
    </div>
  );
}