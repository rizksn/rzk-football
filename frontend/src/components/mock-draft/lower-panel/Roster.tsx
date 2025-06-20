'use client';

import { Player } from '@/types';
import RosterPlayer from './RosterPlayer';

type RosterProps = {
  userRoster: Player[];
};

const defaultSlots = [
  'QB', 'RB', 'RB', 'WR', 'WR', 'TE', 'FLX', 'FLX',
  'K', 'DEF', 'BN', 'BN', 'BN', 'BN', 'BN',
];

const Roster = ({ userRoster }: RosterProps) => {
  const filledPlayers = [...userRoster];

  return (
    <ul className="text-white space-y-1">
      {defaultSlots.map((slot, index) => {
        const matchIndex = filledPlayers.findIndex(p =>
          slot === 'FLX' ? ['RB', 'WR', 'TE'].includes(p.position) : p.position === slot
        );

        let player: Player | null = null;
        if (matchIndex !== -1) {
          player = filledPlayers[matchIndex];
          filledPlayers.splice(matchIndex, 1);
        }

        return (
          <RosterPlayer
            key={index}
            slot={slot}
            player={player}
            playerId={player?.player_id ?? null}
          />
        );
      })}
    </ul>
  );
};

export default Roster;