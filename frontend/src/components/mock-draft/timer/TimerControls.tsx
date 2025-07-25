'use client';

import { useEffect, useRef } from 'react';
import { Power, Pause, Play } from 'lucide-react';

type TimerControlsProps = {
  timer: number;
  setTimer: React.Dispatch<React.SetStateAction<number>>;
  isTicking: boolean;
  setIsTicking: React.Dispatch<React.SetStateAction<boolean>>;
  draftStarted: boolean;
  onStartDraft: () => void;
};

export default function TimerControls({
  timer,
  setTimer,
  isTicking,
  setIsTicking,
  draftStarted,
  onStartDraft,
}: TimerControlsProps) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const DEFAULT_TIMER = 120;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  useEffect(() => {
    if (isTicking && timer > 0) {
      clearInterval(intervalRef.current as NodeJS.Timeout);
      intervalRef.current = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(intervalRef.current as NodeJS.Timeout);
  }, [isTicking, timer]);

  return (
    <div className="absolute left-1/2 -translate-x-1/2 flex items-center space-x-2">
      {/* 🚀 POWER BUTTON (Start Draft) */}
      <button
        onClick={onStartDraft}
        disabled={draftStarted}
        className={`p-2 m-1 bg-[#39fb1fae] hover:bg-[#39fb1f] rounded text-white shadow-[0_0_10px_rgba(0,136,255,0.6)] hover:shadow-[0_0_14px_rgba(0,255,160,0.8)] transition-all duration-200 transform hover:scale-110 hover:-translate-y-[1px] ${
          draftStarted ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <Power className="w-3 h-3" />
      </button>

      {/* ⏯ PLAY / PAUSE BUTTON */}
      <button
        onClick={() => setIsTicking(prev => !prev)}
        disabled={!draftStarted}
        className={`p-2 bg-[#fb391faf] hover:bg-[#fb391f] rounded text-white shadow-[0_0_10px_rgba(0,136,255,0.6)] hover:shadow-[0_0_14px_rgba(0,255,160,0.8)] transition-all duration-200 transform hover:scale-110 hover:-translate-y-[1px] ${
          !draftStarted ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isTicking ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
      </button>

      {/* ⏱ TIMER DISPLAY */}
      <div className="text-white text-sm font-mono px-3 py-1 rounded bg-black/30 border border-white/10">
        {formatTime(timer)}
      </div>
    </div>
  );
}
