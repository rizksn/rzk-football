"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { useAuthContext } from "@/context/AuthContext";

import { useMockDraftSetup } from "../hooks/useMockDraftSetup";
import { useMockDraftSession } from "../hooks/useMockDraftSession";
import { useMockDraftSelectors } from "../hooks/useMockDraftSelectors";

import { DraftSessionProvider } from "../session/session.context";
import {
  createDraftFromSetup,
  submitCpuPick,
} from "../session/session.commands";

import MockNavbar from "./navbar/MockNavbar";
import DraftBoard from "./draft-board/DraftBoard";
import DraftSettingsModal from "./modals/DraftSettingsModal";

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

  const isCreatingDraft = requestStatus === "creating";

  const [showSettings, setShowSettings] = useState(false);

  const [showKeeperModal, setShowKeeperModal] = useState(false);
  const [timer, setTimer] = useState(120);
  const [timerDisabled, setTimerDisabled] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const draftStarted = Boolean(snapshot);
  const isTicking = draftStarted && !timerDisabled && !isPaused;
  const showPauseButton = isTicking;
  const showPlayButton = !isTicking;

  const fallbackNumTeams = setup.roster.numTeams;
  const fallbackTotalRounds =
    Object.values(setup.roster.positions).reduce(
      (sum, count) => sum + count,
      0,
    ) + setup.roster.benchCount;

  const boardNumTeams = rosterConfig?.numTeams ?? fallbackNumTeams;

  const boardTotalRounds = rosterConfig
    ? Object.values(rosterConfig.positions).reduce(
        (sum, count) => sum + count,
        0,
      ) + rosterConfig.benchCount
    : fallbackTotalRounds;

  useEffect(() => {
    if (requestError) {
      toast.error(requestError);
    }
  }, [requestError]);

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
