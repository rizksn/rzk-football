'use client';

import { MockNavbarProps } from "@/types";

const MockNavbar = ({ draftStarted, onStartDraft }: MockNavbarProps) => {
  return (
    <div className="w-full h-8 bg-slate-850 flex items-center justify-between px-4 text-white text-xs">
      <div className="flex gap-3 opacity-80">
        {/* Replace with dynamic values soon */}
        <span>Dynasty</span>
        <span>1QB</span>
        <span>PPR</span>
        <span>Sleeper</span>
      </div>

      <button
        className="bg-[#1356e7e9] hover:bg-green-700 px-4 py-1 rounded-md font-bold text-[11px] leading-none shadow-[0_4px_12px_rgba(0,0,0,0.25)] hover:shadow-[0_6px_18px_rgba(0,0,0,0.35)] transition-all duration-200 transform hover:-translate-y-[1px]"
        onClick={onStartDraft}
        disabled={draftStarted}
      >
        {draftStarted ? 'IN PROGRESS' : 'START'}
      </button>
    </div>
  );
};

export default MockNavbar;