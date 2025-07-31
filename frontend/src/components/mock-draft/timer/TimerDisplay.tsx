"use client";

type TimerDisplayProps = {
  timer: number;
};

export default function TimerDisplay({ timer }: TimerDisplayProps) {
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="text-white text-sm font-mono px-3 py-1 rounded bg-black/30 border border-white/10">
      {formatTime(timer)}
    </div>
  );
}
