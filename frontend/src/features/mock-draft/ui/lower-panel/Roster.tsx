import { useMemo } from "react";

import type {
  DraftedPlayer,
  DraftRosterConfig,
} from "@/features/mock-draft/session/session.models";
import RosterPlayer from "./RosterPlayer";

type RosterProps = {
  userRoster: DraftedPlayer[];
  rosterSettings: DraftRosterConfig | null;
};

const Roster = ({ userRoster, rosterSettings }: RosterProps) => {
  const slots: string[] = useMemo(() => {
    if (!rosterSettings) return [];

    const baseSlots: string[] = [];

    for (const [position, count] of Object.entries(rosterSettings.positions)) {
      for (let i = 0; i < count; i++) {
        baseSlots.push(position);
      }
    }

    for (let i = 0; i < rosterSettings.benchCount; i++) {
      baseSlots.push("BN");
    }

    return baseSlots;
  }, [rosterSettings]);

  const filledPlayers = [...userRoster];

  return (
    <ul className="text-white space-y-1">
      {slots.map((slot, index) => {
        const matchIndex = filledPlayers.findIndex((p) =>
          slot === "FLX"
            ? ["RB", "WR", "TE"].includes(p.position)
            : slot === "SF"
              ? ["QB", "RB", "WR", "TE"].includes(p.position)
              : p.position === slot,
        );

        let player: DraftedPlayer | null = null;
        if (matchIndex !== -1) {
          player = filledPlayers[matchIndex];
          filledPlayers.splice(matchIndex, 1);
        }

        return <RosterPlayer key={index} slot={slot} player={player} />;
      })}
    </ul>
  );
};

export default Roster;
