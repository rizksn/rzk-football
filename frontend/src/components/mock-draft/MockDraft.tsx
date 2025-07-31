"use client";

import { useState, useMemo } from "react";
import { Player } from "@/types/core/player";
import { useAuthContext } from "@/context/AuthContext";
import MockNavbar from "@/components/mock-draft/MockNavbar";
import DraftBoard from "@/components/mock-draft/draft-board/DraftBoard";
import LowerPanel from "@/components/mock-draft/lower-panel/LowerPanel";
import DraftSettingsModal from "@/components/mock-draft/modals/DraftSettingsModal";
import KeeperModal from "@/components/mock-draft/modals/KeeperModal";

import { NUM_TEAMS } from "@/utils/constants";
import { useDraftConfig } from "@/components/mock-draft/hooks/useDraftConfig";
import { useDraftState } from "@/components/mock-draft/hooks/useDraftState";
import { useDraftSimulation } from "@/components/mock-draft/hooks/useDraftSimulation";
import { useDraftTimer } from "@/components/mock-draft/hooks/useDraftTimer";
import { useDraftUserActions } from "@/components/mock-draft/hooks/useDraftUserActions";
import { useCurrentPickState } from "@/components/mock-draft/hooks/useCurrentPickState";
import { useRankingsManager } from "@/components/mock-draft/hooks/useRankingsManager";

export interface DraftPick {
  pickIndex: number;
  round: number;
  pickInRound: number;
  teamIndex: number;
  draftedPlayer?: Player;
}

export default function MockDraft() {
  // 🔐 Auth
  const { user, isPaidUser } = useAuthContext();
  const isLoggedIn = !!user;

  // ⚙️ Draft Config + Settings
  const {
    draftConfig,
    setDraftConfig,
    rosterSettings,
    setRosterSettings,
    updateConfigWithTotalRounds,
  } = useDraftConfig();

  // 🧠 Draft State (players, plan, fetch)
  const {
    draftPlan,
    setDraftPlan,
    scoredPlayers,
    adpPlayers,
    loading,
    draftedPlayers,
    availablePlayers,
    userRoster,
  } = useDraftState(draftConfig, rosterSettings, null, null); // 👈 temp null

  // 🔁 Rankings Manager (load/save/reset/download)
  const {
    rankedPlayers: savedRankings,
    setRankedPlayers,
    loadRankings,
    saveRankings,
    resetRankings,
    downloadRankings,
  } = useRankingsManager(user, draftConfig, adpPlayers, draftPlan);

  const finalRankingPlayers = useMemo(() => {
    const draftedIds = draftPlan
      .map((pick) => pick.draftedPlayer?.player_id)
      .filter(Boolean);

    if (savedRankings?.length) {
      return savedRankings.filter(
        (player) => !draftedIds.includes(player.player_id)
      );
    }

    const fallback = draftPlan.some((pick) => pick.draftedPlayer)
      ? availablePlayers
      : adpPlayers;

    return fallback.slice().sort((a, b) => a.rank - b.rank);
  }, [savedRankings, draftPlan, availablePlayers, adpPlayers]);

  // 📊 Derived Pick Info
  const [userDraftSlot, setUserDraftSlot] = useState<number | null>(null);
  const { currentPickIndex, currentPick, draftComplete, isUserTurn } =
    useCurrentPickState(draftPlan, true, userDraftSlot);

  // 🧠 Sim Engine
  const { simulateCpuPick, handleUserPick } = useDraftSimulation(
    draftPlan,
    setDraftPlan,
    scoredPlayers,
    draftConfig,
    rosterSettings
  );

  // ⏱ Timer State + Auto Pick
  const { timer, setTimer, isTicking, setIsTicking } = useDraftTimer(
    true,
    draftComplete,
    isUserTurn,
    availablePlayers,
    (player: Player) =>
      handleUserPick(player, currentPick, setIsTicking, setTimer)
  );

  // 🧠 UI Toggles
  const [assignModeIndex, setAssignModeIndex] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showKeeperModal, setShowKeeperModal] = useState(false);

  // 👤 User Actions
  const { handleManualAssignPlayer, handleStartDraft } = useDraftUserActions(
    draftPlan,
    setDraftPlan,
    assignModeIndex,
    setAssignModeIndex,
    () => {}, // we already start draft on load
    () => {} // timer handled externally
  );

  // 📊 Draft board shape
  const numRounds = rosterSettings.totalRounds;
  const draftBoardByRound: DraftPick[][] = [];
  for (let i = 0; i < numRounds; i++) {
    draftBoardByRound.push(draftPlan.slice(i * NUM_TEAMS, (i + 1) * NUM_TEAMS));
  }

  return (
    <div className="w-full max-w-[1600px] min-w-[1400px] mx-auto h-full">
      <div className="flex flex-col h-screen overflow-hidden">
        <MockNavbar
          draftStarted={true}
          onStartDraft={() => handleStartDraft()}
          onOpenSettings={() => setShowSettings(true)}
          timer={timer}
          setTimer={setTimer}
          isTicking={isTicking}
          setIsTicking={setIsTicking}
          onOpenKeeperModal={() => setShowKeeperModal(true)}
        />

        <div className="flex-1 overflow-y-auto relative z-0">
          <DraftBoard
            draftStarted={true}
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
            onDraftPlayer={(player) =>
              handleUserPick(player, currentPick, setIsTicking, setTimer)
            }
            userRoster={userRoster}
            rosterSettings={rosterSettings}
            assignModeIndex={assignModeIndex}
            onManualAssignPlayer={handleManualAssignPlayer}
            rankingPlayers={finalRankingPlayers}
            user={user}
            draftConfig={draftConfig}
            adpPlayers={adpPlayers}
            setRankedPlayers={setRankedPlayers}
            loadRankings={loadRankings}
            saveRankings={saveRankings}
            resetRankings={resetRankings}
            downloadRankings={downloadRankings}
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
          onConfirm={updateConfigWithTotalRounds}
          isPaidUser={isPaidUser}
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
