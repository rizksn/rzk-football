'use client';

import Link from "next/link";
import { MockNavbarProps } from "@/types/ui/components";
import { Menu } from '@headlessui/react';
import { useAuth } from '@/utils/useAuth';
import { loginWithGoogle } from '@/utils/firebase';
import { User, LogOut, CreditCard, Settings } from 'lucide-react';
import TimerButtons from './timer/TimerButtons';
import TimerDisplay from './timer/TimerDisplay';

const MockNavbar = ({
  draftStarted,
  onStartDraft,
  onOpenSettings,
  timer,
  setTimer,
  isTicking,
  setIsTicking,
}: MockNavbarProps) => {
  const { user, isLoggedIn, isPaidUser, logout } = useAuth();

  const subscribe = async () => {
    const token = await user?.getIdToken();
    if (!token) return;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/stripe/checkout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const { url } = await res.json();
    if (url) window.location.href = url;
  };

  const cancelMembership = async () => {
    const token = await user?.getIdToken();
    if (!token) return;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/stripe/cancel`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.ok) {
      alert("Membership canceled. Refreshing...");
      window.location.reload(); // 👈 This will re-trigger auth fetch
    } else {
      alert("Failed to cancel membership.");
    }
  };

  return (
    <div className="w-full h-12 bg-slate-850 flex items-center justify-between px-4 text-white text-xs relative">
      {/* LEFT: Logo */}
      <div className="flex items-center">
        <Link href="/" className="font-bold text-lg">
          RZK Football
        </Link>
      </div>

      {/* CENTER: Buttons + Timer slightly to the right */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="flex items-center">
          <TimerButtons
            timer={timer}
            setTimer={setTimer}
            isTicking={isTicking}
            setIsTicking={setIsTicking}
            draftStarted={draftStarted}
            onStartDraft={onStartDraft}
          />
          <div className="ml-4">
            <TimerDisplay timer={timer} />
          </div>
        </div>
      </div>

      {/* RIGHT: Settings + Avatar */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSettings}
          title="Draft Settings"
          className="p-2 rounded-full hover:bg-white/10 hover:rotate-12 transition-all duration-150 ease-out"
        >
          <Settings className="w-5 h-5 text-white" />
        </button>

        <Menu as="div" className="relative">
          <Menu.Button className="rounded-full overflow-hidden w-8 h-8">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-xs">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </Menu.Button>

          {/* Dropdown */}
          <Menu.Items className="absolute right-0 mt-2 w-48 bg-slate-800 text-white rounded-md shadow-lg overflow-hidden border border-white/10 z-50">
            {user ? (
              <>
                <div className="px-4 py-2 text-sm text-white/80 border-b border-white/10">
                  {user.displayName || user.email}
                </div>
                <Menu.Item>
                  {({ active }) => (
                    <button className={`w-full px-4 py-2 text-left flex items-center gap-2 ${active ? 'bg-slate-700' : ''}`}>
                      <User className="w-4 h-4" /> Account
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={isPaidUser ? cancelMembership : subscribe}
                      className={`w-full px-4 py-2 text-left flex items-center gap-2 ${active ? 'bg-slate-700' : ''}`}
                    >
                      <CreditCard className="w-4 h-4" />
                      {isPaidUser ? 'Cancel Membership' : 'Subscribe'}
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={logout}
                      className={`w-full px-4 py-2 text-left flex items-center gap-2 ${active ? 'bg-slate-700' : ''}`}
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  )}
                </Menu.Item>
              </>
            ) : (
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={loginWithGoogle}
                    className={`w-full px-4 py-2 text-left ${active ? 'bg-slate-700' : ''}`}
                  >
                    Sign In
                  </button>
                )}
              </Menu.Item>
            )}
          </Menu.Items>
        </Menu>
      </div>
    </div>
  );
};

export default MockNavbar;
