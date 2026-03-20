"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DragEndEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { toast } from "sonner";

import { Player } from "@/types/core/player";
import { useAuthContext } from "@/context/AuthContext";
import { initializeDraftPlan } from "@/utils/initializeDraftPlan";

import MockNavbar from "@/features/mock-draft/ui/navbar/MockNavbar";
import DraftBoard from "@/features/mock-draft/ui/draft-board/DraftBoard";
import LowerPanel from "@/features/mock-draft/lower-panel/LowerPanel";
import DraftSettingsModal from "@/features/mock-draft/ui/modals/DraftSettingsModal";
import KeeperModal from "@/features/mock-draft/ui/modals/KeeperModal";

import { useDraftConfig } from "@/features/mock-draft/hooks/useDraftConfig";
import { useDraftState } from "@/features/mock-draft/hooks/useDraftState";
import { useDraftSimulation } from "@/features/mock-draft/hooks/useDraftSimulation";
import { useDraftTimer } from "@/features/mock-draft/hooks/useDraftTimer";
import { useDraftUserActions } from "@/features/mock-draft/hooks/useDraftUserActions";
import { useCurrentPickState } from "@/features/mock-draft/hooks/useCurrentPickState";

export interface DraftPick {
  pickIndex: number;
  round: number;
  pickInRound: number;
  teamIndex: number;
  draftedPlayer?: Player;
}

export default function MockDraft() {
  const { user, isPaidUser } = useAuthContext();
  const isLoggedIn = Boolean(user);

  // NOTE: This is still local for now.
  // Next refactor step: replace with backend-owned create + hydrate via useDraftSession.
  const [draftId, setDraftId] = useState<string>(() => crypto.randomUUID());
  const [draftStarted, setDraftStarted] = useState(false);

  // Screen/UI state
  const [assignModeIndex, setAssignModeIndex] = useState<number | null>(null);
  const [userDraftSlot, setUserDraftSlot] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showKeeperModal, setShowKeeperModal] = useState(false);
  const [queueOrder, setQueueOrder] = useState<string[]>([]);
  const [timerDisabled, setTimerDisabled] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [, setDraftHistory] = useState<DraftPick[][]>([]);
  const [initialTimerDuration] = useState(120);

  const [keeperState, setKeeperState] = useState<{
    mode: "standard" | "keeper";
    keeperSetId: string | null;
  }>({
    mode: "standard",
    keeperSetId: null,
  });

  const handleExitAssignMode = useCallback(() => {
    setAssignModeIndex(null);
  }, []);

  // Draft config/settings
  const {
    draftConfig,
    setDraftConfig,
    rosterSettings,
    setRosterSettings,
    updateConfigWithTotalRounds,
  } = useDraftConfig();

  // Draft/player/rankings state
  const {
    draftPlan,
    setDraftPlan,
    scoredPlayers,
    adpPlayers,
    draftedPlayers,
    availablePlayers,
    rankingPlayers,
    setRankedPlayers,
    loadRankings,
    saveRankings,
    saveKeeperRankings,
    resetRankings,
    downloadRankings,
    canEditRankings,
    hasManualAssignments,
  } = useDraftState(
    draftConfig,
    rosterSettings,
    user,
    isPaidUser,
    keeperState,
    draftStarted,
  );

  const setDraftPlanWithHistory = useCallback(
    (nextPlan: DraftPick[]) => {
      setDraftHistory((prev) => [...prev, draftPlan]);
      setDraftPlan(nextPlan);
    },
    [draftPlan, setDraftPlan],
  );

  const numTeams = draftConfig.numTeams;
  const numRounds = rosterSettings.totalRounds;

  const { currentPick, draftComplete, isUserTurn } = useCurrentPickState(
    draftPlan,
    draftStarted,
    userDraftSlot,
  );

  const { simulateCpuPick, handleUserPick: simulateUserPick } =
    useDraftSimulation(
      draftId,
      draftPlan,
      setDraftPlanWithHistory,
      scoredPlayers,
      draftConfig,
      rosterSettings,
    );

  const userRoster = useMemo(() => {
    if (userDraftSlot == null) return [];
    return draftPlan
      .filter((pick) => pick.teamIndex === userDraftSlot && pick.draftedPlayer)
      .map((pick) => pick.draftedPlayer!);
  }, [draftPlan, userDraftSlot]);

  const queuedPlayers = useMemo(() => {
    const queuedIds = new Set(queueOrder);
    return availablePlayers.filter((player) => queuedIds.has(player.player_id));
  }, [availablePlayers, queueOrder]);

  const draftBoardByRound = useMemo<DraftPick[][]>(() => {
    return Array.from({ length: numRounds }, (_, roundIndex) =>
      draftPlan.slice(roundIndex * numTeams, (roundIndex + 1) * numTeams),
    );
  }, [draftPlan, numRounds, numTeams]);

  const handleSimulatedUserPick = useCallback(
    (player: Player) => {
      if (!currentPick) return;
      simulateUserPick(player, currentPick);
    },
    [currentPick, simulateUserPick],
  );

  const { timer, setTimer, isTicking, showPauseButton, showPlayButton } =
    useDraftTimer(
      draftStarted,
      draftComplete,
      isUserTurn,
      availablePlayers,
      handleSimulatedUserPick,
      timerDisabled,
      isPaused,
      initialTimerDuration,
    );

  const handleUserPick = useCallback(
    (player: Player) => {
      if (!currentPick) return;
      simulateUserPick(player, currentPick);
      setTimer(initialTimerDuration);
    },
    [currentPick, initialTimerDuration, setTimer, simulateUserPick],
  );

  const { handleManualAssignPlayer, handleStartDraft } = useDraftUserActions(
    draftPlan,
    setDraftPlan,
    assignModeIndex,
    setAssignModeIndex,
    setDraftStarted,
    userDraftSlot,
    draftStarted,
  );

  const startDraft = useCallback(() => {
    const nextDraftId = crypto.randomUUID();
    setDraftId(nextDraftId);
    setIsPaused(false);
    setTimer(initialTimerDuration);
    handleStartDraft();
  }, [handleStartDraft, initialTimerDuration, setTimer]);

  useEffect(() => {
    if (!draftStarted || userDraftSlot == null || draftComplete || isPaused) {
      return;
    }

    if (currentPick?.teamIndex !== userDraftSlot) {
      const timeout = setTimeout(() => {
        simulateCpuPick(currentPick);
      }, 800);

      return () => clearTimeout(timeout);
    }
  }, [
    currentPick,
    currentPick?.teamIndex,
    draftComplete,
    draftStarted,
    isPaused,
    simulateCpuPick,
    userDraftSlot,
  ]);

  const handleAddToQueue = useCallback((player: Player) => {
    setQueueOrder((prev) => {
      if (prev.includes(player.player_id)) return prev;
      return [...prev, player.player_id];
    });
  }, []);

  const handleRemoveFromQueue = useCallback((playerId: string) => {
    setQueueOrder((prev) => prev.filter((id) => id !== playerId));
  }, []);

  const handleQueueDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setQueueOrder((prev) => {
      const oldIndex = prev.findIndex((id) => id === active.id);
      const newIndex = prev.findIndex((id) => id === over.id);
      return arrayMove(prev, oldIndex, newIndex);
    });
  }, []);

  const handleSaveRankings = useCallback(async () => {
    if (keeperState.mode === "keeper") {
      if (!keeperState.keeperSetId) {
        toast.error(
          "❌ No keeper set selected. Please save or load a keeper set first.",
        );
        return;
      }

      await saveKeeperRankings(keeperState.keeperSetId);
      return;
    }

    await saveRankings();
  }, [
    keeperState.keeperSetId,
    keeperState.mode,
    saveKeeperRankings,
    saveRankings,
  ]);

  const handleUndoPick = useCallback(() => {
    if (userDraftSlot == null) {
      toast.error("❌ You must claim a team before undoing picks.");
      return;
    }

    const lastUserPickIndexFromEnd = [...draftPlan]
      .reverse()
      .findIndex(
        (pick) => pick.teamIndex === userDraftSlot && pick.draftedPlayer,
      );

    if (lastUserPickIndexFromEnd === -1) {
      toast.error("❌ No user picks to undo.");
      return;
    }

    const indexFromStart = draftPlan.length - 1 - lastUserPickIndexFromEnd;

    const nextPlan = draftPlan.map((pick, index) =>
      index >= indexFromStart ? { ...pick, draftedPlayer: undefined } : pick,
    );

    setDraftHistory((prev) => [...prev, draftPlan]);
    setDraftPlan(nextPlan);
    setTimer(initialTimerDuration);
    setIsPaused(false);

    const undonePick = draftPlan[indexFromStart];
    toast.success(
      `✅ Undo pick at ${undonePick.round + 1}.${undonePick.pickInRound + 1}.`,
    );
  }, [draftPlan, initialTimerDuration, setDraftPlan, setTimer, userDraftSlot]);

  const handleRestartDraft = useCallback(() => {
    const freshPlan = initializeDraftPlan(
      draftConfig.numTeams,
      rosterSettings.totalRounds,
    );

    setDraftId(crypto.randomUUID());
    setDraftPlan(freshPlan);
    setDraftHistory([]);
    setQueueOrder([]);
    setUserDraftSlot(null);
    setAssignModeIndex(null);
    setRankedPlayers([]);
    setDraftStarted(false);
    setIsPaused(false);
    setTimer(initialTimerDuration);

    toast.success("🔄 Draft restarted.");
  }, [
    draftConfig.numTeams,
    initialTimerDuration,
    rosterSettings.totalRounds,
    setDraftPlan,
    setRankedPlayers,
    setTimer,
  ]);

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
    isPaidUser,
    keeperState.keeperSetId,
    keeperState.mode,
    loadRankings,
    user,
  ]);

  return (
    <div className="w-full max-w-[1600px] mx-auto h-full">
      <div className="flex flex-col h-screen overflow-visible">
        <MockNavbar
          draftStarted={draftStarted}
          onStartDraft={startDraft}
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
              rankingPlayers={rankingPlayers}
              onDraftPlayer={handleUserPick}
              isUserTurn={isUserTurn}
              userRoster={userRoster}
              rosterSettings={rosterSettings}
              assignModeIndex={assignModeIndex}
              onManualAssignPlayer={handleManualAssignPlayer}
              onExitAssignMode={handleExitAssignMode}
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
              canEditRankings={canEditRankings}
              hasManualAssignments={hasManualAssignments}
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
        draftStarted={draftStarted}
        draftPlan={draftPlan}
        draftConfig={draftConfig}
        numTeams={numTeams}
        user={user}
        isPaidUser={isPaidUser}
        onLoadKeeperSet={({ draftPlan, adpFormatKey, keeperSetId }) => {
          setDraftId(crypto.randomUUID());
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
