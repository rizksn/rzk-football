"use client";

import Link from "next/link";
import { MockNavbarProps } from "@/types/ui/components";
import { useAuth } from "@/utils/useAuth";
import { User, Settings, Save, Undo, RotateCcw, SquareX } from "lucide-react";
import TimerButtons from "./timer/TimerButtons";
import TimerDisplay from "./timer/TimerDisplay";
import UserMenu from "@/components/shared/UserMenu";

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
}: MockNavbarProps) => {
  const { user, isLoggedIn, isPaidUser, logout } = useAuth();

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
          <TimerDisplay timer={timer} />

          {/* Middle icons */}
          <button
            onClick={() => console.log("Disable timer")}
            className="text-white hover:text-sky-400 transition"
            title="Disable timer"
          >
            <SquareX className="w-5 h-5" />
          </button>
          <button
            onClick={() => console.log("Undo pick")}
            className="text-white hover:text-red-400 transition"
            title="Undo last pick"
          >
            <Undo className="w-5 h-5" />
          </button>

          <button
            onClick={() => console.log("Restart draft")}
            className="text-white hover:text-yellow-400 transition"
            title="Restart draft"
          >
            <RotateCcw className="w-5 h-5" />
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
