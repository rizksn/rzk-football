'use client';

import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { useState, useEffect } from 'react';
import { Player } from '@/types';
import QueuePlayer from './QueuePlayer';

type QueueProps = {
  queuedPlayers: Player[];
  queueOrder: string[];
  onRemoveFromQueue: (playerId: string) => void;
  onDragEnd: (event: DragEndEvent) => void;
};

const Queue = ({
  queuedPlayers,
  queueOrder,
  onRemoveFromQueue,
  onDragEnd,
}: QueueProps) => {
  const [order, setOrder] = useState<string[]>([]);

  useEffect(() => {
    setOrder(queueOrder);
  }, [queueOrder]);

  if (queuedPlayers.length === 0) {
    return <div className="text-xs text-slate-400 italic">No players in queue yet.</div>;
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={order} strategy={verticalListSortingStrategy}>
        <div className="text-xs space-y-1">
          {order.map(id => {
            const player = queuedPlayers.find(p => p.id === id);
            return player ? (
              <QueuePlayer
                key={player.id}
                player={player}
                onRemove={() => onRemoveFromQueue(player.id)}
              />
            ) : null;
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default Queue;
