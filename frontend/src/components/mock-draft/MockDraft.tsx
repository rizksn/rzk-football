"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Player } from "@/types/core/player";
import { useAuthContext } from "@/context/AuthContext";
import MockNavbar from "@/components/mock-draft/MockNavbar";
import DraftBoard from "@/components/mock-draft/draft-board/DraftBoard";
import LowerPanel from "@/components/mock-draft/lower-panel/LowerPanel";
import DraftSettingsModal from "@/components/mock-draft/modals/DraftSettingsModal";
import KeeperModal from "@/components/mock-draft/modals/KeeperModal";

import { useDraftConfig } from "@/components/mock-draft/hooks/useDraftConfig";
import { useDraftState } from "@/components/mock-draft/hooks/useDraftState";
import { useDraftSimulation } from "@/components/mock-draft/hooks/useDraftSimulation";
import { useDraftTimer } from "@/components/mock-draft/hooks/useDraftTimer";
import { useDraftUserActions } from "@/components/mock-draft/hooks/useDraftUserActions";
import { useCurrentPickState } from "@/components/mock-draft/hooks/useCurrentPickState";
import { initializeDraftPlan } from "@/utils/initializeDraftPlan";

import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { toast } from "sonner";

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

  // 🧠 Draft lifecycle state
  const [draftStarted, setDraftStarted] = useState(false);
  const [assignModeIndex, setAssignModeIndex] = useState<number | null>(null);
  const [userDraftSlot, setUserDraftSlot] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showKeeperModal, setShowKeeperModal] = useState(false);
  const [queueOrder, setQueueOrder] = useState<string[]>([]);
  const [timerDisabled, setTimerDisabled] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [draftHistory, setDraftHistory] = useState<DraftPick[][]>([]);
  const [initialTimerDuration, setInitialTimerDuration] = useState(120);

  const [keeperState, setKeeperState] = useState<{
    mode: "standard" | "keeper";
    keeperSetId: string | null;
  }>({
    mode: "standard",
    keeperSetId: null,
  });

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
    rankedPlayers,
    setRankedPlayers,
    loadRankings,
    saveRankings,
    saveKeeperRankings,
    resetRankings,
    downloadRankings,
    loading,
  } = useDraftState(draftConfig, rosterSettings, user, isPaidUser, keeperState);

  const setDraftPlanWithHistory = (newPlan: DraftPick[]) => {
    setDraftHistory((prev) => [...prev, draftPlan]);
    setDraftPlan(newPlan);
  };

  const numTeams = draftConfig.num_teams;

  const { currentPick, draftComplete, isUserTurn } = useCurrentPickState(
    draftPlan,
    draftStarted,
    userDraftSlot
  );

  const { simulateCpuPick, handleUserPick: baseHandleUserPick } =
    useDraftSimulation(
      draftPlan,
      setDraftPlanWithHistory,
      scoredPlayers,
      draftConfig,
      rosterSettings
    );

  const draftedPlayers = useMemo(() => {
    return draftPlan
      .map((pick) => pick.draftedPlayer)
      .filter((player): player is Player => !!player);
  }, [draftPlan]);

  const availablePlayers = useMemo(() => {
    const draftedIds = new Set(draftedPlayers.map((p) => p.player_id));
    return adpPlayers
      .filter((p) => !draftedIds.has(p.player_id))
      .sort((a, b) => a.rank - b.rank); // 🔥 Sort by ADP
  }, [adpPlayers, draftedPlayers]);

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

  const userRoster = useMemo(() => {
    if (userDraftSlot == null) return [];
    return draftPlan
      .filter((pick) => pick.teamIndex === userDraftSlot && pick.draftedPlayer)
      .map((pick) => pick.draftedPlayer!);
  }, [draftPlan, userDraftSlot]);

  const queuedPlayers = useMemo(() => {
    const idSet = new Set(queueOrder);
    return availablePlayers.filter((p) => idSet.has(p.player_id));
  }, [availablePlayers, queueOrder]);

  const handleUserPick = (player: Player, pick: DraftPick) => {
    baseHandleUserPick(player, pick);
    setTimer(initialTimerDuration);
  };

  const {
    timer,
    setTimer,
    isTicking,
    pause,
    resume,
    showPauseButton,
    showPlayButton,
  } = useDraftTimer(
    draftStarted,
    draftComplete,
    isUserTurn,
    availablePlayers,
    (player: Player) => baseHandleUserPick(player, currentPick),
    timerDisabled,
    isPaused,
    initialTimerDuration
  );

  const { handleManualAssignPlayer, handleStartDraft } = useDraftUserActions(
    draftPlan,
    setDraftPlan,
    assignModeIndex,
    setAssignModeIndex,
    setDraftStarted,
    userDraftSlot
  );

  // 🧠 Ensure CPU picks continue automatically
  useEffect(() => {
    if (!draftStarted || userDraftSlot == null || draftComplete || isPaused)
      return;
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
    isPaused,
    currentPick?.teamIndex,
    simulateCpuPick,
    currentPick,
  ]);

  const handleAddToQueue = (player: Player) => {
    setQueueOrder((prev) => {
      if (prev.includes(player.player_id)) return prev;
      return [...prev, player.player_id];
    });
  };

  const handleRemoveFromQueue = (playerId: string) => {
    setQueueOrder((prev) => prev.filter((id) => id !== playerId));
  };

  const lastLoadedKeeperId = useRef<string | null>(null);

  useEffect(() => {
    const shouldLoad =
      isPaidUser &&
      user &&
      keeperState.mode === "keeper" &&
      keeperState.keeperSetId &&
      keeperState.keeperSetId !== lastLoadedKeeperId.current;

    if (shouldLoad) {
      loadRankings().then(() => {
        lastLoadedKeeperId.current = keeperState.keeperSetId;
      });
    }
  }, [
    keeperState.mode,
    keeperState.keeperSetId,
    user,
    isPaidUser,
    loadRankings,
  ]);

  const numRounds = rosterSettings.totalRounds;
  const draftBoardByRound: DraftPick[][] = [];
  for (let i = 0; i < numRounds; i++) {
    draftBoardByRound.push(draftPlan.slice(i * numTeams, (i + 1) * numTeams));
  }

  const handleQueueDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setQueueOrder((prev) => {
      const oldIndex = prev.findIndex((id) => id === active.id);
      const newIndex = prev.findIndex((id) => id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const handleSaveRankings = async () => {
    if (keeperState.mode === "keeper") {
      if (!keeperState.keeperSetId) {
        toast.error(
          "❌ No keeper set selected. Please save or load a keeper set first."
        );
        return;
      }
      await saveKeeperRankings(keeperState.keeperSetId);
    } else {
      await saveRankings();
    }
  };

  const handleUndoPick = () => {
    if (!userDraftSlot) {
      toast.error("❌ You must claim a team before undoing picks.");
      return;
    }

    // Find the last pick made by the user
    const lastUserPickIndex = [...draftPlan]
      .reverse()
      .findIndex(
        (pick) => pick.teamIndex === userDraftSlot && pick.draftedPlayer
      );

    if (lastUserPickIndex === -1) {
      toast.error("❌ No user picks to undo.");
      return;
    }

    // Convert reversed index to actual index in draftPlan
    const indexFromStart = draftPlan.length - 1 - lastUserPickIndex;

    // Clear all picks from that index onward (including user pick and CPU picks after it)
    const newPlan = draftPlan.map((pick, i) =>
      i >= indexFromStart ? { ...pick, draftedPlayer: undefined } : pick
    );

    // Save current plan to history in case we want full rollback support later
    setDraftHistory((prev) => [...prev, draftPlan]);

    setDraftPlan(newPlan);
    setTimer(120); // reset timer
    setIsPaused(false); // resume draft if paused

    const undonePick = draftPlan[indexFromStart];
    toast.success(
      `✅ Undo pick at ${undonePick.round + 1}.${undonePick.pickInRound + 1}.`
    );
  };

  const handleRestartDraft = () => {
    if (!draftConfig || !rosterSettings) return;

    const freshPlan = initializeDraftPlan(
      draftConfig.num_teams,
      rosterSettings.totalRounds
    );

    setDraftPlan(freshPlan);
    setDraftHistory([]);
    setQueueOrder([]);
    setUserDraftSlot(null);
    setAssignModeIndex(null);
    setRankedPlayers([]);
    setDraftStarted(false);
    setIsPaused(false);
    setTimer(120);

    toast.success("🔄 Draft restarted.");
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto h-full">
      <div className="flex flex-col h-screen overflow-visible">
        <MockNavbar
          draftStarted={draftStarted}
          onStartDraft={() => handleStartDraft()}
          onOpenSettings={() => setShowSettings(true)}
          timer={timer}
          setTimer={setTimer}
          isTicking={isTicking}
          timerDisabled={timerDisabled}
          setTimerDisabled={setTimerDisabled}
          onOpenKeeperModal={() => setShowKeeperModal(true)}
          onPause={() => setIsPaused(true)}
          onResume={() => setIsPaused(false)}
          showPauseButton={showPauseButton}
          showPlayButton={showPlayButton}
          onUndoPick={handleUndoPick}
          onRestartDraft={handleRestartDraft}
        />

        <div className="flex-1 overflow-x-auto overflow-y-auto relative z-0">
          <div className="min-w-[1400px]">
            <DraftBoard
              draftStarted={draftStarted}
              draftGrid={draftBoardByRound}
              claimedTeamIndex={userDraftSlot}
              onClaimTeam={setUserDraftSlot}
              numTeams={numTeams}
              numRounds={numRounds}
              assignModeIndex={assignModeIndex}
              setAssignModeIndex={setAssignModeIndex}
            />
          </div>
        </div>

        <div className="h-[55vh] min-h-[300px] overflow-x-auto relative z-10">
          <div className="sm:min-w-[1400px]">
            <LowerPanel
              players={availablePlayers}
              draftedPlayers={draftedPlayers}
              isUserTurn={isUserTurn}
              onDraftPlayer={(player) => handleUserPick(player, currentPick)}
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
              onSaveRankings={handleSaveRankings}
              resetRankings={resetRankings}
              downloadRankings={downloadRankings}
              queuedPlayers={queuedPlayers}
              onAddToQueue={handleAddToQueue}
              onRemoveFromQueue={handleRemoveFromQueue}
              queueOrder={queueOrder}
              setQueueOrder={setQueueOrder}
              handleQueueDragEnd={handleQueueDragEnd}
              isPaidUser={isPaidUser}
              keeperState={keeperState}
              draftStarted={draftStarted}
              draftPlan={draftPlan}
              userDraftSlot={userDraftSlot}
            />
          </div>
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
          updateConfigWithTotalRounds={updateConfigWithTotalRounds}
          isPaidUser={isPaidUser}
          isLoggedIn={isLoggedIn}
        />
      )}

      <KeeperModal
        isOpen={showKeeperModal}
        onClose={() => setShowKeeperModal(false)}
        draftPlan={draftPlan}
        draftConfig={draftConfig}
        numTeams={numTeams}
        user={user}
        isPaidUser={isPaidUser}
        onLoadKeeperSet={({ draftPlan, adpFormatKey, keeperSetId }) => {
          setRankedPlayers([]);
          setDraftPlan(draftPlan);
          setDraftConfig((prev) => ({ ...prev, adpFormatKey }));
          setKeeperState({
            mode: "keeper",
            keeperSetId,
          });
        }}
        onSaveKeeperSet={(keeperSetId) => {
          setKeeperState({
            mode: "keeper",
            keeperSetId,
          });
        }}
      />
    </div>
  );
}
