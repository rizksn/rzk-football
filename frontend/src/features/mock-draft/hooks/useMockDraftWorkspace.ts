"use client";

import { useCallback, useMemo, useState } from "react";

import type {
  DraftWorkspaceLowerPanelTab,
  DraftWorkspaceSortDirection,
  DraftWorkspaceSortKey,
  DraftWorkspaceState,
  RankingsSource,
} from "../workspace/workspace.types";

function buildInitialWorkspaceState(): DraftWorkspaceState {
  return {
    modals: {
      settingsOpen: false,
      keeperOpen: false,
    },
    panels: {
      lowerPanelTab: "players",
      mobileSlideIndex: 0,
    },
    display: {
      leftPlayerId: null,
      rightPlayerId: null,
    },
    playerTable: {
      searchText: "",
      selectedPlayerId: null,
      hoveredPlayerId: null,
      positionFilter: null,
      teamFilter: null,
      sortKey: "rank",
      sortDirection: "asc",
    },
    queue: {
      playerIds: [],
    },
    rankings: {
      source: "default",
      playerIds: [],
      isDirty: false,
      isLoading: false,
      isSaving: false,
      error: null,
    },
  };
}

export interface UseMockDraftWorkspaceResult {
  workspace: DraftWorkspaceState;
  setWorkspace: React.Dispatch<React.SetStateAction<DraftWorkspaceState>>;

  setLowerPanelTab: (tab: DraftWorkspaceLowerPanelTab) => void;
  setMobileSlideIndex: (index: number) => void;

  setSearchText: (value: string) => void;
  setSelectedPlayerId: (playerId: string | null) => void;
  setHoveredPlayerId: (playerId: string | null) => void;
  setPositionFilter: (value: string | null) => void;
  setTeamFilter: (value: string | null) => void;
  setSort: (
    key: DraftWorkspaceSortKey,
    direction: DraftWorkspaceSortDirection,
  ) => void;

  setLeftDisplayPlayer: (playerId: string | null) => void;
  setRightDisplayPlayer: (playerId: string | null) => void;

  addToQueue: (playerId: string) => void;
  removeFromQueue: (playerId: string) => void;
  setQueuePlayerIds: (playerIds: string[]) => void;

  setRankingsSource: (source: RankingsSource) => void;
  setRankingsPlayerIds: (playerIds: string[]) => void;
  setRankingsDirty: (isDirty: boolean) => void;
  setRankingsLoading: (isLoading: boolean) => void;
  setRankingsSaving: (isSaving: boolean) => void;
  setRankingsError: (error: string | null) => void;

  resetWorkspace: () => void;
}

export function useMockDraftWorkspace(): UseMockDraftWorkspaceResult {
  const [workspace, setWorkspace] = useState<DraftWorkspaceState>(() =>
    buildInitialWorkspaceState(),
  );

  const setLowerPanelTab = useCallback((tab: DraftWorkspaceLowerPanelTab) => {
    setWorkspace((current) => ({
      ...current,
      panels: {
        ...current.panels,
        lowerPanelTab: tab,
      },
    }));
  }, []);

  const setMobileSlideIndex = useCallback((index: number) => {
    setWorkspace((current) => ({
      ...current,
      panels: {
        ...current.panels,
        mobileSlideIndex: index,
      },
    }));
  }, []);

  const setSearchText = useCallback((value: string) => {
    setWorkspace((current) => ({
      ...current,
      playerTable: {
        ...current.playerTable,
        searchText: value,
      },
    }));
  }, []);

  const setSelectedPlayerId = useCallback((playerId: string | null) => {
    setWorkspace((current) => ({
      ...current,
      playerTable: {
        ...current.playerTable,
        selectedPlayerId: playerId,
      },
    }));
  }, []);

  const setHoveredPlayerId = useCallback((playerId: string | null) => {
    setWorkspace((current) => ({
      ...current,
      playerTable: {
        ...current.playerTable,
        hoveredPlayerId: playerId,
      },
    }));
  }, []);

  const setPositionFilter = useCallback((value: string | null) => {
    setWorkspace((current) => ({
      ...current,
      playerTable: {
        ...current.playerTable,
        positionFilter: value,
      },
    }));
  }, []);

  const setTeamFilter = useCallback((value: string | null) => {
    setWorkspace((current) => ({
      ...current,
      playerTable: {
        ...current.playerTable,
        teamFilter: value,
      },
    }));
  }, []);

  const setSort = useCallback(
    (key: DraftWorkspaceSortKey, direction: DraftWorkspaceSortDirection) => {
      setWorkspace((current) => ({
        ...current,
        playerTable: {
          ...current.playerTable,
          sortKey: key,
          sortDirection: direction,
        },
      }));
    },
    [],
  );

  const setLeftDisplayPlayer = useCallback((playerId: string | null) => {
    setWorkspace((current) => ({
      ...current,
      display: {
        ...current.display,
        leftPlayerId: playerId,
      },
    }));
  }, []);

  const setRightDisplayPlayer = useCallback((playerId: string | null) => {
    setWorkspace((current) => ({
      ...current,
      display: {
        ...current.display,
        rightPlayerId: playerId,
      },
    }));
  }, []);

  const addToQueue = useCallback((playerId: string) => {
    setWorkspace((current) => {
      if (current.queue.playerIds.includes(playerId)) {
        return current;
      }

      return {
        ...current,
        queue: {
          ...current.queue,
          playerIds: [...current.queue.playerIds, playerId],
        },
      };
    });
  }, []);

  const removeFromQueue = useCallback((playerId: string) => {
    setWorkspace((current) => ({
      ...current,
      queue: {
        ...current.queue,
        playerIds: current.queue.playerIds.filter((id) => id !== playerId),
      },
    }));
  }, []);

  const setQueuePlayerIds = useCallback((playerIds: string[]) => {
    setWorkspace((current) => ({
      ...current,
      queue: {
        ...current.queue,
        playerIds,
      },
    }));
  }, []);

  const setRankingsSource = useCallback((source: RankingsSource) => {
    setWorkspace((current) => ({
      ...current,
      rankings: {
        ...current.rankings,
        source,
      },
    }));
  }, []);

  const setRankingsPlayerIds = useCallback((playerIds: string[]) => {
    setWorkspace((current) => ({
      ...current,
      rankings: {
        ...current.rankings,
        playerIds,
      },
    }));
  }, []);

  const setRankingsDirty = useCallback((isDirty: boolean) => {
    setWorkspace((current) => ({
      ...current,
      rankings: {
        ...current.rankings,
        isDirty,
      },
    }));
  }, []);

  const setRankingsLoading = useCallback((isLoading: boolean) => {
    setWorkspace((current) => ({
      ...current,
      rankings: {
        ...current.rankings,
        isLoading,
      },
    }));
  }, []);

  const setRankingsSaving = useCallback((isSaving: boolean) => {
    setWorkspace((current) => ({
      ...current,
      rankings: {
        ...current.rankings,
        isSaving,
      },
    }));
  }, []);

  const setRankingsError = useCallback((error: string | null) => {
    setWorkspace((current) => ({
      ...current,
      rankings: {
        ...current.rankings,
        error,
      },
    }));
  }, []);

  const resetWorkspace = useCallback(() => {
    setWorkspace(buildInitialWorkspaceState());
  }, []);

  return useMemo(
    () => ({
      workspace,
      setWorkspace,

      setLowerPanelTab,
      setMobileSlideIndex,

      setSearchText,
      setSelectedPlayerId,
      setHoveredPlayerId,
      setPositionFilter,
      setTeamFilter,
      setSort,

      setLeftDisplayPlayer,
      setRightDisplayPlayer,

      addToQueue,
      removeFromQueue,
      setQueuePlayerIds,

      setRankingsSource,
      setRankingsPlayerIds,
      setRankingsDirty,
      setRankingsLoading,
      setRankingsSaving,
      setRankingsError,

      resetWorkspace,
    }),
    [
      workspace,
      setLowerPanelTab,
      setMobileSlideIndex,
      setSearchText,
      setSelectedPlayerId,
      setHoveredPlayerId,
      setPositionFilter,
      setTeamFilter,
      setSort,
      setLeftDisplayPlayer,
      setRightDisplayPlayer,
      addToQueue,
      removeFromQueue,
      setQueuePlayerIds,
      setRankingsSource,
      setRankingsPlayerIds,
      setRankingsDirty,
      setRankingsLoading,
      setRankingsSaving,
      setRankingsError,
      resetWorkspace,
    ],
  );
}
