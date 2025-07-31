"use client";

import { useState, useEffect, useMemo } from "react";
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

import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

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
    rankedPlayers, // 👈 add this
    setRankedPlayers,
    loadRankings,
    saveRankings,
    resetRankings,
    downloadRankings,
    loading,
    draftedPlayers,
    availablePlayers,
  } = useDraftState(draftConfig, rosterSettings, user);

  const [userRoster, setUserRoster] = useState<Player[]>([]);

  const finalRankingPlayers = useMemo(() => {
    const draftedIds = draftPlan
      .map((pick) => pick.draftedPlayer?.player_id)
      .filter(Boolean);
    if (rankedPlayers?.length) {
      return rankedPlayers.filter(
        (player) => !draftedIds.includes(player.player_id)
      );
    }
    const fallback = draftPlan.some((pick) => pick.draftedPlayer)
      ? availablePlayers
      : adpPlayers;
    return fallback.slice().sort((a, b) => a.rank - b.rank);
  }, [rankedPlayers, draftPlan, availablePlayers, adpPlayers]);

  const [queuedPlayers, setQueuedPlayers] = useState<Player[]>([]);
  const [queueOrder, setQueueOrder] = useState<string[]>([]);

  // 🧠 Draft lifecycle state
  const [draftStarted, setDraftStarted] = useState(false);
  const [userDraftSlot, setUserDraftSlot] = useState<number | null>(null);
  const [assignModeIndex, setAssignModeIndex] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showKeeperModal, setShowKeeperModal] = useState(false);

  const { currentPickIndex, currentPick, draftComplete, isUserTurn } =
    useCurrentPickState(draftPlan, draftStarted, userDraftSlot);

  const {
    simulateCpuPick,
    handleUserPick: baseHandleUserPick, // 👈 renaming here
  } = useDraftSimulation(
    draftPlan,
    setDraftPlan,
    scoredPlayers,
    draftConfig,
    rosterSettings
  );

  const handleUserPick = (
    player: Player,
    pick: DraftPick,
    setIsTicking: (val: boolean) => void,
    setTimer: (val: number) => void
  ) => {
    if (pick?.teamIndex === userDraftSlot) {
      setUserRoster((prev) => [...prev, player]);
    }

    baseHandleUserPick(player, pick, setIsTicking, setTimer);
  };

  const {
    timer,
    setTimer,
    isTicking,
    setIsTicking,
    pause,
    resume,
    showPauseButton,
    showPlayButton,
  } = useDraftTimer(
    draftStarted,
    draftComplete,
    isUserTurn,
    availablePlayers,
    (player: Player) =>
      handleUserPick(player, currentPick, setIsTicking, setTimer)
  );

  const { handleManualAssignPlayer, handleStartDraft } = useDraftUserActions(
    draftPlan,
    setDraftPlan,
    assignModeIndex,
    setAssignModeIndex,
    setDraftStarted,
    setIsTicking,
    userDraftSlot,
    setUserRoster
  );

  // 🧠 Ensure CPU picks continue automatically
  useEffect(() => {
    if (!draftStarted || userDraftSlot == null || draftComplete) return;
    if (currentPick?.teamIndex !== userDraftSlot) {
      const timeout = setTimeout(() => {
        simulateCpuPick(currentPick);
      }, 800);
      return () => clearTimeout(timeout);
    }
  }, [
    draftStarted,
    userDraftSlot,
    draftComplete,
    currentPick?.teamIndex,
    simulateCpuPick,
    currentPick,
  ]);

  const handleAddToQueue = (player: Player) => {
    if (!queuedPlayers.some((p) => p.player_id === player.player_id)) {
      setQueuedPlayers((prev) => [...prev, player]);
    }
  };

  const handleRemoveFromQueue = (playerId: string) => {
    setQueuedPlayers((prev) => prev.filter((p) => p.player_id !== playerId));
  };

  useEffect(() => {
    if (!draftStarted || draftComplete) return;

    if (isUserTurn) {
      setIsTicking(true);
    } else {
      setIsTicking(false);
    }
  }, [isUserTurn, draftStarted, draftComplete]);

  useEffect(() => {
    if (queuedPlayers.length === 0) return;

    const draftedIds = draftPlan
      .map((pick) => pick.draftedPlayer?.player_id)
      .filter(Boolean);

    const removed = queuedPlayers.filter((p) =>
      draftedIds.includes(p.player_id)
    );

    if (removed.length > 0) {
      console.log(
        "Removed drafted players from queue:",
        removed.map((p) => p.full_name)
      );
      setQueuedPlayers((prev) =>
        prev.filter((p) => !draftedIds.includes(p.player_id))
      );
    }
  }, [draftPlan]);

  useEffect(() => {
    setQueueOrder(queuedPlayers.map((p) => p.player_id));
  }, [queuedPlayers]);

  const numRounds = rosterSettings.totalRounds;
  const draftBoardByRound: DraftPick[][] = [];
  for (let i = 0; i < numRounds; i++) {
    draftBoardByRound.push(draftPlan.slice(i * NUM_TEAMS, (i + 1) * NUM_TEAMS));
  }

  const handleQueueDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setQueueOrder((prev) => {
      const oldIndex = prev.indexOf(active.id as string);
      const newIndex = prev.indexOf(over.id as string);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  return (
    <div className="w-full max-w-[1600px] min-w-[1400px] mx-auto h-full">
      <div className="flex flex-col h-screen overflow-hidden">
        <MockNavbar
          draftStarted={draftStarted}
          onStartDraft={() => handleStartDraft()}
          onOpenSettings={() => setShowSettings(true)}
          timer={timer}
          setTimer={setTimer}
          isTicking={isTicking}
          onOpenKeeperModal={() => setShowKeeperModal(true)}
          onPause={pause}
          onResume={resume}
          showPauseButton={showPauseButton}
          showPlayButton={showPlayButton}
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
            queuedPlayers={queuedPlayers}
            onAddToQueue={handleAddToQueue}
            onRemoveFromQueue={handleRemoveFromQueue}
            queueOrder={queueOrder}
            setQueueOrder={setQueueOrder}
            handleQueueDragEnd={handleQueueDragEnd}
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
          setDraftConfig((prev) => ({ ...prev, adpFormatKey }));
        }}
      />
    </div>
  );
}
