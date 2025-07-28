"use client";

import { useState } from "react";
import LeftPanel from "./LeftPanel";
import RightPanel from "./RightPanel";
import { Player } from "../../../types/core/player";
import DisplayPanels from "../display-panels/DisplayPanels";
import { DraftRosterSettings } from "@/types/draft/config";

type LowerPanelProps = {
  players: Player[];
  draftedPlayers: Player[];
  onDraftPlayer: (player: Player) => void;
  isUserTurn: boolean;
  userRoster: Player[];
  rosterSettings: DraftRosterSettings;
};

const LowerPanel: React.FC<LowerPanelProps> = ({
  players,
  draftedPlayers,
  onDraftPlayer,
  isUserTurn,
  userRoster,
  rosterSettings,
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
    <div className="relative w-full h-full flex flex-col bg-transparent overflow-visible px-[14px]">
      {/* ✅ Flat HUD / Display Panels */}
      <DisplayPanels leftPlayer={leftPlayer} rightPlayer={rightPlayer} />

      {/* ✅ Perspective wrapper: sets up 3D space */}
      <div
        className="w-full max-w-[1600px] min-w-[960px] mx-auto h-full relative"
        style={{ perspective: "1200px" }}
      >
        {/* ✅ Tilt only the lower panel grid (not the blue panels) */}
        <div
          className="flex gap-0 h-full transition-all duration-300 ease-in-out bg-[#4b02e942] relative z-10"
          style={{
            transform: "rotateX(2deg)",
            transformOrigin: "top center",
            willChange: "transform",
          }}
        >
          {/* ✅ Left Panel */}
          <div className="w-1/2 flex flex-col h-full transition-all duration-300">
            <LeftPanel
              players={players}
              onAddToQueue={handleAddToQueue}
              onDraftClick={handleUserDraft}
              isUserTurn={isUserTurn}
              onDisplayLeft={(player) => setLeftPlayer(player)}
              onDisplayRight={(player) => setRightPlayer(player)}
            />
          </div>

          {/* ✅ Right Panel */}
          <div className="w-1/2 flex flex-col h-full">
            <div className="flex-1 overflow-hidden h-full">
              <RightPanel
                queuedPlayers={queuePlayers}
                userRoster={userRoster}
                rosterSettings={rosterSettings}
                onRemoveFromQueue={handleRemoveFromQueue}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LowerPanel;
