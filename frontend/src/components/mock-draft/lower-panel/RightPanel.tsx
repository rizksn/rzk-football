'use client';

import { useState, useEffect } from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

import { Player } from '@/types/core/player';
import Queue from './Queue';
import Roster from './Roster';
import { DraftRosterSettings } from "@/types/draft/config";

type RightPanelProps = {
  queuedPlayers: Player[];
  userRoster: Player[];
  rosterSettings: DraftRosterSettings;
  onRemoveFromQueue: (playerId: string) => void;
};

const RightPanel = ({ queuedPlayers, userRoster, rosterSettings, onRemoveFromQueue }: RightPanelProps) => {
  const [queueOrder, setQueueOrder] = useState<string[]>([]);

  // Sync drag order
  useEffect(() => {
    setQueueOrder(queuedPlayers.map(p => p.player_id));
  }, [queuedPlayers]);

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
    <div className="flex h-full w-full bg-[rgba(28,29,46,0.58)] min-h-0 py-2">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(rgba(0,255,255,0.08)_1px,transparent_1px)] bg-[size:20px_20px] opacity-40 pointer-events-none" />

      {/* Player Queue */}
      <div className="w-1/2 border-r border-slate-700 px-3 flex flex-col h-full min-h-0">
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
      <div className="w-1/2 pl-4 pr-2 flex flex-col h-full min-h-0">
        <h2 className="text-sm font-semibold text-[#fcf8f8] mb-2">ROSTER</h2>
        <div className="flex-1 min-h-0 overflow-y-auto">
          <Roster userRoster={userRoster} />
        </div>
      </div>
    </div>
  );  
};

export default RightPanel;