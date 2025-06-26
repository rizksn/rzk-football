'use client';

import { useState, useEffect } from 'react';
import { Player } from '@/types';
import { NUM_TEAMS, NUM_ROUNDS, TOTAL_PICKS, getSnakedTeamIndex } from '@/utils/constants';
import { API_BASE_URL } from '@/utils/config';

import MockNavbar from './MockNavbar';
import DraftBoard from './draft-board/DraftBoard';
import LowerPanel from './lower-panel/LowerPanel';
import DraftSettingsModal from './DraftSettingsModal';
import { useAuthContext } from '@/context/AuthContext'; 

interface DraftConfig {
  adpFormatKey: string;
  leagueFormat: string;
  qb_setting: string;
  scoring: string;
  platform: string;
  useAI: boolean;
}

export default function MockDraft() {
  const { user, isPaidUser } = useAuthContext(); 
  const isLoggedIn = !!user;

  const [showSettings, setShowSettings] = useState(false); 

  const [draftConfig, setDraftConfig] = useState<DraftConfig>({
    adpFormatKey: 'dynasty_1qb_1_ppr_sleeper',
    leagueFormat: 'dynasty',
    qb_setting: '1qb',
    scoring: 'ppr',
    platform: 'sleeper',
    useAI: false,
  });

  const [players, setPlayers] = useState<Player[]>([]);
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
  const [isSplit, setIsSplit] = useState(true);
  const [loading, setLoading] = useState(false);

  const sortedPlayers = Array.isArray(players)
    ? [...players].sort((a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity))
    : [];

  const draftComplete = currentPickIndex >= TOTAL_PICKS;

  useEffect(() => {
    async function fetchPlayers() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/players?format=${draftConfig.adpFormatKey}`);
        const json: { data: Player[] } = await res.json();
        console.log("🔍 Raw /api/players response:", json);

        if (!Array.isArray(json.data)) {
          throw new Error('Expected an array of players');
        }

        if (json.data.some((p) => typeof p !== 'object' || !('player_id' in p))) {
          throw new Error('Invalid player format');
        }

        setPlayers(json.data);
      } catch (err) {
        console.error('❌ Failed to fetch player data:', err);
        setPlayers([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPlayers();
  }, [draftConfig]);

  const round = Math.floor(currentPickIndex / NUM_TEAMS);
  const indexInRound = currentPickIndex % NUM_TEAMS;
  const teamIndex = getSnakedTeamIndex(round, indexInRound);
  const isUserTurn = draftStarted && userDraftSlot === teamIndex;

  useEffect(() => {
    if (!draftStarted || userDraftSlot == null || draftComplete) return;

    const round = Math.floor(currentPickIndex / NUM_TEAMS);
    const indexInRound = currentPickIndex % NUM_TEAMS;
    const teamIndex = getSnakedTeamIndex(round, indexInRound);

    if (teamIndex !== userDraftSlot) {
      const timeout = setTimeout(() => {
        simulateCpuPick();
      }, 800); 

      return () => clearTimeout(timeout); 
    }
  }, [currentPickIndex, draftStarted, userDraftSlot]);

  function makePick(player: Player) {
    if (draftComplete) return;

    const round = Math.floor(currentPickIndex / NUM_TEAMS);
    const indexInRound = currentPickIndex % NUM_TEAMS;
    const snakedTeamIndex = getSnakedTeamIndex(round, indexInRound);

    setDraftBoard(prev => {
      const updated = prev.map(row => [...row]);
      const playerWithTeamIndex = { ...player, team_index: snakedTeamIndex };
      updated[round][snakedTeamIndex] = playerWithTeamIndex;
      return updated;
    });

    setPlayers(prev => prev.filter(p => p.player_id !== player.player_id));
    setQueuePlayers(prev => prev.filter(p => p.player_id !== player.player_id));
    setCurrentPickIndex(prev => prev + 1);
  }

  function handleUserPick(player: Player) {
    if (!draftStarted || !isUserTurn || draftComplete) return;
    setUserRoster(prev => [...prev, player]);
    makePick(player);
  }

  async function simulateCpuPick() {
    if (!draftStarted || draftComplete) return;

    const round = Math.floor(currentPickIndex / NUM_TEAMS);
    const indexInRound = currentPickIndex % NUM_TEAMS;
    const teamIndex = getSnakedTeamIndex(round, indexInRound);

    try {
      const payload = {
        draftBoard,
        teamIndex,
        use_ai: draftConfig.useAI,
        leagueFormat: draftConfig.leagueFormat,
        adpFormatKey: draftConfig.adpFormatKey,
      };

      const res = await fetch(`${API_BASE_URL}/api/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!data?.result) {
        console.error("❌ No AI pick returned:", data);
        return;
      }

      makePick(data.result);
    } catch (err) {
      console.error("❌ Failed to simulate CPU pick:", err);
    }
  }

  async function handleStartDraft() {
    setDraftStarted(true);
  }

  return (
    <div className="w-full max-w-[1600px] min-w-[1250px] mx-auto h-full">
      <div className="flex flex-col h-screen overflow-hidden">
        <MockNavbar
          draftStarted={draftStarted}
          onStartDraft={handleStartDraft}
          onOpenSettings={() => setShowSettings(true)}
        />

        <div className="flex-1 overflow-y-auto relative z-0">
          <DraftBoard
            draftStarted={draftStarted}
            draftGrid={draftBoard}
            claimedTeamIndex={userDraftSlot}
            onClaimTeam={setUserDraftSlot}
          />
        </div>

        <div className="h-[55vh] min-h-[300px] overflow-visible relative z-10">
          <LowerPanel
            players={sortedPlayers}
            draftedPlayers={draftBoard.flat().filter(Boolean) as Player[]}
            isUserTurn={isUserTurn}
            onDraftPlayer={handleUserPick}
            onAddToQueue={player =>
              setQueuePlayers(prev =>
                prev.some(p => p.player_id === player.player_id) ? prev : [...prev, player]
              )
            }
            onRemoveFromQueue={id =>
              setQueuePlayers(prev => prev.filter(p => p.player_id !== id))
            }
            queuePlayers={queuePlayers}
            userRoster={userRoster}
            leftPlayer={leftPlayer}
            rightPlayer={rightPlayer}
            isSplit={isSplit}
          />
        </div>

        {draftComplete && (
          <div className="text-center mt-4 text-lg font-bold">✅ Draft Complete</div>
        )}
      </div>

      {showSettings && (
        <DraftSettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          draftConfig={draftConfig}
          setDraftConfig={setDraftConfig}
          onConfirm={(newConfig) => {
            setDraftConfig(newConfig);
            setPlayers([]);
          }}
          isPaidUser={isPaidUser}
          isLoggedIn={isLoggedIn}
        />
      )}
    </div>
  );
}
