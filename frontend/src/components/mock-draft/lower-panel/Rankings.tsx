"use client";

import { Player } from "@/types/core/player";
import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

// Individual player row
function SortablePlayerRow({ player }: { player: Player }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: player.player_id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center px-3 py-2 border-b border-slate-700 hover:bg-slate-800"
    >
      <div {...attributes} {...listeners} className="cursor-grab mr-2">
        <GripVertical size={16} />
      </div>
      <div className="text-sm text-white font-medium">
        {player.full_name}{" "}
        <span className="text-slate-400 ml-1">({player.position})</span>
      </div>
    </div>
  );
}

// Rankings list
export default function Rankings({
  rankedPlayers,
  setRankedPlayers,
}: {
  rankedPlayers: Player[];
  setRankedPlayers: (players: Player[]) => void;
}) {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = rankedPlayers.findIndex((p) => p.player_id === active.id);
    const newIndex = rankedPlayers.findIndex((p) => p.player_id === over.id);
    setRankedPlayers(arrayMove(rankedPlayers, oldIndex, newIndex));
  };

  const playerIds = useMemo(
    () => rankedPlayers.map((p) => p.player_id),
    [rankedPlayers]
  );

  return (
    <div className="overflow-y-auto h-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={playerIds}
          strategy={verticalListSortingStrategy}
        >
          {rankedPlayers.map((player) => (
            <SortablePlayerRow key={player.player_id} player={player} />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
