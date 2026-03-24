import type { AdpPlayerResponseDto } from "@/features/mock-draft/api/dto";
import DisplayPanel from "./DisplayPanel";

interface DisplayPanelsProps {
  leftPlayer: AdpPlayerResponseDto | null;
  rightPlayer: AdpPlayerResponseDto | null;
}

export default function DisplayPanels({
  leftPlayer,
  rightPlayer,
}: DisplayPanelsProps) {
  return (
    <div className="w-full mb-[12px] perspective-[800px]">
      {/* 🟩 Backdrop */}
      <div className="absolute inset-0 shadow-[0_5px_10px_rgba(9,28,28,0.57)] bg-[rgba(9,28,28,0.57)] rounded-md z-0 pointer-events-none" />

      {/* ✅ Desktop layout — min 1400px at sm+ */}
      <div className="hidden sm:grid grid-cols-2 gap-1 sm:min-w-[1400px] max-w-[1600px] mx-auto">
        <DisplayPanel player={leftPlayer} />
        <DisplayPanel player={rightPlayer} />
      </div>

      {/* ✅ Mobile layout (one panel only) */}
      <div className="sm:hidden">
        <DisplayPanel player={leftPlayer} wide />
      </div>
    </div>
  );
}
