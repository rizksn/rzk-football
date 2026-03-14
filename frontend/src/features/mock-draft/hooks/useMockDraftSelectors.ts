"use client";

import { useMemo } from "react";

import { useMockDraftSession } from "./useMockDraftSession";
import {
  selectAvailableScoredPlayers,
  selectCurrentPick,
  selectCurrentPickIndex,
  selectDraft,
  selectDraftId,
  selectDraftPlan,
  selectDraftStatus,
  selectDraftedPlayerIds,
  selectDraftedPlayers,
  selectIsDraftComplete,
  selectIsSessionBusy,
  selectPublishedPickCount,
  selectRosterConfig,
  selectScoredPlayers,
  selectSessionError,
  selectSessionRequestId,
  selectSessionRequestStatus,
  selectTotalPickCount,
} from "../session/session.selectors";

export function useMockDraftSelectors() {
  const { state } = useMockDraftSession();

  return useMemo(
    () => ({
      snapshot: state.snapshot,
      request: state.request,

      requestStatus: selectSessionRequestStatus(state),
      requestId: selectSessionRequestId(state),
      requestError: selectSessionError(state),
      isSessionBusy: selectIsSessionBusy(state),

      draft: selectDraft(state),
      draftId: selectDraftId(state),
      draftStatus: selectDraftStatus(state),
      rosterConfig: selectRosterConfig(state),

      scoredPlayers: selectScoredPlayers(state),
      availableScoredPlayers: selectAvailableScoredPlayers(state),

      draftPlan: selectDraftPlan(state),
      currentPickIndex: selectCurrentPickIndex(state),
      currentPick: selectCurrentPick(state),

      draftedPlayers: selectDraftedPlayers(state),
      draftedPlayerIds: selectDraftedPlayerIds(state),

      totalPickCount: selectTotalPickCount(state),
      publishedPickCount: selectPublishedPickCount(state),
      isDraftComplete: selectIsDraftComplete(state),
    }),
    [state],
  );
}
