"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { useAuthContext } from "@/context/AuthContext";

import { useMockDraftSetup } from "../../hooks/useMockDraftSetup";
import { useMockDraftSession } from "../../hooks/useMockDraftSession";
import { useMockDraftSelectors } from "../../hooks/useMockDraftSelectors";

import {
  buildAdpFormatKey,
  buildCreateDraftRequestDto,
  normalizeRosterForLeague,
} from "../../setup/setup.helpers";

import { DraftSessionProvider } from "../../session/session.context";
import {
  clearSessionError,
  createDraftFromSetup,
  hydrateDraftSession,
  resetSession,
} from "../../session/session.commands";

import DraftSettingsModal from "./../modals/DraftSettingsModal";

function getTotalRounds(
  roster: ReturnType<typeof normalizeRosterForLeague>,
): number {
  const startingSlots = Object.values(roster.positions).reduce(
    (sum, count) => sum + count,
    0,
  );

  return startingSlots + roster.benchCount;
}

function MockDraftScreenContent() {
  const { user, isPaidUser } = useAuthContext();
  const isLoggedIn = Boolean(user);

  const { setup, replaceSetup, resetSetup } = useMockDraftSetup();
  const { dispatch } = useMockDraftSession();

  const {
    snapshot,
    requestError,
    requestStatus,
    draft,
    draftId,
    draftStatus,
    rosterConfig,
    scoredPlayers,
    availableScoredPlayers,
    draftPlan,
    currentPick,
    currentPickIndex,
    draftedPlayers,
    totalPickCount,
    publishedPickCount,
    isDraftComplete,
  } = useMockDraftSelectors();

  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    if (requestError) {
      toast.error(requestError);
    }
  }, [requestError]);

  const previewPayload = useMemo(
    () => buildCreateDraftRequestDto(setup, "preview-request-id"),
    [setup],
  );

  const handleOpenSettings = useCallback(() => {
    setShowSettings(true);
  }, []);

  const handleCloseSettings = useCallback(() => {
    setShowSettings(false);
  }, []);

  const handleCreateDraft = useCallback(async () => {
    if (!isLoggedIn) {
      toast.error("Please sign in before creating a draft.");
      return;
    }

    try {
      const response = await createDraftFromSetup(dispatch, setup);
      toast.success(`Draft created: ${response.draft.draftId}`);
    } catch (error) {
      console.error("Failed to create draft", error);
    }
  }, [dispatch, isLoggedIn, setup]);

  const handleReloadDraft = useCallback(async () => {
    if (!draftId) {
      toast.error("No draft exists yet.");
      return;
    }

    try {
      await hydrateDraftSession(dispatch, draftId);
      toast.success("Draft state reloaded from backend.");
    } catch (error) {
      console.error("Failed to hydrate draft state", error);
    }
  }, [dispatch, draftId]);

  const handleResetSession = useCallback(() => {
    resetSession(dispatch);
    toast.success("Active draft session cleared from the screen.");
  }, [dispatch]);

  const handleClearError = useCallback(() => {
    clearSessionError(dispatch);
  }, [dispatch]);

  const normalizedRoster = useMemo(
    () => normalizeRosterForLeague(setup.roster, setup.league),
    [setup.roster, setup.league],
  );

  const totalRounds = useMemo(
    () => getTotalRounds(normalizedRoster),
    [normalizedRoster],
  );

  return (
    <div className="mx-auto min-h-screen max-w-7xl p-6 text-white">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Mock Draft</h1>
        <p className="mt-2 text-slate-400">
          Rebuilt around frontend setup state before creation and backend
          session truth after creation.
        </p>
      </header>

      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={handleOpenSettings}
          className="rounded-md border border-slate-600 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-800"
        >
          Open Settings
        </button>

        <button
          onClick={handleCreateDraft}
          disabled={requestStatus === "creating"}
          className="rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {requestStatus === "creating" ? "Creating Draft..." : "Create Draft"}
        </button>

        <button
          onClick={handleReloadDraft}
          disabled={!draftId || requestStatus === "hydrating"}
          className="rounded-md border border-slate-600 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {requestStatus === "hydrating"
            ? "Reloading..."
            : "Reload Draft State"}
        </button>

        <button
          onClick={resetSetup}
          className="rounded-md border border-slate-600 px-4 py-2 text-sm font-medium text-slate-100 hover:bg-slate-800"
        >
          Reset Setup
        </button>

        <button
          onClick={handleResetSession}
          className="rounded-md border border-red-700 px-4 py-2 text-sm font-medium text-red-300 hover:bg-red-950/40"
        >
          Clear Active Session
        </button>

        {requestError && (
          <button
            onClick={handleClearError}
            className="rounded-md border border-amber-700 px-4 py-2 text-sm font-medium text-amber-300 hover:bg-amber-950/40"
          >
            Clear Error
          </button>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <section className="rounded-xl border border-slate-700 bg-slate-900 p-5">
          <h2 className="mb-4 text-lg font-semibold">Auth</h2>

          <div className="space-y-2 text-sm text-slate-300">
            <div>
              <span className="font-medium text-white">Logged In:</span>{" "}
              {isLoggedIn ? "Yes" : "No"}
            </div>
            <div>
              <span className="font-medium text-white">Premium:</span>{" "}
              {isPaidUser ? "Yes" : "No"}
            </div>
            <div className="break-all">
              <span className="font-medium text-white">User:</span>{" "}
              {user?.email ?? "No authenticated user"}
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-700 bg-slate-900 p-5">
          <h2 className="mb-4 text-lg font-semibold">Setup Summary</h2>

          <div className="space-y-2 text-sm text-slate-300">
            <div>
              <span className="font-medium text-white">Format:</span>{" "}
              {setup.league.format}
            </div>
            <div>
              <span className="font-medium text-white">QB Type:</span>{" "}
              {setup.league.qbType}
            </div>
            <div>
              <span className="font-medium text-white">Scoring:</span>{" "}
              {setup.league.scoring}
            </div>
            <div>
              <span className="font-medium text-white">Platform:</span>{" "}
              {setup.league.platform}
            </div>
            <div>
              <span className="font-medium text-white">ADP Key:</span>{" "}
              <span className="break-all text-blue-300">
                {buildAdpFormatKey(setup.league)}
              </span>
            </div>
            <div>
              <span className="font-medium text-white">Teams:</span>{" "}
              {normalizedRoster.numTeams}
            </div>
            <div>
              <span className="font-medium text-white">Bench:</span>{" "}
              {normalizedRoster.benchCount}
            </div>
            <div>
              <span className="font-medium text-white">Total Rounds:</span>{" "}
              {totalRounds}
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-slate-700 bg-slate-900 p-5">
          <h2 className="mb-4 text-lg font-semibold">Session Summary</h2>

          <div className="space-y-2 text-sm text-slate-300">
            <div>
              <span className="font-medium text-white">Draft Exists:</span>{" "}
              {snapshot ? "Yes" : "No"}
            </div>
            <div>
              <span className="font-medium text-white">Draft ID:</span>{" "}
              <span className="break-all">{draftId ?? "—"}</span>
            </div>
            <div>
              <span className="font-medium text-white">Status:</span>{" "}
              {draftStatus ?? "—"}
            </div>
            <div>
              <span className="font-medium text-white">Published Picks:</span>{" "}
              {publishedPickCount}
            </div>
            <div>
              <span className="font-medium text-white">Total Picks:</span>{" "}
              {totalPickCount}
            </div>
            <div>
              <span className="font-medium text-white">
                Current Pick Index:
              </span>{" "}
              {currentPickIndex ?? "—"}
            </div>
            <div>
              <span className="font-medium text-white">Scored Players:</span>{" "}
              {scoredPlayers.length}
            </div>
            <div>
              <span className="font-medium text-white">Available Players:</span>{" "}
              {availableScoredPlayers.length}
            </div>
            <div>
              <span className="font-medium text-white">Draft Complete:</span>{" "}
              {isDraftComplete ? "Yes" : "No"}
            </div>
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-slate-700 bg-slate-900 p-5">
          <h2 className="mb-4 text-lg font-semibold">
            Create Draft Payload Preview
          </h2>
          <pre className="overflow-x-auto rounded-md bg-slate-950 p-4 text-xs text-slate-300">
            {JSON.stringify(previewPayload, null, 2)}
          </pre>
        </section>

        <section className="rounded-xl border border-slate-700 bg-slate-900 p-5">
          <h2 className="mb-4 text-lg font-semibold">Current Pick</h2>

          {!currentPick ? (
            <p className="text-sm text-slate-400">
              No active current pick yet. Create or reload a draft first.
            </p>
          ) : (
            <div className="space-y-2 text-sm text-slate-300">
              <div>
                <span className="font-medium text-white">Pick Index:</span>{" "}
                {currentPick.pickIndex}
              </div>
              <div>
                <span className="font-medium text-white">Round:</span>{" "}
                {currentPick.round}
              </div>
              <div>
                <span className="font-medium text-white">Pick In Round:</span>{" "}
                {currentPick.pickInRound}
              </div>
              <div>
                <span className="font-medium text-white">Team Index:</span>{" "}
                {currentPick.teamIndex}
              </div>
            </div>
          )}
        </section>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-slate-700 bg-slate-900 p-5">
          <h2 className="mb-4 text-lg font-semibold">Published Picks</h2>

          {draftedPlayers.length === 0 ? (
            <p className="text-sm text-slate-400">No published picks yet.</p>
          ) : (
            <div className="max-h-[360px] overflow-y-auto rounded-md border border-slate-700">
              <table className="min-w-full text-left text-sm">
                <thead className="sticky top-0 bg-slate-800 text-slate-200">
                  <tr>
                    <th className="px-3 py-2">#</th>
                    <th className="px-3 py-2">Player</th>
                    <th className="px-3 py-2">Pos</th>
                    <th className="px-3 py-2">Team</th>
                  </tr>
                </thead>
                <tbody>
                  {draftedPlayers.map((player, index) => (
                    <tr
                      key={`${player.playerId}-${index}`}
                      className="border-t border-slate-800"
                    >
                      <td className="px-3 py-2 text-slate-400">{index}</td>
                      <td className="px-3 py-2">{player.fullName}</td>
                      <td className="px-3 py-2">{player.position}</td>
                      <td className="px-3 py-2">{player.team}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-slate-700 bg-slate-900 p-5">
          <h2 className="mb-4 text-lg font-semibold">Draft Plan Snapshot</h2>

          {draftPlan.length === 0 ? (
            <p className="text-sm text-slate-400">No draft plan loaded yet.</p>
          ) : (
            <pre className="max-h-[360px] overflow-auto rounded-md bg-slate-950 p-4 text-xs text-slate-300">
              {JSON.stringify(draftPlan, null, 2)}
            </pre>
          )}
        </section>
      </div>

      <div className="mt-6 rounded-xl border border-slate-700 bg-slate-900 p-5">
        <h2 className="mb-4 text-lg font-semibold">Backend Snapshot</h2>

        {!snapshot ? (
          <p className="text-sm text-slate-400">
            No active backend snapshot yet.
          </p>
        ) : (
          <pre className="overflow-auto rounded-md bg-slate-950 p-4 text-xs text-slate-300">
            {JSON.stringify(
              {
                draft,
                rosterConfig,
                currentPickIndex,
                publishedPickCount,
              },
              null,
              2,
            )}
          </pre>
        )}
      </div>

      <DraftSettingsModal
        isOpen={showSettings}
        onClose={handleCloseSettings}
        initialSetup={setup}
        onConfirm={replaceSetup}
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
