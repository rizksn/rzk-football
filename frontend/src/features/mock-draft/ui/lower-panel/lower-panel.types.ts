import type { DragEndEvent } from "@dnd-kit/core";

import type {
  DraftPick,
  DraftRosterConfig,
  DraftedPlayer,
  ScoredPlayer,
} from "@/features/mock-draft/session/session.models";
import type {
  DraftWorkspaceLowerPanelTab,
  DraftWorkspaceState,
} from "@/features/mock-draft/workspace/workspace.types";

/**
 * Props contract for the lower-panel workspace area.
 *
 * LowerPanel is the interactive draft workspace surface for:
 * - available players (session-derived, workspace-controlled presentation)
 * - queue (workspace-owned)
 * - rankings (workspace-owned, backend-backed)
 * - roster (session-derived)
 *
 * Session provides live draft truth.
 * Workspace provides UI state and personal drafting tools.
 * LowerPanel should not own core draft business state itself.
 */
export interface LowerPanelProps {
  /**
   * Typically:
   * scoredPlayers - draftedPlayers
   */
  availablePlayers: ScoredPlayer[];

  draftPlan: DraftPick[];
  rosterConfig: DraftRosterConfig | null;
  userRoster: DraftedPlayer[];
  draftStarted: boolean;

  /**
   * Frontend-only workspace state for the lower-panel UI.
   */
  workspace: DraftWorkspaceState;

  /**
   * Draft a player from the available player list.
   */
  onDraftPlayer: (playerId: string) => void;

  /**
   * Lower panel tab / mobile layout controls.
   */
  onSetLowerPanelTab: (tab: DraftWorkspaceLowerPanelTab) => void;
  onSetMobileSlideIndex: (index: number) => void;

  /**
   * Player browser / table controls.
   */
  onSetSearchText: (value: string) => void;
  onSetPositionFilter: (value: string | null) => void;
  onSetTeamFilter: (value: string | null) => void;
  onSetSort: (
    key: DraftWorkspaceState["playerTable"]["sortKey"],
    direction: DraftWorkspaceState["playerTable"]["sortDirection"],
  ) => void;

  /**
   * Left/right display panel controls.
   */
  onSetLeftDisplayPlayer: (playerId: string | null) => void;
  onSetRightDisplayPlayer: (playerId: string | null) => void;

  /**
   * Queue is frontend-owned workspace state and stores player IDs.
   */
  onAddToQueue: (playerId: string) => void;
  onRemoveFromQueue: (playerId: string) => void;
  onQueueDragEnd: (event: DragEndEvent) => void;

  /**
   * Rankings are workspace-managed in the UI, but can be loaded/saved from backend state.
   */
  onLoadRankings: () => Promise<void>;
  onSaveRankings: () => Promise<void>;
  onResetRankings: () => void;
}
