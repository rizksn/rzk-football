"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { useAuthContext } from "@/context/AuthContext";

import { fetchAdpPlayers } from "../api/adp";
import type { AdpPlayerResponseDto } from "../api/dto";
import { useMockDraftSelectors } from "../hooks/useMockDraftSelectors";
import { useMockDraftSession } from "../hooks/useMockDraftSession";
import { useMockDraftSetup } from "../hooks/useMockDraftSetup";
import { useMockDraftWorkspace } from "../hooks/useMockDraftWorkspace";
import {
  buildAdpFormatKey,
  getTotalRounds,
  normalizeRosterForLeague,
} from "../setup/setup.helpers";
import { DraftSessionProvider } from "../session/session.context";
import {
  createDraftFromSetup,
  submitCpuPick,
  submitUserPick,
} from "../session/session.commands";

import DraftBoard from "./draft-board/DraftBoard";
import LowerPanel from "./lower-panel/LowerPanel";
import DraftSettingsModal from "./modals/DraftSettingsModal";
import MockNavbar from "./navbar/MockNavbar";

function MockDraftScreenContent() {
  const { user, isPaidUser } = useAuthContext();
  const isLoggedIn = Boolean(user);

  const { setup, updateMetadata, updateLeague, updateRoster, updateUser } =
    useMockDraftSetup();

  const { dispatch } = useMockDraftSession();

  const {
    snapshot,
    requestError,
    requestStatus,
    rosterConfig,
    draftPlan,
    currentPickIndex,
  } = useMockDraftSelectors();

  const {
    workspace,
    setLowerPanelTab,
    setMobileSlideIndex,
    setSearchText,
    setPositionFilter,
    setTeamFilter,
    setSort,
    setLeftDisplayPlayer,
    setRightDisplayPlayer,
    addToQueue,
    removeFromQueue,
    setQueuePlayerIds,
    setRankingsPlayerIds,
    setRankingsLoading,
    setRankingsSaving,
    setRankingsError,
    resetWorkspace,
  } = useMockDraftWorkspace();

  const isCreatingDraft = requestStatus === "creating";
  const draftStarted = Boolean(snapshot);

  const [showSettings, setShowSettings] = useState(false);
  const [showKeeperModal, setShowKeeperModal] = useState(false);
  const [timer, setTimer] = useState(120);
  const [timerDisabled, setTimerDisabled] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [adpPlayers, setAdpPlayers] = useState<AdpPlayerResponseDto[]>([]);
  const [isLoadingAdpPlayers, setIsLoadingAdpPlayers] = useState(false);
  const [adpPlayersError, setAdpPlayersError] = useState<string | null>(null);

  const adpFormatKey = useMemo(() => {
    return buildAdpFormatKey(setup.league);
  }, [setup.league]);

  const isTicking = draftStarted && !timerDisabled && !isPaused;
  const showPauseButton = isTicking;
  const showPlayButton = !isTicking;

  const previewNumTeams = setup.roster.numTeams;
  const previewTotalRounds = getTotalRounds(setup.roster);

  const boardNumTeams = rosterConfig?.numTeams ?? previewNumTeams;
  const boardTotalRounds = rosterConfig
    ? getTotalRounds(rosterConfig)
    : previewTotalRounds;

  useEffect(() => {
    if (requestError) {
      toast.error(requestError);
    }
  }, [requestError]);

  useEffect(() => {
    let isCancelled = false;

    async function loadAdpPlayers() {
      try {
        setIsLoadingAdpPlayers(true);
        setAdpPlayersError(null);

        const response = await fetchAdpPlayers(adpFormatKey);

        if (isCancelled) return;

        setAdpPlayers(response.players);
      } catch (error) {
        if (isCancelled) return;

        const message =
          error instanceof Error ? error.message : "Failed to load ADP players";

        setAdpPlayers([]);
        setAdpPlayersError(message);
        toast.error(message);
      } finally {
        if (!isCancelled) {
          setIsLoadingAdpPlayers(false);
        }
      }
    }

    void loadAdpPlayers();

    return () => {
      isCancelled = true;
    };
  }, [adpFormatKey]);

  const availablePlayers = useMemo(() => {
    const draftedIds = new Set(
      draftPlan
        .map((pick) => pick.draftedPlayer?.playerId)
        .filter((playerId): playerId is string => Boolean(playerId)),
    );

    return adpPlayers.filter((player) => !draftedIds.has(player.playerId));
  }, [adpPlayers, draftPlan]);

  const userRoster = useMemo(() => {
    const userTeamIndex = setup.user.userTeamIndex;

    return draftPlan
      .filter((pick) => pick.teamIndex === userTeamIndex && pick.draftedPlayer)
      .map((pick) => pick.draftedPlayer!);
  }, [draftPlan, setup.user.userTeamIndex]);

  const handleDraftPlayer = useCallback(
    async (playerId: string) => {
      if (!snapshot) {
        toast.error("Draft has not started yet.");
        return;
      }

      try {
        await submitUserPick(dispatch, snapshot.draft.draftId, playerId);
      } catch (error) {
        console.error("Failed to submit user pick", error);
        toast.error("Failed to draft player.");
      }
    },
    [dispatch, snapshot],
  );

  const handleQueueDragEnd = useCallback(() => {
    toast.info("Queue drag not wired yet.");
  }, []);

  const handleLoadRankings = useCallback(async () => {
    toast.info("Load rankings not wired yet.");
  }, []);

  const handleSaveRankings = useCallback(async () => {
    toast.info("Save rankings not wired yet.");
  }, []);

  const handleResetRankings = useCallback(() => {
    resetWorkspace();
    toast.info("Rankings reset not wired yet.");
  }, [resetWorkspace]);

  const handleOpenSettings = useCallback(() => {
    setShowSettings(true);
  }, []);

  const handleCloseSettings = useCallback(() => {
    setShowSettings(false);
  }, []);

  const handleStartDraft = useCallback(async () => {
    if (!isLoggedIn) {
      toast.error("Please sign in before creating a draft.");
      return;
    }

    if (draftStarted || isCreatingDraft) {
      return;
    }

    try {
      const response = await createDraftFromSetup(dispatch, setup);
      toast.success(`Draft created: ${response.draft.draftId}`);
    } catch (error) {
      console.error("Failed to create draft", error);
    }
  }, [dispatch, draftStarted, isCreatingDraft, isLoggedIn, setup]);

  return (
    <div className="mx-auto min-h-screen max-w-7xl p-6 text-white">
      <MockNavbar
        draftStarted={draftStarted}
        onStartDraft={handleStartDraft}
        isCreatingDraft={isCreatingDraft}
        onOpenSettings={handleOpenSettings}
        timer={timer}
        setTimer={setTimer}
        isTicking={isTicking}
        onOpenKeeperModal={() => setShowKeeperModal(true)}
        onPause={() => setIsPaused(true)}
        onResume={() => setIsPaused(false)}
        showPauseButton={showPauseButton}
        showPlayButton={showPlayButton}
        timerDisabled={timerDisabled}
        setTimerDisabled={setTimerDisabled}
        onUndoPick={() => toast.info("Undo pick not wired yet.")}
        onRestartDraft={() => toast.info("Restart draft not wired yet.")}
      />

      <div className="mb-6 overflow-x-auto rounded-xl border border-slate-700 bg-slate-900 p-4">
        <DraftBoard
          draftPlan={draftPlan}
          numTeams={boardNumTeams}
          totalRounds={boardTotalRounds}
          currentPickIndex={currentPickIndex}
          claimedTeamIndex={setup.user.userTeamIndex}
          onClaimTeam={(teamIndex) => updateUser({ userTeamIndex: teamIndex })}
          draftStarted={draftStarted}
        />
      </div>

      <LowerPanel
        availablePlayers={availablePlayers}
        draftPlan={draftPlan}
        rosterConfig={rosterConfig}
        userRoster={userRoster}
        draftStarted={draftStarted}
        workspace={workspace}
        onDraftPlayer={handleDraftPlayer}
        onSetLowerPanelTab={setLowerPanelTab}
        onSetMobileSlideIndex={setMobileSlideIndex}
        onSetSearchText={setSearchText}
        onSetPositionFilter={setPositionFilter}
        onSetTeamFilter={setTeamFilter}
        onSetSort={setSort}
        onSetLeftDisplayPlayer={setLeftDisplayPlayer}
        onSetRightDisplayPlayer={setRightDisplayPlayer}
        onAddToQueue={addToQueue}
        onRemoveFromQueue={removeFromQueue}
        onQueueDragEnd={handleQueueDragEnd}
        onLoadRankings={handleLoadRankings}
        onSaveRankings={handleSaveRankings}
        onResetRankings={handleResetRankings}
      />

      <DraftSettingsModal
        isOpen={showSettings}
        onClose={handleCloseSettings}
        setup={setup}
        updateMetadata={updateMetadata}
        updateLeague={updateLeague}
        updateRoster={updateRoster}
        isPaidUser={isPaidUser}
        isLoggedIn={isLoggedIn}
      />
    </div>
  );
}

export default function MockDraftScreen() {
  return (
    <DraftSessionProvider>
      <MockDraftScreenContent />
    </DraftSessionProvider>
  );
}
