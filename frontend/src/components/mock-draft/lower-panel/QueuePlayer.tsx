'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Player } from '@/types';
import { getSleeperPlayerId } from '@/utils/getSleeperPlayerId'; 
import PlayerImage from '@/components/shared/PlayerImage';

type QueueItemProps = {
  player: Player;
  onRemove: () => void;
};

const QueueItem = ({ player, onRemove }: QueueItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: player.name });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const playerId = getSleeperPlayerId(player.name);
  const imageHeight = 24;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="px-2 py-1 bg-[#1c283c4b] rounded flex items-center justify-between text-white text-xs"
    >
      {/* Position */}
      <div className="w-[40px] font-semibold">{player.position}</div>

      {/* Headshot */}
      {/* {playerId ? (
        <PlayerImage
          playerId={playerId}
          height={imageHeight}
          className="ml-2 mr-2"
        />
      ) : (
        <div
          className="bg-[#293245] rounded-full ml-2 mr-2"
          style={{ width: imageHeight, height: imageHeight }}
        />
      )} */}

      {/* Name (drag handle) */}
      <div
        className="flex-1 text-center font-medium truncate"
        {...attributes}
        {...listeners}
      >
        {player.name}
      </div>

      {/* Team */}
      <div className="w-[40px] text-xs text-slate-400 text-right">{player.team}</div>

      {/* Remove button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="ml-3 text-red-400 hover:text-red-300"
        aria-label={`Remove ${player.name}`}
      >
        ❌
      </button>
    </div>
  );
};

export default QueueItem;
