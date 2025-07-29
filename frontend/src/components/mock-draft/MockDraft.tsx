"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Player } from "@/types/core/player";
import type { DraftConfig } from "@/types/draft/config";
import { NUM_TEAMS, getSnakedTeamIndex } from "@/utils/constants";
import { API_BASE_URL, DEFAULT_ROSTER_SETTINGS } from "@/utils/config";

import { useAuthContext } from "@/context/AuthContext";

import MockNavbar from "@/components/mock-draft/MockNavbar";
import DraftBoard from "@/components/mock-draft/draft-board/DraftBoard";
import LowerPanel from "@/components/mock-draft/lower-panel/LowerPanel";
import DraftSettingsModal from "@/components/mock-draft/modals/DraftSettingsModal";
import KeeperModal from "@/components/mock-draft/modals/KeeperModal";

export interface DraftPick {
  pickIndex: number;
  round: number;
  pickInRound: number;
  teamIndex: number;
  draftedPlayer?: Player;
}

export default function MockDraft() {
  // 🔐 Auth & User
  const { user, isPaidUser } = useAuthContext();
  const isLoggedIn = !!user;

  // ⚙️ Draft Configuration
  const [draftConfig, setDraftConfig] = useState<DraftConfig>({
    adpFormatKey: "dynasty_1qb_1_ppr_sleeper",
    leagueFormat: "dynasty",
    qb_setting: "1qb",
    scoring: "1-ppr",
    platform: "sleeper",
    useAI: false,
  });
  const [rosterSettings, setRosterSettings] = useState(DEFAULT_ROSTER_SETTINGS);

  // 🖥 UI Modals & Toggles
  const [showSettings, setShowSettings] = useState(false);
  const [showKeeperModal, setShowKeeperModal] = useState(false);

  // 🧠 Draft Engine State
  const [draftPlan, setDraftPlan] = useState<DraftPick[]>([]); // Full pick plan
  const [scoredPlayers, setScoredPlayers] = useState<Player[]>([]); // AI-ranked
  const [adpPlayers, setAdpPlayers] = useState<Player[]>([]); // ADP order
  const [draftStarted, setDraftStarted] = useState(false); // Is the draft running?
  const [userDraftSlot, setUserDraftSlot] = useState<number | null>(null); // Claimed team
  const [loading, setLoading] = useState(false);

  // ⏱ Timer & Interaction Logic
  const [timer, setTimer] = useState(120); // Countdown timer
  const [isTicking, setIsTicking] = useState(false); // Is timer running?
  const [assignModeIndex, setAssignModeIndex] = useState<number | null>(null); // Manual assign index

  // 📊 Derived Values
  const numRounds = rosterSettings.totalRounds;
  const currentPickIndex = draftPlan.findIndex((p) => !p.draftedPlayer);
  const currentPick = draftPlan[currentPickIndex];
  const draftComplete = currentPickIndex === -1;
  const isUserTurn = draftStarted && userDraftSlot === currentPick?.teamIndex;

  useEffect(() => {
    if (!draftStarted || draftComplete) return;

    if (isUserTurn) {
      setTimer(120); // Reset timer at start of user's turn
      setIsTicking(true); // Start ticking
    } else {
      setIsTicking(false); // Pause if not user’s turn
    }
  }, [isUserTurn, draftStarted, draftComplete]);

  useEffect(() => {
    async function fetchInitialData() {
      try {
        setLoading(true);
        const res = await fetch(
          `${API_BASE_URL}/api/draft-players?format=${draftConfig.adpFormatKey}`
        );
        const json = await res.json();

        if (!Array.isArray(json.adp) || !Array.isArray(json.scored)) {
          throw new Error("Expected adp and scored arrays from backend");
        }

        setAdpPlayers(json.adp); // Fixed ADP order for UI
        setScoredPlayers(json.scored); // Used internally by backend for simulation

        const totalPicks = rosterSettings.totalRounds * NUM_TEAMS;
        const newDraftPlan: DraftPick[] = Array.from(
          { length: totalPicks },
          (_, i) => {
            const round = Math.floor(i / NUM_TEAMS);
            const pickInRound = i % NUM_TEAMS;
            const teamIndex = getSnakedTeamIndex(round, pickInRound);
            return { pickIndex: i, round, pickInRound, teamIndex };
          }
        );

        setDraftPlan(newDraftPlan);
      } catch (err) {
        console.error("❌ Failed to fetch draft data:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchInitialData();
  }, [draftConfig.adpFormatKey, rosterSettings.totalRounds]);

  const draftedPlayers = useMemo(
    () => draftPlan.filter((p) => p.draftedPlayer).map((p) => p.draftedPlayer!),
    [draftPlan]
  );

  const availablePlayers = useMemo(() => {
    const draftedIds = draftPlan
      .map((pick) => pick.draftedPlayer?.player_id)
      .filter(Boolean);

    return adpPlayers
      .filter((p) => !draftedIds.includes(p.player_id))
      .sort((a, b) => a.rank - b.rank);
  }, [adpPlayers, draftPlan]);

  const userRoster = useMemo(() => {
    if (userDraftSlot == null) return [];
    return draftPlan
      .filter((p) => p.teamIndex === userDraftSlot && p.draftedPlayer)
      .map((p) => p.draftedPlayer!);
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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!Array.isArray(data?.draftPlan)) {
        console.error("❌ No draftPlan returned:", data);
        return;
      }

      updateDraftPlanFromBackend(data.draftPlan);
    } catch (err) {
      console.error("❌ Failed to simulate CPU pick:", err);
    }
  }, [
    draftPlan,
    scoredPlayers,
    draftStarted,
    draftComplete,
    currentPick,
    draftConfig,
    rosterSettings,
  ]);

  useEffect(() => {
    if (!draftStarted || userDraftSlot == null || draftComplete) return;
    if (currentPick?.teamIndex !== userDraftSlot) {
      const timeout = setTimeout(simulateCpuPick, 800);
      return () => clearTimeout(timeout);
    }
  }, [
    draftStarted,
    userDraftSlot,
    draftComplete,
    currentPick?.teamIndex,
    simulateCpuPick,
  ]);

  useEffect(() => {
    if (!draftStarted || !isUserTurn || draftComplete) return;

    if (timer === 0) {
      console.warn("⏰ Timer expired — forcing pick for user...");

      const topQueuedPlayer = null; // Replace with actual logic if you have a queue
      const fallbackPlayer = availablePlayers[0];

      if (fallbackPlayer) {
        handleUserPick(fallbackPlayer);
      }

      setTimer(120);
    }
  }, [timer, draftStarted, isUserTurn, draftComplete, availablePlayers]);

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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!Array.isArray(data?.draftPlan)) {
        console.error("❌ No draftPlan returned:", data);
        return;
      }

      updateDraftPlanFromBackend(data.draftPlan);
      setIsTicking(false);
      setTimer(120);
    } catch (err) {
      console.error("❌ Failed to process user pick:", err);
    }
  };

  const handleManualAssignPlayer = (player: Player) => {
    if (assignModeIndex === null) return;

    const updated = [...draftPlan];
    updated[assignModeIndex] = {
      ...updated[assignModeIndex],
      draftedPlayer: player,
    };

    setDraftPlan(updated);
    setAssignModeIndex(null);
  };

  const handleStartDraft = () => {
    setDraftStarted(true);
    setIsTicking(true);
  };

  const draftBoardByRound = useMemo(() => {
    const result: DraftPick[][] = [];
    for (let i = 0; i < numRounds; i++) {
      result.push(draftPlan.slice(i * NUM_TEAMS, (i + 1) * NUM_TEAMS));
    }
    return result;
  }, [draftPlan, numRounds, NUM_TEAMS]);

  return (
    <div className="w-full max-w-[1600px] min-w-[1400px] mx-auto h-full">
      <div className="flex flex-col h-screen overflow-hidden">
        <MockNavbar
          draftStarted={draftStarted}
          onStartDraft={handleStartDraft}
          onOpenSettings={() => setShowSettings(true)}
          timer={timer}
          setTimer={setTimer}
          isTicking={isTicking}
          setIsTicking={setIsTicking}
          onOpenKeeperModal={() => setShowKeeperModal(true)}
        />

        <div className="flex-1 overflow-y-auto relative z-0">
          <DraftBoard
            draftStarted={draftStarted}
            draftGrid={draftBoardByRound}
            claimedTeamIndex={userDraftSlot}
            onClaimTeam={setUserDraftSlot}
            numTeams={NUM_TEAMS}
            numRounds={numRounds}
            assignModeIndex={assignModeIndex}
            setAssignModeIndex={setAssignModeIndex}
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
            assignModeIndex={assignModeIndex}
            onManualAssignPlayer={handleManualAssignPlayer}
          />
        </div>

        {draftComplete && (
          <div className="text-center mt-4 text-lg font-bold">
            ✅ Draft Complete
          </div>
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
            const totalPositions = Object.values(positions).reduce(
              (sum, slot) => sum + slot.count,
              0
            );
            const newTotalRounds = totalPositions + benchCount;

            setDraftConfig(newConfig);
            setRosterSettings({
              ...newRosterSettings,
              totalRounds: newTotalRounds,
            });
          }}
          isPaidUser={true}
          isLoggedIn={isLoggedIn}
        />
      )}

      <KeeperModal
        isOpen={showKeeperModal}
        onClose={() => setShowKeeperModal(false)}
        draftPlan={draftPlan}
        draftConfig={draftConfig}
        numTeams={NUM_TEAMS}
        user={user}
        isPaidUser={isPaidUser}
        onLoadKeeperSet={({ draftPlan, adpFormatKey }) => {
          setDraftPlan(draftPlan);
          setDraftConfig((prev) => ({
            ...prev,
            adpFormatKey,
          }));
        }}
      />
    </div>
  );
}
