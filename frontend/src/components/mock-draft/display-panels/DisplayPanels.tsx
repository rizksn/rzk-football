import { Player } from '@/types';
import DisplayPanel from './DisplayPanel';

interface DisplayPanelsProps {
  leftPlayer: Player | null;
  rightPlayer: Player | null;
  isSplit: boolean;
}

export default function DisplayPanels({
  leftPlayer,
  rightPlayer,
  isSplit,
}: DisplayPanelsProps) {
  return (
    <div className="w-full mb-[12px] perspective-[800px]">
      <div className="absolute inset-0 shadow-[0_5px_10px_rgba(9,28,28,0.57)] bg-[rgba(9,28,28,0.57)]  rounded-md z-0 pointer-events-none" />

      {isSplit ? (
        <div className="grid grid-cols-2 gap-1">
          <DisplayPanel player={leftPlayer} />
          <DisplayPanel player={rightPlayer} />
        </div>
      ) : (
        <DisplayPanel player={leftPlayer} wide />
      )}
    </div>
  );
}

// rgba(0,255,255,0.3)