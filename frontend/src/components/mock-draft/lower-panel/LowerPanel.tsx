"use client";

import type { User } from "firebase/auth";
import { useState } from "react";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import DisplayPanels from "../display-panels/DisplayPanels";
import { Player } from "@/types/core/player";
import { DraftConfig, DraftRosterSettings } from "@/types/draft/config";
import { DragEndEvent } from "@dnd-kit/core";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

type LowerPanelProps = {
  players: Player[];
  draftedPlayers: Player[];
  rankingPlayers: Player[];
  onDraftPlayer: (player: Player) => void;
  isUserTurn: boolean;
  userRoster: Player[];
  rosterSettings: DraftRosterSettings;
  assignModeIndex?: number | null;
  onManualAssignPlayer?: (player: Player) => void;
  user: User | null;
  draftConfig: DraftConfig;
  adpPlayers: Player[];
  setRankedPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
  loadRankings: () => Promise<void>;
  saveRankings: () => Promise<void>;
  resetRankings: () => void;
  downloadRankings: () => void;
  queuedPlayers: Player[];
  onAddToQueue: (player: Player) => void;
  onRemoveFromQueue: (playerId: string) => void;
  queueOrder: string[];
  handleQueueDragEnd: (event: DragEndEvent) => void;
  isPaidUser: boolean;
  setQueueOrder: React.Dispatch<React.SetStateAction<string[]>>;
};

const LowerPanel: React.FC<LowerPanelProps> = ({
  players,
  draftedPlayers,
  rankingPlayers,
  onDraftPlayer,
  isUserTurn,
  userRoster,
  rosterSettings,
  assignModeIndex,
  onManualAssignPlayer,
  user,
  draftConfig,
  adpPlayers,
  setRankedPlayers,
  loadRankings,
  saveRankings,
  resetRankings,
  downloadRankings,
  queuedPlayers,
  onAddToQueue,
  onRemoveFromQueue,
  queueOrder,
  handleQueueDragEnd,
  isPaidUser,
  setQueueOrder,
}) => {
  const [leftPlayer, setLeftPlayer] = useState<Player | null>(null);
  const [rightPlayer, setRightPlayer] = useState<Player | null>(null);

  const handleUserDraft = (player: Player) => {
    if (!isUserTurn) return;
    onRemoveFromQueue(player.player_id);
    onDraftPlayer(player);
  };

  return (
    <div className="w-full sm:min-w-[960px] max-w-[1600px] mx-auto h-[55vh] flex flex-col">
      {/* Header player display */}
      <div className="h-[120px] shrink-0">
        <DisplayPanels leftPlayer={leftPlayer} rightPlayer={rightPlayer} />
      </div>

      {/* Main content layout */}
      <div className="h-[calc(55vh-136px)] w-full relative">
        {/* 👉 Mobile (below 640px): Swiper */}
        <div className="block sm:hidden h-full w-screen overflow-hidden">
          <Swiper slidesPerView={1} spaceBetween={8} className="w-full h-full">
            <SwiperSlide>
              <div className="w-screen overflow-hidden px-2">
                <LeftPanel
                  players={players}
                  onAddToQueue={onAddToQueue}
                  onDraftClick={handleUserDraft}
                  isUserTurn={isUserTurn}
                  onDisplayLeft={setLeftPlayer}
                  onDisplayRight={setRightPlayer}
                  assignModeIndex={assignModeIndex}
                  onManualAssignPlayer={onManualAssignPlayer}
                />
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="flex flex-col h-full w-full px-4">
                <RightPanel
                  showOnly="queue"
                  queuedPlayers={queuedPlayers}
                  rankingPlayers={rankingPlayers}
                  userRoster={userRoster}
                  rosterSettings={rosterSettings}
                  onRemoveFromQueue={onRemoveFromQueue}
                  setRankedPlayers={setRankedPlayers}
                  loadRankings={loadRankings}
                  saveRankings={saveRankings}
                  resetRankings={resetRankings}
                  downloadRankings={downloadRankings}
                  queueOrder={queueOrder}
                  setQueueOrder={setQueueOrder}
                  handleQueueDragEnd={handleQueueDragEnd}
                  isPaidUser={isPaidUser}
                />
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div className="flex flex-col h-full w-full px-4">
                <RightPanel
                  showOnly="roster"
                  queuedPlayers={queuedPlayers}
                  rankingPlayers={rankingPlayers}
                  userRoster={userRoster}
                  rosterSettings={rosterSettings}
                  onRemoveFromQueue={onRemoveFromQueue}
                  setRankedPlayers={setRankedPlayers}
                  loadRankings={loadRankings}
                  saveRankings={saveRankings}
                  resetRankings={resetRankings}
                  downloadRankings={downloadRankings}
                  queueOrder={queueOrder}
                  setQueueOrder={setQueueOrder}
                  handleQueueDragEnd={handleQueueDragEnd}
                  isPaidUser={isPaidUser}
                />
              </div>
            </SwiperSlide>
          </Swiper>
        </div>

        {/* 👉 Desktop (640px and up): Flex layout */}
        <div className="hidden sm:flex h-full">
          <div className="w-1/2 overflow-y-auto">
            <LeftPanel
              players={players}
              onAddToQueue={onAddToQueue}
              onDraftClick={handleUserDraft}
              isUserTurn={isUserTurn}
              onDisplayLeft={setLeftPlayer}
              onDisplayRight={setRightPlayer}
              assignModeIndex={assignModeIndex}
              onManualAssignPlayer={onManualAssignPlayer}
            />
          </div>
          <div className="w-1/2 overflow-y-auto">
            <RightPanel
              queuedPlayers={queuedPlayers}
              rankingPlayers={rankingPlayers}
              userRoster={userRoster}
              rosterSettings={rosterSettings}
              onRemoveFromQueue={onRemoveFromQueue}
              setRankedPlayers={setRankedPlayers}
              loadRankings={loadRankings}
              saveRankings={saveRankings}
              resetRankings={resetRankings}
              downloadRankings={downloadRankings}
              queueOrder={queueOrder}
              setQueueOrder={setQueueOrder}
              handleQueueDragEnd={handleQueueDragEnd}
              isPaidUser={isPaidUser}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LowerPanel;
