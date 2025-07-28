import { Player } from "@/types/core/player";
import DisplayPanel from "./DisplayPanel";

interface DisplayPanelsProps {
  leftPlayer: Player | null;
  rightPlayer: Player | null;
}

export default function DisplayPanels({
  leftPlayer,
  rightPlayer,
}: DisplayPanelsProps) {
  return (
    <div className="w-full mb-[12px] perspective-[800px]">
      <div className="absolute inset-0 shadow-[0_5px_10px_rgba(9,28,28,0.57)] bg-[rgba(9,28,28,0.57)] rounded-md z-0 pointer-events-none" />

      {/* ✅ Two panels on xl+ screens */}
      <div className="hidden xl:grid grid-cols-2 gap-1">
        <DisplayPanel player={leftPlayer} />
        <DisplayPanel player={rightPlayer} />
      </div>

      {/* ✅ One panel on smaller screens */}
      <div className="xl:hidden">
        <DisplayPanel player={leftPlayer} wide />
      </div>
    </div>
  );
}
