"use client";

import Link from "next/link";
import { MockNavbarProps } from "@/types/ui/components";
import { useAuth } from "@/utils/useAuth";
import { User, Settings, Save, Undo, RotateCcw, SquareX } from "lucide-react";
import TimerButtons from "./timer/TimerButtons";
import TimerDisplay from "./timer/TimerDisplay";
import UserMenu from "@/components/shared/UserMenu";
import { toast } from "sonner";
import { useState, useRef, useEffect } from "react";

const MockNavbar = ({
  draftStarted,
  onStartDraft,
  onOpenSettings,
  timer,
  setTimer,
  isTicking,
  onOpenKeeperModal,
  onPause,
  onResume,
  showPauseButton,
  showPlayButton,
  timerDisabled,
  setTimerDisabled,
  onUndoPick,
  onRestartDraft,
}: MockNavbarProps) => {
  const { user, isLoggedIn, isPaidUser, logout } = useAuth();
  const [showTimerEdit, setShowTimerEdit] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const subscribe = async () => {
    const token = await user?.getIdToken();
    if (!token) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/stripe/checkout`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const { url } = await res.json();
    if (url) window.location.href = url;
  };

  const cancelMembership = async () => {
    const token = await user?.getIdToken();
    if (!token) return;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/stripe/cancel`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.ok) {
      alert("Membership canceled. Refreshing...");
      window.location.reload();
    } else {
      alert("Failed to cancel membership.");
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        showTimerEdit &&
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setShowTimerEdit(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTimerEdit]);

  return (
    <div className="w-full bg-slate-850 text-white text-xs">
      <div className="w-full flex justify-between items-center h-12 px-4">
        {/* LEFT: Logo (hidden on mobile) */}
        <div className="hidden sm:block">
          <Link href="/" className="font-bold text-lg whitespace-nowrap">
            RZK Football
          </Link>
        </div>

        {/* CENTER: Timer + Buttons + Icons */}
        <div className="flex items-center gap-3">
          {/* Timer controls */}
          <TimerButtons
            timer={timer}
            setTimer={setTimer}
            isTicking={isTicking}
            draftStarted={draftStarted}
            onStartDraft={onStartDraft}
            onPause={onPause}
            onResume={onResume}
            showPauseButton={showPauseButton}
            showPlayButton={showPlayButton}
          />
          <div
            className="relative"
            onClick={() => {
              if (!draftStarted) setShowTimerEdit(true);
            }}
          >
            {!showTimerEdit ? (
              <TimerDisplay timer={timer} />
            ) : (
              <div
                ref={containerRef}
                className="flex items-center gap-2 bg-slate-700 px-3 py-2 rounded shadow"
                onClick={(e) => e.stopPropagation()}
              >
                <input
                  type="number"
                  min={0}
                  max={59}
                  className="w-12 px-2 py-1 rounded bg-slate-900 text-white text-right"
                  value={Math.floor(timer / 60)}
                  onChange={(e) => {
                    const minutes = parseInt(e.target.value) || 0;
                    setTimer(minutes * 60 + (timer % 60));
                  }}
                />
                <span className="text-white">:</span>
                <input
                  type="number"
                  min={0}
                  max={59}
                  className="w-12 px-2 py-1 rounded bg-slate-900 text-white text-right"
                  value={timer % 60}
                  onChange={(e) => {
                    const seconds = parseInt(e.target.value) || 0;
                    setTimer(Math.floor(timer / 60) * 60 + seconds);
                  }}
                />
              </div>
            )}
          </div>

          {/* Middle icons */}
          <button
            onClick={() => {
              if (draftStarted) {
                toast.error(
                  "❌ You can't disable the timer after the draft starts."
                );
                return;
              }

              setTimerDisabled((prev) => {
                const next = !prev;
                toast.success(
                  `✅ Timer ${next ? "disabled" : "enabled again"}.`
                );
                return next;
              });
            }}
            disabled={draftStarted}
            title="Disable timer"
            className="p-2 bg-[#60a5faae] hover:bg-[#60a5fa] rounded text-white shadow-[0_0_10px_rgba(59,130,246,0.6)] hover:shadow-[0_0_14px_rgba(59,130,246,0.8)] transition-all duration-200 transform hover:scale-110 hover:-translate-y-[1px] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <SquareX className="w-3 h-3" />
          </button>

          <button
            onClick={onUndoPick}
            title="Undo last pick"
            className="p-2 bg-[#60a5faae] hover:bg-[#60a5fa] rounded text-white shadow-[0_0_10px_rgba(96,165,250,0.6)] hover:shadow-[0_0_14px_rgba(96,165,250,0.8)] transition-all duration-200 transform hover:scale-110 hover:-translate-y-[1px]"
          >
            <Undo className="w-3 h-3" />
          </button>

          <button
            onClick={onRestartDraft}
            title="Restart draft"
            className="p-2 bg-[#60a5faae] hover:bg-[#60a5fa] rounded text-white shadow-[0_0_10px_rgba(37,99,235,0.6)] hover:shadow-[0_0_14px_rgba(37,99,235,0.8)] transition-all duration-200 transform hover:scale-110 hover:-translate-y-[1px]"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>

        {/* RIGHT: Buttons (Save, Settings, Avatar) */}
        <div className="flex items-center gap-4">
          <button
            onClick={onOpenKeeperModal}
            className="text-white hover:text-accent transition"
            title="Save or Load Keepers"
          >
            <Save className="w-5 h-5" />
          </button>
          <button
            onClick={onOpenSettings}
            title="Draft Settings"
            className="rounded-full hover:bg-white/10 hover:rotate-12 transition-all duration-150 ease-out"
          >
            <Settings className="w-5 h-5 text-white" />
          </button>

          <UserMenu />
        </div>
      </div>
    </div>
  );
};

export default MockNavbar;
