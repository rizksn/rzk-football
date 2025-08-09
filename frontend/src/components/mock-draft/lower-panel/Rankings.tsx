"use client";

import { Player } from "@/types/core/player";
import { useMemo, useRef, type Dispatch, type SetStateAction } from "react";
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center px-3 py-2 border-b border-slate-700 hover:bg-slate-800 ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-grab"
      }`}
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
  draftStarted,
  hasManualAssignments,
}: {
  rankedPlayers: Player[];
  setRankedPlayers: Dispatch<SetStateAction<Player[]>>;
  isPaidUser: boolean;
  canEditRankings: boolean;
  draftStarted: boolean;
  hasManualAssignments: boolean;
}) {
  const sensors = useSensors(useSensor(PointerSensor));

  // one source of truth for why it's locked
  const lockMessage = useMemo(() => {
    if (!isPaidUser) return "🔒 Upgrade to premium to reorder rankings!";
    if (canEditRankings) return null;
    if (draftStarted) return "Rankings are locked. Draft in session.";
    if (hasManualAssignments)
      return "Manual assignments detected – save or load a keeper set first";
    return "Rankings are locked.";
  }, [isPaidUser, canEditRankings, draftStarted, hasManualAssignments]);

  // toast-once guard so repeated clicks don't spam
  const lastToastRef = useRef(0);
  const handleContainerClick = () => {
    if (!lockMessage) return; // unlocked → do nothing
    const now = Date.now();
    if (now - lastToastRef.current > 1200) {
      toast.error(lockMessage);
      lastToastRef.current = now;
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (lockMessage) {
      // safety: if a drag ever begins while locked
      const now = Date.now();
      if (now - lastToastRef.current > 1200) {
        toast.error(lockMessage);
        lastToastRef.current = now;
      }
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
    <div className="overflow-y-auto h-full" onClick={handleContainerClick}>
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
