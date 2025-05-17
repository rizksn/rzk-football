'use client';

import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import { Player } from '../../../types';
import DisplayPanels from '../display-panels/DisplayPanels';

type LowerPanelProps = {
  players: Player[];
  draftedPlayers: Player[];
  onDraftPlayer: (player: Player) => void;
  isUserTurn: boolean;
  queuePlayers: Player[];
  onAddToQueue: (player: Player) => void;
  onRemoveFromQueue: (playerId: string) => void;
  userRoster: Player[];
  leftPlayer: Player | null;
  rightPlayer: Player | null;
  isSplit: boolean;
};

const LowerPanel: React.FC<LowerPanelProps> = ({
  players,
  draftedPlayers,
  onAddToQueue,
  onDraftPlayer,
  isUserTurn,
  queuePlayers,
  onRemoveFromQueue,
  userRoster,
  leftPlayer, 
  rightPlayer,
  isSplit,
}: LowerPanelProps) => {
  const handleDraft = (player: Player) => {
    onRemoveFromQueue(player.id); 
    onDraftPlayer(player); 
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-transparent overflow-visible px-[14px]">
      {/* ✅ Flat HUD / Display Panels */}
      <DisplayPanels
        leftPlayer={leftPlayer}
        rightPlayer={rightPlayer}
        isSplit={isSplit}
      />
      
      {/* ✅ Perspective wrapper: sets up 3D space */}
      <div
        className="w-full max-w-[1600px] min-w-[960px] mx-auto h-full"
        style={{ perspective: '1200px' }}
      >
        {/* ✅ Tilt only the lower panel grid (not the blue panels) */}
        <div
          className="flex gap-0 h-full transition-all duration-300 ease-in-out bg-[#000000af]"
          style={{
            transform: 'rotateX(2deg)',
            transformOrigin: 'top center',
            willChange: 'transform',
          }}
        >
          {/* ✅ Left Panel */}
          <div className="w-1/2 flex flex-col rounded-tl-lg h-full transition-all duration-300">
            <LeftPanel
              players={players}
              onAddToQueue={onAddToQueue}
              draftedPlayers={draftedPlayers}
              onDraftPlayer={handleDraft}
              isUserTurn={isUserTurn}
            />
          </div>

          {/* ✅ Right Panel */}
          <div className="w-1/2 flex flex-col h-full">
            <div className="flex-1 rounded-tr-lg rounded-lr-lg  overflow-hidden h-full">
              <RightPanel
                queuedPlayers={queuePlayers}
                userRoster={userRoster}
                onRemoveFromQueue={onRemoveFromQueue}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LowerPanel;