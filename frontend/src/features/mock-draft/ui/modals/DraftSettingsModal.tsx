"use client";

import { Dialog } from "@headlessui/react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  buildAdpFormatKey,
  getTotalRounds,
  normalizeRosterForLeague,
} from "../../setup/setup.helpers";
import {
  getFormatOptions,
  getPlatformOptions,
  getQbTypeOptions,
  getScoringOptions,
  normalizeLeagueSelection,
} from "../../setup/setup.options";
import type {
  DraftSetupFormat,
  DraftSetupLeagueState,
  DraftSetupMetadataState,
  DraftSetupQbType,
  DraftSetupRosterPositions,
  DraftSetupRosterState,
} from "../../setup/setup.types";
import type {
  ActiveTab,
  DraftSettingsModalProps,
} from "./DraftSettingsModal.types";

export default function DraftSettingsModal({
  isOpen,
  onClose,
  setup,
  updateMetadata,
  updateLeague,
  updateRoster,
  isPaidUser,
  isLoggedIn,
}: DraftSettingsModalProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("league");

  useEffect(() => {
    if (isOpen) {
      setActiveTab("league");
    }
  }, [isOpen]);

  const controlsLocked = !isPaidUser;

  const formatOptions = useMemo(() => getFormatOptions(), []);

  const qbTypeOptions = useMemo(
    () => getQbTypeOptions(setup.league.format),
    [setup.league.format],
  );

  const scoringOptions = useMemo(
    () => getScoringOptions(setup.league.format, setup.league.qbType),
    [setup.league.format, setup.league.qbType],
  );

  const platformOptions = useMemo(
    () =>
      getPlatformOptions(
        setup.league.format,
        setup.league.qbType,
        setup.league.scoring,
      ),
    [setup.league.format, setup.league.qbType, setup.league.scoring],
  );

  const totalRounds = useMemo(
    () => getTotalRounds(setup.roster),
    [setup.roster],
  );

  const handleLeagueChange = <K extends keyof DraftSetupLeagueState>(
    key: K,
    value: DraftSetupLeagueState[K],
  ) => {
    if (controlsLocked) {
      toast.error(
        isLoggedIn
          ? "Upgrade to premium to change league settings."
          : "Sign in and upgrade to premium to change league settings.",
      );
      return;
    }

    const nextLeague = normalizeLeagueSelection({
      ...setup.league,
      [key]: value,
    });

    updateLeague(nextLeague);
  };

  const handleRosterChange = <K extends keyof DraftSetupRosterState>(
    key: K,
    value: DraftSetupRosterState[K],
  ) => {
    if (controlsLocked) {
      toast.error(
        isLoggedIn
          ? "Upgrade to premium to change roster settings."
          : "Sign in and upgrade to premium to change roster settings.",
      );
      return;
    }

    const nextRoster = normalizeRosterForLeague(
      {
        ...setup.roster,
        [key]: value,
      },
      setup.league,
    );

    updateRoster(nextRoster);
  };

  const handleRosterPositionChange = <
    K extends keyof DraftSetupRosterPositions,
  >(
    key: K,
    value: DraftSetupRosterPositions[K],
  ) => {
    if (controlsLocked) {
      toast.error(
        isLoggedIn
          ? "Upgrade to premium to change roster settings."
          : "Sign in and upgrade to premium to change roster settings.",
      );
      return;
    }

    const nextRoster = normalizeRosterForLeague(
      {
        ...setup.roster,
        positions: {
          ...setup.roster.positions,
          [key]: value,
        },
      },
      setup.league,
    );

    updateRoster(nextRoster);
  };

  const handleMetadataChange = <K extends keyof DraftSetupMetadataState>(
    key: K,
    value: DraftSetupMetadataState[K],
  ) => {
    updateMetadata({
      [key]: value,
    } as Pick<DraftSetupMetadataState, K>);
  };

  const derivedAdpKey = buildAdpFormatKey(setup.league);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />

      <Dialog.Panel className="relative w-full max-w-4xl rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
        <Dialog.Title className="mb-6 text-xl font-bold text-white">
          Draft Settings
        </Dialog.Title>

        <div className="grid min-h-[420px] grid-cols-[140px_1fr]">
          <div className="flex flex-col border-r border-slate-700 bg-slate-900">
            <button
              className={`px-4 py-3 text-left text-sm font-semibold text-white ${
                activeTab === "league"
                  ? "border-l-4 border-blue-500 bg-slate-800"
                  : "hover:bg-slate-800"
              }`}
              onClick={() => setActiveTab("league")}
            >
              League
            </button>

            <button
              className={`px-4 py-3 text-left text-sm font-semibold text-white ${
                activeTab === "roster"
                  ? "border-l-4 border-blue-500 bg-slate-800"
                  : "hover:bg-slate-800"
              }`}
              onClick={() => setActiveTab("roster")}
            >
              Roster
            </button>

            <button
              className={`px-4 py-3 text-left text-sm font-semibold text-white ${
                activeTab === "metadata"
                  ? "border-l-4 border-blue-500 bg-slate-800"
                  : "hover:bg-slate-800"
              }`}
              onClick={() => setActiveTab("metadata")}
            >
              Metadata
            </button>
          </div>

          <div className="max-h-[560px] overflow-y-auto p-6">
            {activeTab === "league" && (
              <div className="space-y-4">
                <label className="block text-sm text-white">
                  Format
                  <select
                    className="mt-1 w-full rounded border border-slate-600 bg-slate-800 p-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
                    value={setup.league.format}
                    disabled={controlsLocked}
                    onChange={(e) =>
                      handleLeagueChange(
                        "format",
                        e.target.value as DraftSetupFormat,
                      )
                    }
                  >
                    {formatOptions.map((option) => (
                      <option key={option} value={option}>
                        {option.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm text-white">
                  QB Setting
                  <select
                    className="mt-1 w-full rounded border border-slate-600 bg-slate-800 p-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
                    value={setup.league.qbType}
                    disabled={controlsLocked}
                    onChange={(e) =>
                      handleLeagueChange(
                        "qbType",
                        e.target.value as DraftSetupQbType,
                      )
                    }
                  >
                    {qbTypeOptions.map((option) => (
                      <option key={option} value={option}>
                        {option.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm text-white">
                  Scoring
                  <select
                    className="mt-1 w-full rounded border border-slate-600 bg-slate-800 p-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
                    value={setup.league.scoring}
                    disabled={controlsLocked}
                    onChange={(e) =>
                      handleLeagueChange("scoring", e.target.value)
                    }
                  >
                    {scoringOptions.map((option) => (
                      <option key={option} value={option}>
                        {option.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="block text-sm text-white">
                  Platform
                  <select
                    className="mt-1 w-full rounded border border-slate-600 bg-slate-800 p-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
                    value={setup.league.platform}
                    disabled={controlsLocked}
                    onChange={(e) =>
                      handleLeagueChange("platform", e.target.value)
                    }
                  >
                    {platformOptions.map((option) => (
                      <option key={option} value={option}>
                        {option.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </label>

                <div className="rounded border border-slate-700 bg-slate-800/50 p-3 text-sm text-slate-300">
                  <div className="font-semibold text-white">
                    Derived ADP Key
                  </div>
                  <div className="mt-1 break-all text-blue-300">
                    {derivedAdpKey}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "roster" && (
              <div className="space-y-4">
                <label className="block text-sm text-white">
                  Number of Teams
                  <input
                    type="number"
                    min={8}
                    max={14}
                    className="mt-1 w-full rounded border border-slate-600 bg-slate-800 p-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
                    value={setup.roster.numTeams}
                    disabled={controlsLocked}
                    onChange={(e) =>
                      handleRosterChange("numTeams", Number(e.target.value))
                    }
                  />
                </label>

                <label className="block text-sm text-white">
                  Bench Count
                  <input
                    type="number"
                    min={0}
                    className="mt-1 w-full rounded border border-slate-600 bg-slate-800 p-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
                    value={setup.roster.benchCount}
                    disabled={controlsLocked}
                    onChange={(e) =>
                      handleRosterChange("benchCount", Number(e.target.value))
                    }
                  />
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {(
                    Object.keys(setup.roster.positions) as Array<
                      keyof DraftSetupRosterPositions
                    >
                  ).map((positionKey) => {
                    const locked = positionKey === "QB" || positionKey === "SF";

                    return (
                      <label
                        key={positionKey}
                        className="block text-sm text-white"
                      >
                        {positionKey}
                        <input
                          type="number"
                          min={0}
                          value={setup.roster.positions[positionKey]}
                          disabled={controlsLocked || locked}
                          onChange={(e) =>
                            handleRosterPositionChange(
                              positionKey,
                              Number(e.target.value),
                            )
                          }
                          className="mt-1 w-full rounded border border-slate-600 bg-slate-800 p-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
                        />
                      </label>
                    );
                  })}
                </div>

                <div className="rounded border border-slate-700 bg-slate-800/50 p-3 text-sm text-slate-300">
                  <div className="font-semibold text-white">
                    Derived Total Rounds
                  </div>
                  <div className="mt-1 text-blue-300">{totalRounds}</div>
                </div>
              </div>
            )}

            {activeTab === "metadata" && (
              <div className="space-y-4">
                <label className="block text-sm text-white">
                  Title
                  <input
                    type="text"
                    className="mt-1 w-full rounded border border-slate-600 bg-slate-800 p-2 text-white"
                    value={setup.metadata.title}
                    onChange={(e) =>
                      handleMetadataChange("title", e.target.value)
                    }
                    placeholder="Optional draft title"
                  />
                </label>

                <label className="block text-sm text-white">
                  Notes
                  <textarea
                    className="mt-1 min-h-[120px] w-full rounded border border-slate-600 bg-slate-800 p-2 text-white"
                    value={setup.metadata.notes}
                    onChange={(e) =>
                      handleMetadataChange("notes", e.target.value)
                    }
                    placeholder="Optional notes"
                  />
                </label>
              </div>
            )}

            {!isPaidUser && (
              <p className="mt-6 text-sm font-semibold text-amber-400">
                {isLoggedIn
                  ? "Upgrade to premium to unlock non-default draft settings."
                  : "Sign in and upgrade to premium to unlock non-default draft settings."}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-green-600"
          >
            Close
          </button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
