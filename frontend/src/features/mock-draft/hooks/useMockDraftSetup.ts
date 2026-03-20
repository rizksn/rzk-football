"use client";

import { useCallback, useMemo, useState } from "react";

import { DEFAULT_DRAFT_SETUP_STATE } from "../setup/setup.defaults";
import { normalizeRosterForLeague } from "../setup/setup.helpers";
import type {
  DraftSetupKeeperState,
  DraftSetupLeagueState,
  DraftSetupMetadataState,
  DraftSetupRosterPositions,
  DraftSetupRosterState,
  DraftSetupState,
  DraftSetupTimerState,
  DraftSetupUserState,
} from "../setup/setup.types";

function cloneSetupState(setup: DraftSetupState): DraftSetupState {
  return {
    league: {
      ...setup.league,
    },
    roster: {
      numTeams: setup.roster.numTeams,
      positions: {
        ...setup.roster.positions,
      },
      benchCount: setup.roster.benchCount,
    },
    timer: {
      ...setup.timer,
    },
    keeper: {
      ...setup.keeper,
    },
    metadata: {
      ...setup.metadata,
    },
    user: {
      ...setup.user,
    },
  };
}

function buildInitialSetupState(
  initialSetup?: DraftSetupState,
): DraftSetupState {
  return cloneSetupState(initialSetup ?? DEFAULT_DRAFT_SETUP_STATE);
}

export interface UseMockDraftSetupResult {
  setup: DraftSetupState;
  setSetup: React.Dispatch<React.SetStateAction<DraftSetupState>>;

  replaceSetup: (nextSetup: DraftSetupState) => void;
  resetSetup: () => void;

  updateLeague: (patch: Partial<DraftSetupLeagueState>) => void;
  updateRoster: (patch: Partial<DraftSetupRosterState>) => void;
  updateRosterPositions: (patch: Partial<DraftSetupRosterPositions>) => void;
  updateTimer: (patch: Partial<DraftSetupTimerState>) => void;
  updateKeeper: (patch: Partial<DraftSetupKeeperState>) => void;
  updateMetadata: (patch: Partial<DraftSetupMetadataState>) => void;
  updateUser: (patch: Partial<DraftSetupUserState>) => void;
}

export function useMockDraftSetup(
  initialSetup?: DraftSetupState,
): UseMockDraftSetupResult {
  const [setup, setSetup] = useState<DraftSetupState>(() =>
    buildInitialSetupState(initialSetup),
  );

  const replaceSetup = useCallback((nextSetup: DraftSetupState) => {
    setSetup(cloneSetupState(nextSetup));
  }, []);

  const resetSetup = useCallback(() => {
    setSetup(cloneSetupState(DEFAULT_DRAFT_SETUP_STATE));
  }, []);

  const updateLeague = useCallback((patch: Partial<DraftSetupLeagueState>) => {
    setSetup((current) => {
      const nextLeague: DraftSetupLeagueState = {
        ...current.league,
        ...patch,
      };

      return {
        ...current,
        league: nextLeague,
        roster: normalizeRosterForLeague(current.roster, nextLeague),
      };
    });
  }, []);

  const updateRoster = useCallback((patch: Partial<DraftSetupRosterState>) => {
    setSetup((current) => {
      const nextRoster: DraftSetupRosterState = {
        ...current.roster,
        ...patch,
        positions: patch.positions
          ? {
              ...current.roster.positions,
              ...patch.positions,
            }
          : current.roster.positions,
      };

      return {
        ...current,
        roster: normalizeRosterForLeague(nextRoster, current.league),
      };
    });
  }, []);

  const updateRosterPositions = useCallback(
    (patch: Partial<DraftSetupRosterPositions>) => {
      setSetup((current) => {
        const nextRoster: DraftSetupRosterState = {
          ...current.roster,
          positions: {
            ...current.roster.positions,
            ...patch,
          },
        };

        return {
          ...current,
          roster: normalizeRosterForLeague(nextRoster, current.league),
        };
      });
    },
    [],
  );

  const updateTimer = useCallback((patch: Partial<DraftSetupTimerState>) => {
    setSetup((current) => ({
      ...current,
      timer: {
        ...current.timer,
        ...patch,
      },
    }));
  }, []);

  const updateKeeper = useCallback((patch: Partial<DraftSetupKeeperState>) => {
    setSetup((current) => ({
      ...current,
      keeper: {
        ...current.keeper,
        ...patch,
      },
    }));
  }, []);

  const updateMetadata = useCallback(
    (patch: Partial<DraftSetupMetadataState>) => {
      setSetup((current) => ({
        ...current,
        metadata: {
          ...current.metadata,
          ...patch,
        },
      }));
    },
    [],
  );

  const updateUser = useCallback((patch: Partial<DraftSetupUserState>) => {
    setSetup((current) => ({
      ...current,
      user: {
        ...current.user,
        ...patch,
      },
    }));
  }, []);

  return useMemo(
    () => ({
      setup,
      setSetup,
      replaceSetup,
      resetSetup,
      updateLeague,
      updateRoster,
      updateRosterPositions,
      updateTimer,
      updateKeeper,
      updateMetadata,
      updateUser,
    }),
    [
      setup,
      replaceSetup,
      resetSetup,
      updateLeague,
      updateRoster,
      updateRosterPositions,
      updateTimer,
      updateKeeper,
      updateMetadata,
      updateUser,
    ],
  );
}
