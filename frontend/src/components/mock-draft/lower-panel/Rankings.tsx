"use client";

import { Player } from "@/types/core/player";
import { useMemo } from "react";
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
import { toast } from "sonner";
import type { Dispatch, SetStateAction } from "react";

function SortablePlayerRow({
  player,
  disabled,
}: {
  player: Player;
  disabled: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: player.player_id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleClick = () => {
    if (disabled) {
      toast.error("Rankings are locked.");
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center px-3 py-2 border-b border-slate-700 hover:bg-slate-800 ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-grab"
      }`}
      onClick={handleClick}
      {...(!disabled ? { ...attributes, ...listeners } : {})}
    >
      <div className="mr-2">
        <GripVertical size={16} />
      </div>
      <div className="text-sm text-white font-medium">
        {player.full_name}{" "}
        <span className="text-slate-400 ml-1">({player.position})</span>
      </div>
    </div>
  );
}

export default function Rankings({
  rankedPlayers,
  setRankedPlayers,
  isPaidUser,
  canEditRankings,
}: {
  rankedPlayers: Player[];
  setRankedPlayers: Dispatch<SetStateAction<Player[]>>;
  isPaidUser: boolean;
  canEditRankings: boolean;
}) {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    if (!isPaidUser) {
      toast.error("🔒 Upgrade to premium to reorder rankings!");
      return;
    }
    if (!canEditRankings) {
      toast.error("Rankings are locked.");
      return;
    }

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

  const disabled = !isPaidUser || !canEditRankings;

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
            <SortablePlayerRow
              key={player.player_id}
              player={player}
              disabled={disabled}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
