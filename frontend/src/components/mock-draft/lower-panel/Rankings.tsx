"use client";

import { Player } from "@/types/core/player";
import { useMemo, type Dispatch, type SetStateAction } from "react";
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

function SortablePlayerRow({
  player,
  disabled,
  lockMessage,
}: {
  player: Player;
  disabled: boolean;
  lockMessage?: string | null;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: player.player_id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleClick = () => {
    if (disabled && lockMessage) {
      toast.error(lockMessage);
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
  draftStarted, // NEW
  hasManualAssignments, // NEW
}: {
  rankedPlayers: Player[];
  setRankedPlayers: Dispatch<SetStateAction<Player[]>>;
  isPaidUser: boolean;
  canEditRankings: boolean;
  draftStarted: boolean; // NEW
  hasManualAssignments: boolean; // NEW
}) {
  const sensors = useSensors(useSensor(PointerSensor));

  // one source of truth for why it's locked
  const lockMessage = useMemo(() => {
    if (!isPaidUser) return "🔒 Upgrade to premium to reorder rankings!";
    if (canEditRankings) return null;
    if (draftStarted) return "Rankings are locked. Draft in session.";
    if (hasManualAssignments)
      return "Rankings are locked. Please remove manually assigned players or save/load a keeper set.";
    return "Rankings are locked.";
  }, [isPaidUser, canEditRankings, draftStarted, hasManualAssignments]);

  const handleDragEnd = (event: DragEndEvent) => {
    if (lockMessage) {
      toast.error(lockMessage);
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

  const disabled = !!lockMessage;

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
              lockMessage={lockMessage}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
