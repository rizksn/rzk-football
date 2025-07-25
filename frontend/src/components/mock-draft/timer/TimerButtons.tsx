'use client';

import { useEffect, useRef } from 'react';
import { Power, Pause, Play } from 'lucide-react';

type TimerButtonsProps = {
  timer: number;
  setTimer: React.Dispatch<React.SetStateAction<number>>;
  isTicking: boolean;
  setIsTicking: React.Dispatch<React.SetStateAction<boolean>>;
  draftStarted: boolean;
  onStartDraft: () => void;
};

export default function TimerButtons({
  timer,
  setTimer,
  isTicking,
  setIsTicking,
  draftStarted,
  onStartDraft,
}: TimerButtonsProps) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const DEFAULT_TIMER = 120;

  useEffect(() => {
    if (isTicking && timer > 0) {
      clearInterval(intervalRef.current as NodeJS.Timeout);
      intervalRef.current = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(intervalRef.current as NodeJS.Timeout);
  }, [isTicking, timer]);

  const showPlayIcon = draftStarted && !isTicking;

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => {
          onStartDraft();
          setIsTicking(true); 
        }}
        disabled={draftStarted}
        className="p-2 m-1 bg-[#39fb1fae] hover:bg-[#39fb1f] rounded text-white shadow-[0_0_10px_rgba(0,136,255,0.6)] hover:shadow-[0_0_14px_rgba(0,255,160,0.8)] transition-all duration-200 transform hover:scale-110 hover:-translate-y-[1px] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Power className="w-3 h-3" />
      </button>

      <button
        onClick={() => setIsTicking(prev => !prev)}
        disabled={!draftStarted}
        className="p-2 bg-[#fb391faf] hover:bg-[#fb391f] rounded text-white shadow-[0_0_10px_rgba(0,136,255,0.6)] hover:shadow-[0_0_14px_rgba(0,255,160,0.8)] transition-all duration-200 transform hover:scale-110 hover:-translate-y-[1px] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {showPlayIcon ? (
          <Play className="w-3 h-3" />
        ) : (
          <Pause className="w-3 h-3" />
        )}
      </button>
    </div>
  );
}
