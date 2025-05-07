'use client';

import { useState, useEffect } from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

import { Player } from '@/types';
import { getSleeperPlayerId } from '@/utils/getSleeperPlayerId';
import Queue from './Queue';
import Roster from './Roster';

type RightPanelProps = {
  queuedPlayers: Player[];
  userRoster: Player[];
  onRemoveFromQueue: (playerId: string) => void;
};

const RightPanel = ({ queuedPlayers, userRoster, onRemoveFromQueue }: RightPanelProps) => {
  const [queueOrder, setQueueOrder] = useState<string[]>([]);
  const [playerIds, setPlayerIds] = useState<Record<string, string | null>>({});

  // Sync drag order
  useEffect(() => {
    setQueueOrder(queuedPlayers.map(p => p.id));
  }, [queuedPlayers]);

  // Fetch image IDs for rostered players
  useEffect(() => {
    const fetchImageIds = async () => {
      const newIds: Record<string, string | null> = {};
      for (const player of userRoster) {
        if (!(player.name in playerIds)) {
          const id = await getSleeperPlayerId(player.name);
          newIds[player.name] = id ?? null;
        }
      }
      setPlayerIds(prev => ({ ...prev, ...newIds }));
    };
    fetchImageIds();
  }, [userRoster]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    setQueueOrder(prev => {
      const oldIndex = prev.indexOf(active.id as string);
      const newIndex = prev.indexOf(over.id as string);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  return (
    <div className="flex h-full w-full bg-[#2d3548]">
      {/* Player Queue */}
      <div className="w-1/2 border-r border-slate-700 px-3 py-3 flex flex-col">
        <h2 className="text-sm font-semibold text-white mb-2">QUEUE</h2>
        <div className="flex-1 overflow-y-auto">
          <Queue
            queuedPlayers={queuedPlayers}
            queueOrder={queueOrder}
            onRemoveFromQueue={onRemoveFromQueue}
            onDragEnd={handleDragEnd}
          />
        </div>
      </div>
  
      {/* Roster */}
      <div className="w-1/2 px-4 py-3 flex flex-col">
        <h2 className="text-sm font-semibold text-[#fcf8f8] mb-2">ROSTER</h2>
        <div className="flex-1 overflow-y-auto">
          <Roster userRoster={userRoster} playerIds={playerIds} />
        </div>
      </div>
    </div>
  );  
};

export default RightPanel;
