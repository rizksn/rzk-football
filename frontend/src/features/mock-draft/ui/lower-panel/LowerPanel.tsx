"use client";

import { useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import DisplayPanels from "../display-panels/DisplayPanels";

import type { LowerPanelProps } from "./lower-panel.types";
import type {
  DraftedPlayer,
  ScoredPlayer,
} from "@/features/mock-draft/session/session.models";

function scoredPlayerToLegacyPlayer(player: ScoredPlayer) {
  return {
    player_id: player.playerId,
    full_name: player.fullName,
    search_full_name: player.searchFullName,
    first_name: player.firstName,
    last_name: player.lastName,
    team: player.team,
    position: player.position,
    rank: player.rank,
    adp: player.adp,
    scoring: player.scoring,
    platform: player.platform,
    type: player.type,
    absolute_adp: player.absoluteAdp,
    final_score: player.finalScore,
    debug: player.debug,
  };
}

function draftedPlayerToLegacyPlayer(player: DraftedPlayer) {
  return {
    player_id: player.playerId,
    full_name: player.fullName,
    team: player.team,
    position: player.position,
  };
}

const EMPTY_ROSTER_SETTINGS = {
  positions: {
    QB: 0,
    RB: 0,
    WR: 0,
    TE: 0,
    FLX: 0,
    SF: 0,
    K: 0,
  },
  benchCount: 0,
  totalRounds: 0,
};

const LowerPanel = ({
  availablePlayers,
  draftPlan,
  rosterConfig,
  userRoster,
  draftStarted,
  workspace,
  onDraftPlayer,
  onSetLowerPanelTab,
  onSetMobileSlideIndex,
  onSetSearchText,
  onSetPositionFilter,
  onSetTeamFilter,
  onSetSort,
  onSetLeftDisplayPlayer,
  onSetRightDisplayPlayer,
  onAddToQueue,
  onRemoveFromQueue,
  onQueueDragEnd,
  onLoadRankings,
  onSaveRankings,
  onResetRankings,
}: LowerPanelProps) => {
  const legacyUserRoster = useMemo(
    () => userRoster.map(draftedPlayerToLegacyPlayer),
    [userRoster],
  );

  const queuePlayers = useMemo(() => {
    const availableById = new Map(
      availablePlayers.map((player) => [player.playerId, player]),
    );

    return workspace.queue.playerIds
      .map((playerId) => availableById.get(playerId))
      .filter((player): player is ScoredPlayer => Boolean(player))
      .map(scoredPlayerToLegacyPlayer);
  }, [availablePlayers, workspace.queue.playerIds]);

  const rankingPlayers = useMemo(() => {
    const availableById = new Map(
      availablePlayers.map((player) => [player.playerId, player]),
    );

    return workspace.rankings.playerIds
      .map((playerId) => availableById.get(playerId))
      .filter((player): player is ScoredPlayer => Boolean(player))
      .map(scoredPlayerToLegacyPlayer);
  }, [availablePlayers, workspace.rankings.playerIds]);

  const leftDisplayPlayer = useMemo(() => {
    const leftPlayerId = workspace.display.leftPlayerId;
    if (!leftPlayerId) return null;

    return (
      availablePlayers.find((player) => player.playerId === leftPlayerId) ??
      null
    );
  }, [availablePlayers, workspace.display.leftPlayerId]);

  const rightDisplayPlayer = useMemo(() => {
    const rightPlayerId = workspace.display.rightPlayerId;
    if (!rightPlayerId) return null;

    return (
      availablePlayers.find((player) => player.playerId === rightPlayerId) ??
      null
    );
  }, [availablePlayers, workspace.display.rightPlayerId]);

  const legacyLeftDisplayPlayer = leftDisplayPlayer
    ? scoredPlayerToLegacyPlayer(leftDisplayPlayer)
    : null;

  const legacyRightDisplayPlayer = rightDisplayPlayer
    ? scoredPlayerToLegacyPlayer(rightDisplayPlayer)
    : null;

  const rosterSettings = rosterConfig
    ? {
        positions: rosterConfig.positions,
        benchCount: rosterConfig.benchCount,
        totalRounds: rosterConfig.totalRounds,
      }
    : EMPTY_ROSTER_SETTINGS;

  return (
    <div className="mx-auto flex h-[55vh] w-full max-w-[1600px] flex-col sm:min-w-[960px]">
      <div className="h-[120px] shrink-0">
        <DisplayPanels
          leftPlayer={legacyLeftDisplayPlayer}
          rightPlayer={legacyRightDisplayPlayer}
        />
      </div>

      <div className="relative h-[calc(55vh-136px)] w-full">
        <div className="block h-full w-screen overflow-hidden sm:hidden">
          <Swiper
            slidesPerView={1}
            spaceBetween={8}
            className="h-full w-full"
            onSlideChange={(swiper) => {
              onSetMobileSlideIndex(swiper.activeIndex);

              if (swiper.activeIndex === 0) onSetLowerPanelTab("players");
              if (swiper.activeIndex === 1) onSetLowerPanelTab("queue");
              if (swiper.activeIndex === 2) onSetLowerPanelTab("roster");
            }}
          >
            <SwiperSlide>
              <div className="w-screen overflow-hidden px-2">
                <LeftPanel
                  players={availablePlayers}
                  playerTable={workspace.playerTable}
                  canDraft={draftStarted}
                  onDraftPlayer={onDraftPlayer}
                  onAddToQueue={onAddToQueue}
                  onSetSearchText={onSetSearchText}
                  onSetPositionFilter={onSetPositionFilter}
                  onSetLeftDisplayPlayer={onSetLeftDisplayPlayer}
                  onSetRightDisplayPlayer={onSetRightDisplayPlayer}
                />
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="flex h-full w-full flex-col px-4">
                <RightPanel
                  showOnly="queue"
                  queuedPlayers={queuePlayers}
                  rankingPlayers={rankingPlayers}
                  userRoster={legacyUserRoster}
                  rosterSettings={rosterSettings}
                  onRemoveFromQueue={onRemoveFromQueue}
                  setRankedPlayers={() => {}}
                  loadRankings={onLoadRankings}
                  onSaveRankings={onSaveRankings}
                  resetRankings={onResetRankings}
                  downloadRankings={() => {}}
                  queueOrder={workspace.queue.playerIds}
                  setQueueOrder={() => {}}
                  handleQueueDragEnd={onQueueDragEnd}
                  isPaidUser={true}
                  keeperState={{ mode: "standard", keeperSetId: null }}
                  draftStarted={draftStarted}
                  draftPlan={draftPlan}
                  userDraftSlot={null}
                  canEditRankings={true}
                  hasManualAssignments={false}
                />
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="flex h-full w-full flex-col px-4">
                <RightPanel
                  showOnly="roster"
                  queuedPlayers={queuePlayers}
                  rankingPlayers={rankingPlayers}
                  userRoster={legacyUserRoster}
                  rosterSettings={rosterSettings}
                  onRemoveFromQueue={onRemoveFromQueue}
                  setRankedPlayers={() => {}}
                  loadRankings={onLoadRankings}
                  onSaveRankings={onSaveRankings}
                  resetRankings={onResetRankings}
                  downloadRankings={() => {}}
                  queueOrder={workspace.queue.playerIds}
                  setQueueOrder={() => {}}
                  handleQueueDragEnd={onQueueDragEnd}
                  isPaidUser={true}
                  keeperState={{ mode: "standard", keeperSetId: null }}
                  draftStarted={draftStarted}
                  draftPlan={draftPlan}
                  userDraftSlot={null}
                  canEditRankings={true}
                  hasManualAssignments={false}
                />
              </div>
            </SwiperSlide>
          </Swiper>
        </div>

        <div className="hidden h-full sm:flex">
          <div className="w-1/2 overflow-y-auto">
            <LeftPanel
              players={availablePlayers}
              playerTable={workspace.playerTable}
              canDraft={draftStarted}
              onDraftPlayer={onDraftPlayer}
              onAddToQueue={onAddToQueue}
              onSetSearchText={onSetSearchText}
              onSetPositionFilter={onSetPositionFilter}
              onSetLeftDisplayPlayer={onSetLeftDisplayPlayer}
              onSetRightDisplayPlayer={onSetRightDisplayPlayer}
            />
          </div>

          <div className="w-1/2 overflow-y-auto">
            <RightPanel
              queuedPlayers={queuePlayers}
              rankingPlayers={rankingPlayers}
              userRoster={legacyUserRoster}
              rosterSettings={rosterSettings}
              onRemoveFromQueue={onRemoveFromQueue}
              setRankedPlayers={() => {}}
              loadRankings={onLoadRankings}
              onSaveRankings={onSaveRankings}
              resetRankings={onResetRankings}
              downloadRankings={() => {}}
              queueOrder={workspace.queue.playerIds}
              setQueueOrder={() => {}}
              handleQueueDragEnd={onQueueDragEnd}
              isPaidUser={true}
              keeperState={{ mode: "standard", keeperSetId: null }}
              draftStarted={draftStarted}
              draftPlan={draftPlan}
              userDraftSlot={null}
              canEditRankings={true}
              hasManualAssignments={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LowerPanel;
