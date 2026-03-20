export type DraftWorkspaceLowerPanelTab =
  | "players"
  | "queue"
  | "rankings"
  | "roster";

export type DraftWorkspaceSortKey =
  | "rank"
  | "adp"
  | "name"
  | "position"
  | "team";

export type DraftWorkspaceSortDirection = "asc" | "desc";

export type RankingsSource = "default" | "savedFormat" | "savedKeeper";

export interface DraftWorkspaceModalsState {
  settingsOpen: boolean;
  keeperOpen: boolean;
}

export interface DraftWorkspacePanelsState {
  lowerPanelTab: DraftWorkspaceLowerPanelTab;
  mobileSlideIndex: number;
}

export interface DraftWorkspaceDisplayState {
  leftPlayerId: string | null;
  rightPlayerId: string | null;
}

export interface DraftWorkspacePlayerTableState {
  searchText: string;
  selectedPlayerId: string | null;
  hoveredPlayerId: string | null;
  positionFilter: string | null;
  teamFilter: string | null;
  sortKey: DraftWorkspaceSortKey;
  sortDirection: DraftWorkspaceSortDirection;
}

export interface DraftWorkspaceQueueState {
  playerIds: string[];
}

export interface DraftWorkspaceRankingsState {
  source: RankingsSource;
  playerIds: string[];
  isDirty: boolean;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
}

export interface DraftWorkspaceState {
  modals: DraftWorkspaceModalsState;
  panels: DraftWorkspacePanelsState;
  display: DraftWorkspaceDisplayState;
  playerTable: DraftWorkspacePlayerTableState;
  queue: DraftWorkspaceQueueState;
  rankings: DraftWorkspaceRankingsState;
}
