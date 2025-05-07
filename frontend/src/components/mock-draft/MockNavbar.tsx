// src/components/mock-draft/MockNavbar.tsx
'use client';

import { MockNavbarProps } from "@/types";

const MockNavbar = ({ draftStarted, onStartDraft }: MockNavbarProps) => {
  return (
    <div className="w-full h-6 bg-slate-850 flex items-center justify-center pt-1 mt-0 text-white">
      <button
        className=" bg-[#1356e7e9] hover:bg-green-700 text-white px-4 py-1 rounded-md font-bold text-[11px] leading-none shadow-[0_4px_12px_rgba(0,0,0,0.25)] hover:shadow-[0_6px_18px_rgba(0,0,0,0.35)] transition-all duration-200 transform hover:-translate-y-[1px]"
        onClick={onStartDraft}
        disabled={draftStarted}
      >
        {draftStarted ? 'IN PROGRESS' : 'START'}
      </button>
    </div>
  );
};

export default MockNavbar;
