"use client";

import { DndContext, closestCenter, type DragEndEvent } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useEffect, useState } from "react";

import type { AdpPlayerResponseDto } from "@/features/mock-draft/api/dto";
import QueuePlayer from "./QueuePlayer";

type QueueProps = {
  queuedPlayers: AdpPlayerResponseDto[];
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
    return (
      <div className="text-xs text-slate-400 italic">
        No players in queue yet.
      </div>
    );
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
      <SortableContext items={order} strategy={verticalListSortingStrategy}>
        <div className="text-xs space-y-1">
          {order.map((id) => {
            const player = queuedPlayers.find((p) => p.playerId === id);

            return player ? (
              <QueuePlayer
                key={player.playerId}
                player={player}
                onRemove={() => onRemoveFromQueue(player.playerId)}
              />
            ) : null;
          })}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default Queue;
