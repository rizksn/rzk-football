'use client';

import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import { Player } from '../../../types';

type LowerPanelProps = {
  players: Player[];
  draftedPlayers: Player[];
  onDraftPlayer: (player: Player) => void;
  isUserTurn: boolean;
  queuePlayers: Player[];
  onAddToQueue: (player: Player) => void;
  onRemoveFromQueue: (playerId: string) => void;
  userRoster: Player[]; // ✅ received from parent
};

const LowerPanel = ({
  players,
  draftedPlayers,
  onAddToQueue,
  onDraftPlayer,
  isUserTurn,
  queuePlayers,
  onRemoveFromQueue,
  userRoster, // ✅ use this directly
}: LowerPanelProps) => {
  const handleDraft = (player: Player) => {
    onRemoveFromQueue(player.id); 
    onDraftPlayer(player); // ✅ parent handles the roster
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-transparent overflow-visible">
      {/* Floating Trapezoid */}
      <div className="absolute left-0 top-[-40px] w-[49.5%] z-50 shadow-[0_-20px_24px_-4px_rgba(0,0,0,0.9)]">
        <div
          className="bg-[#2d3548] h-[40px] w-full"
          style={{
            clipPath: 'polygon(0% 0%, 98.5% 0%, 100% 100%, 0% 100%)',
          }}
        />
      </div>

      <div className="w-full max-w-[1600px] min-w-[960px] mx-auto h-full flex gap-0 transition-all duration-300 ease-in-out">
        <div className="transition-all duration-300 overflow-y-auto h-full w-1/2">
          <LeftPanel
            players={players}
            onAddToQueue={onAddToQueue}
            draftedPlayers={draftedPlayers}
            onDraftPlayer={handleDraft}
            isUserTurn={isUserTurn}
          />
        </div>

        <div className="w-1/2 h-full flex">
          <div className="w-full h-full rounded-tr-lg shadow overflow-hidden">
            <RightPanel
              queuedPlayers={queuePlayers}
              userRoster={userRoster} // ✅ passed properly
              onRemoveFromQueue={onRemoveFromQueue}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LowerPanel;
