'use client';

import { useState, useEffect, useMemo } from 'react';

import { Player } from '@/types/core/player';
import type { DraftConfig } from '@/types/draft/config';
import { NUM_TEAMS, NUM_ROUNDS, TOTAL_PICKS, getSnakedTeamIndex } from '@/utils/constants';
import { API_BASE_URL, DEFAULT_ROSTER_SETTINGS } from '@/utils/config';

import { useAuthContext } from '@/context/AuthContext';

import MockNavbar from './MockNavbar';
import DraftBoard from './draft-board/DraftBoard';
import LowerPanel from './lower-panel/LowerPanel';
import DraftSettingsModal from './DraftSettingsModal';

export interface DraftPick {
  pickIndex: number;
  round: number;
  pickInRound: number;
  teamIndex: number;
  draftedPlayer?: Player;
}

export default function MockDraft() {
  const { user, isPaidUser } = useAuthContext(); 
  const isLoggedIn = !!user;

  const [showSettings, setShowSettings] = useState(false); 
  const [draftConfig, setDraftConfig] = useState<DraftConfig>({
    adpFormatKey: 'dynasty_1qb_1_ppr_sleeper',
    leagueFormat: 'dynasty',
    qb_setting: '1qb',
    scoring: '1-ppr',
    platform: 'sleeper',
    useAI: false,
  });
  const [rosterSettings, setRosterSettings] = useState(DEFAULT_ROSTER_SETTINGS);

  const [players, setPlayers] = useState<Player[]>([]);
  const [draftPlan, setDraftPlan] = useState<DraftPick[]>([]);
  const [currentPickIndex, setCurrentPickIndex] = useState(0);
  const [draftStarted, setDraftStarted] = useState(false);
  const [userDraftSlot, setUserDraftSlot] = useState<number | null>(null);

  const [queuePlayers, setQueuePlayers] = useState<Player[]>([]);
  const [leftPlayer, setLeftPlayer] = useState<Player | null>(null);
  const [rightPlayer, setRightPlayer] = useState<Player | null>(null);

  const [isSplit, setIsSplit] = useState(true);
  const [loading, setLoading] = useState(false);

  const sortedPlayers = Array.isArray(players)
    ? [...players].sort((a, b) => (a.rank ?? Infinity) - (b.rank ?? Infinity))
    : [];

  const draftComplete = currentPickIndex >= rosterSettings.totalRounds * NUM_TEAMS;

  const numTeams = 12; // 🔁 eventually this can come from user input or settings
  const numRounds = rosterSettings.totalRounds;

  useEffect(() => {
    async function fetchDefaultPlayers() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/players?format=${draftConfig.adpFormatKey}`);
        const json: { data: Player[] } = await res.json();
        if (!Array.isArray(json.data)) throw new Error('Expected an array of players');
        setPlayers(json.data);

        const totalPicks = rosterSettings.totalRounds * NUM_TEAMS;
        const newDraftPlan: DraftPick[] = Array.from({ length: totalPicks }, (_, i) => {
          const round = Math.floor(i / NUM_TEAMS);
          const pickInRound = i % NUM_TEAMS;
          const teamIndex = getSnakedTeamIndex(round, pickInRound);
          return { pickIndex: i, round, pickInRound, teamIndex };
        });
        setDraftPlan(newDraftPlan);
      } catch (err) {
        console.error('❌ Failed to fetch default player data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDefaultPlayers();
  }, [draftConfig.adpFormatKey, rosterSettings.totalRounds]);

  const currentPick = draftPlan[currentPickIndex];
  const isUserTurn = draftStarted && userDraftSlot === currentPick?.teamIndex;

  const draftedPlayers = useMemo(
    () => draftPlan.filter(p => p.draftedPlayer).map(p => p.draftedPlayer!)
  , [draftPlan]);

  const userRoster = useMemo(() => {
    if (userDraftSlot == null) return [];
    return draftPlan
      .filter(p => p.teamIndex === userDraftSlot && p.draftedPlayer)
      .map(p => p.draftedPlayer!)
  }, [draftPlan, userDraftSlot]);

  useEffect(() => {
    if (!draftStarted || userDraftSlot == null || draftComplete) return;

    if (currentPick?.teamIndex !== userDraftSlot) {
      const timeout = setTimeout(() => {
        simulateCpuPick();
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [currentPickIndex, draftStarted, userDraftSlot]);

  function makePick(player: Player) {
    if (draftComplete) return;

    setDraftPlan(prev => prev.map((pick, i) =>
      i === currentPickIndex ? { ...pick, draftedPlayer: player } : pick
    ));

    setPlayers(prev => prev.filter(p => p.player_id !== player.player_id));
    setQueuePlayers(prev => prev.filter(p => p.player_id !== player.player_id));
    setCurrentPickIndex(prev => prev + 1);
  }

  function handleUserPick(player: Player) {
    if (!draftStarted || !isUserTurn || draftComplete) return;
    makePick(player);
  }

  async function simulateCpuPick() {
    if (!draftStarted || draftComplete || !currentPick) return;

    try {
      const payload = {
        draftPlan,
        teamIndex: currentPick.teamIndex,
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
            draftPlan={draftPlan} 
            claimedTeamIndex={userDraftSlot}
            onClaimTeam={setUserDraftSlot}
            numTeams={numTeams}
            numRounds={numRounds}
          />
        </div>

        <div className="h-[55vh] min-h-[300px] overflow-visible relative z-10">
          <LowerPanel
            players={sortedPlayers}
            draftedPlayers={draftedPlayers}
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
            rosterSettings={rosterSettings}
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
          rosterSettings={rosterSettings}
          setRosterSettings={setRosterSettings} 
          onConfirm={async (newConfig, newRosterSettings) => {
            const { positions, benchCount } = newRosterSettings;
            const totalPositions = Object.values(positions).reduce((sum, slot) => sum + slot.count, 0);
            const newTotalRounds = totalPositions + benchCount;

            setDraftConfig(newConfig); 
            setRosterSettings({ ...newRosterSettings, totalRounds: newTotalRounds });
          }}
          isPaidUser={true}
          isLoggedIn={true}
        />
      )}
    </div>
  );
}
