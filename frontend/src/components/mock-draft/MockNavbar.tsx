'use client';

import { MockNavbarProps } from "@/types";

const MockNavbar = ({ draftStarted, onStartDraft, onOpenSettings }: MockNavbarProps) => {
  return (
    <div className="w-full h-8 bg-slate-850 flex items-center justify-between px-4 text-white text-xs">
      <div className="flex items-center gap-3">
        <button
          className="text-xs px-3 py-[2px] border border-white/20 rounded-md hover:bg-white/10 transition"
          onClick={onOpenSettings}
        >
          Draft Settings
        </button>
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