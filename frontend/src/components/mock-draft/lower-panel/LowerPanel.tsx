"use client";

import type { User } from "firebase/auth";
import { useState } from "react";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import { Player } from "../../../types/core/player";
import DisplayPanels from "../display-panels/DisplayPanels";
import { DraftConfig, DraftRosterSettings } from "@/types/draft/config";

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
}) => {
  const [queuePlayers, setQueuePlayers] = useState<Player[]>([]);
  const [leftPlayer, setLeftPlayer] = useState<Player | null>(null);
  const [rightPlayer, setRightPlayer] = useState<Player | null>(null);

  const handleAddToQueue = (player: Player) => {
    if (!queuePlayers.some((p) => p.player_id === player.player_id)) {
      setQueuePlayers((prev) => [...prev, player]);
    }
  };

  const handleRemoveFromQueue = (playerId: string) => {
    setQueuePlayers((prev) => prev.filter((p) => p.player_id !== playerId));
  };

  const handleUserDraft = (player: Player) => {
    if (!isUserTurn) return;
    handleRemoveFromQueue(player.player_id);
    onDraftPlayer(player);
  };

  return (
    <div className="w-full min-w-[960px] max-w-[1600px] mx-auto h-[55vh] flex flex-col px-[14px] mb-[40px]">
      {/* ✅ Fixed DisplayPanels height */}
      <div className="h-[120px] shrink-0">
        <DisplayPanels leftPlayer={leftPlayer} rightPlayer={rightPlayer} />
      </div>

      {/* ✅ Fill the remaining height below DisplayPanels */}
      <div
        className="h-[calc(55vh-136px)] w-full relative"
        style={{ perspective: "1200px" }}
      >
        <div
          className="flex gap-0 h-full bg-transparent relative z-10"
          style={{
            transform: "rotateX(2deg)",
            transformOrigin: "top center",
            willChange: "transform",
          }}
        >
          {/* Left */}
          <div className="w-1/2 flex flex-col overflow-y-auto">
            <LeftPanel
              players={players}
              onAddToQueue={handleAddToQueue}
              onDraftClick={handleUserDraft}
              isUserTurn={isUserTurn}
              onDisplayLeft={(player) => setLeftPlayer(player)}
              onDisplayRight={(player) => setRightPlayer(player)}
              assignModeIndex={assignModeIndex}
              onManualAssignPlayer={onManualAssignPlayer}
            />
          </div>

          {/* Right */}
          <div className="w-1/2 flex flex-col overflow-y-auto">
            <RightPanel
              queuedPlayers={queuePlayers}
              rankingPlayers={rankingPlayers}
              userRoster={userRoster}
              rosterSettings={rosterSettings}
              onRemoveFromQueue={handleRemoveFromQueue}
              setRankedPlayers={setRankedPlayers}
              loadRankings={loadRankings}
              saveRankings={saveRankings}
              resetRankings={resetRankings}
              downloadRankings={downloadRankings}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LowerPanel;
