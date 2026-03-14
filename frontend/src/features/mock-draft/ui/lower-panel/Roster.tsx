import { useMemo } from "react";
import { Player } from "@/types/core/player";
import RosterPlayer from "./RosterPlayer";
import { DraftRosterSettings } from "@/types/draft/config";

type RosterProps = {
  userRoster: Player[];
  rosterSettings: DraftRosterSettings;
};

const Roster = ({ userRoster, rosterSettings }: RosterProps) => {
  const filledPlayers = [...userRoster];

  const slots: string[] = useMemo(() => {
    const baseSlots: string[] = [];

    // Positional slots (e.g. QB: 1, RB: 2, FLX: 2, etc)
    for (const [position, { count }] of Object.entries(
      rosterSettings.positions
    )) {
      for (let i = 0; i < count; i++) {
        baseSlots.push(position);
      }
    }

    // Add bench slots
    for (let i = 0; i < rosterSettings.benchCount; i++) {
      baseSlots.push("BN");
    }

    return baseSlots;
  }, [rosterSettings]);

  return (
    <ul className="text-white space-y-1">
      {slots.map((slot, index) => {
        const matchIndex = filledPlayers.findIndex((p) =>
          slot === "FLX"
            ? ["RB", "WR", "TE"].includes(p.position)
            : slot === "SF"
            ? ["QB", "RB", "WR", "TE"].includes(p.position)
            : p.position === slot
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
