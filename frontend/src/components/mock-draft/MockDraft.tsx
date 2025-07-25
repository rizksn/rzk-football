'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Player } from '@/types/core/player';
import type { DraftConfig } from '@/types/draft/config';
import { NUM_TEAMS, getSnakedTeamIndex } from '@/utils/constants';
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
  const { user } = useAuthContext();
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
  const [adpPlayers, setAdpPlayers] = useState<Player[]>([]);
  const [draftPlan, setDraftPlan] = useState<DraftPick[]>([]);
  const [scoredPlayers, setScoredPlayers] = useState<Player[]>([]);
  const [draftStarted, setDraftStarted] = useState(false);
  const [userDraftSlot, setUserDraftSlot] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const numRounds = rosterSettings.totalRounds;

  const currentPickIndex = draftPlan.findIndex(p => !p.draftedPlayer);
  const currentPick = draftPlan[currentPickIndex];
  const draftComplete = currentPickIndex === -1;
  const isUserTurn = draftStarted && userDraftSlot === currentPick?.teamIndex;


  useEffect(() => {
    async function fetchInitialData() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/draft-players?format=${draftConfig.adpFormatKey}`);
        const json = await res.json();

        if (!Array.isArray(json.adp) || !Array.isArray(json.scored)) {
          throw new Error('Expected adp and scored arrays from backend');
        }

        setAdpPlayers(json.adp);       // Fixed ADP order for UI
        setScoredPlayers(json.scored); // Used internally by backend for simulation

        const totalPicks = rosterSettings.totalRounds * NUM_TEAMS;
        const newDraftPlan: DraftPick[] = Array.from({ length: totalPicks }, (_, i) => {
          const round = Math.floor(i / NUM_TEAMS);
          const pickInRound = i % NUM_TEAMS;
          const teamIndex = getSnakedTeamIndex(round, pickInRound);
          return { pickIndex: i, round, pickInRound, teamIndex };
        });

        setDraftPlan(newDraftPlan);
      } catch (err) {
        console.error('❌ Failed to fetch draft data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchInitialData();
  }, [draftConfig.adpFormatKey, rosterSettings.totalRounds]);


  const draftedPlayers = useMemo(() =>
    draftPlan.filter(p => p.draftedPlayer).map(p => p.draftedPlayer!),
    [draftPlan]
  );

  const availablePlayers = useMemo(() => {
    const draftedIds = draftPlan
      .map(pick => pick.draftedPlayer?.player_id)
      .filter(Boolean);

    return adpPlayers
      .filter(p => !draftedIds.includes(p.player_id))
      .sort((a, b) => a.rank - b.rank); 
  }, [adpPlayers, draftPlan]);

  const userRoster = useMemo(() => {
    if (userDraftSlot == null) return [];
    return draftPlan
      .filter(p => p.teamIndex === userDraftSlot && p.draftedPlayer)
      .map(p => p.draftedPlayer!);
  }, [draftPlan, userDraftSlot]);

  const updateDraftPlanFromBackend = (newPlan: DraftPick[]) => {
    setDraftPlan(newPlan);
  };

  const simulateCpuPick = useCallback(async () => {
    if (!draftStarted || draftComplete || !currentPick) return;

    const payload = {
      draftPlan,
      scoredPlayers,
      teamIndex: currentPick.teamIndex,
      leagueFormat: draftConfig.leagueFormat,
      adpFormatKey: draftConfig.adpFormatKey,
      roster_config: {
        positions: rosterSettings.positions,
        bench_count: rosterSettings.benchCount,
        total_rounds: rosterSettings.totalRounds,
      },
      use_ai: draftConfig.useAI,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!Array.isArray(data?.draftPlan)) {
        console.error('❌ No draftPlan returned:', data);
        return;
      }

      updateDraftPlanFromBackend(data.draftPlan);
    } catch (err) {
      console.error('❌ Failed to simulate CPU pick:', err);
    }
  }, [draftPlan, scoredPlayers, draftStarted, draftComplete, currentPick, draftConfig, rosterSettings]);

  useEffect(() => {
    if (!draftStarted || userDraftSlot == null || draftComplete) return;
    if (currentPick?.teamIndex !== userDraftSlot) {
      const timeout = setTimeout(simulateCpuPick, 800);
      return () => clearTimeout(timeout);
    }
  }, [draftStarted, userDraftSlot, draftComplete, currentPick?.teamIndex, simulateCpuPick]);

  const handleUserPick = async (player: Player) => {
    if (!draftStarted || !isUserTurn || draftComplete) return;

    const payload = {
      draftPlan,
      scoredPlayers,
      teamIndex: currentPick.teamIndex,
      leagueFormat: draftConfig.leagueFormat,
      adpFormatKey: draftConfig.adpFormatKey,
      roster_config: {
        positions: rosterSettings.positions,
        bench_count: rosterSettings.benchCount,
        total_rounds: rosterSettings.totalRounds,
      },
      use_ai: false,
      selectedPlayerId: player.player_id,
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!Array.isArray(data?.draftPlan)) {
        console.error('❌ No draftPlan returned:', data);
        return;
      }

      updateDraftPlanFromBackend(data.draftPlan);
    } catch (err) {
      console.error('❌ Failed to process user pick:', err);
    }
  };

  const handleStartDraft = () => {
    setDraftStarted(true);
  };

  const draftBoardByRound = useMemo(() => {
    const result: DraftPick[][] = [];
    for (let i = 0; i < numRounds; i++) {
      result.push(draftPlan.slice(i * NUM_TEAMS, (i + 1) * NUM_TEAMS));
    }
    return result;
  }, [draftPlan, numRounds, NUM_TEAMS]);


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
            draftGrid={draftBoardByRound}
            claimedTeamIndex={userDraftSlot}
            onClaimTeam={setUserDraftSlot}
            numTeams={NUM_TEAMS}
            numRounds={numRounds}
          />
        </div>

        <div className="h-[55vh] min-h-[300px] overflow-visible relative z-10">
          <LowerPanel
            players={availablePlayers}
            draftedPlayers={draftedPlayers}
            isUserTurn={isUserTurn}
            onDraftPlayer={handleUserPick}
            userRoster={userRoster}
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
          isLoggedIn={isLoggedIn}
        />
      )}
    </div>
  );
}
