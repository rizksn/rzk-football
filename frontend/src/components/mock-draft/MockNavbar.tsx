'use client';

import Link from "next/link";
import { MockNavbarProps } from "@/types/ui/components";
import { Menu } from '@headlessui/react';
import { useAuth } from '@/utils/useAuth';
import { User, LogOut, Power, Pause, CreditCard, Settings } from 'lucide-react';

const MockNavbar = ({ draftStarted, onStartDraft, onOpenSettings }: MockNavbarProps) => {
  const { user, isLoggedIn, isPaidUser, logout } = useAuth();

  return (
    <div className="w-full h-12 bg-slate-850 flex items-center justify-between px-4 text-white text-xs relative">
      {/* LEFT: Logo */}
      <div className="flex items-center">
        <Link href="/" className="font-bold text-lg">
          RZK Football
        </Link>
      </div>

      {/* CENTER: Start Button */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <button
          onClick={onStartDraft}
          disabled={draftStarted}
          className="p-2 m-1 bg-[#39fb1fae] hover:bg-[#39fb1f] rounded text-white shadow-[0_0_10px_rgba(0,136,255,0.6)] hover:shadow-[0_0_14px_rgba(0,255,160,0.8)] transition-all duration-200 transform hover:scale-110 hover:-translate-y-[1px]"
        >
          <Power className="w-3 h-3"/>
        </button>
        <button
          onClick={onStartDraft}
          disabled={draftStarted}
          className="p-2 m-1 bg-[#fb391faf] hover:bg-[#fb391f] rounded text-white shadow-[0_0_10px_rgba(0,136,255,0.6)] hover:shadow-[0_0_14px_rgba(0,255,160,0.8)] transition-all duration-200 transform hover:scale-110 hover:-translate-y-[1px]"
        >
          <Pause className="w-3 h-3"/>
        </button>
      </div>

      {/* RIGHT: Settings + Avatar */}
      <div className="flex items-center gap-0">
        <button
          onClick={onOpenSettings}
          title="Draft Settings"
          className="p-2 m-1 rounded-full hover:bg-white/10 hover:rotate-12 transition-all duration-150 ease-out"
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
                <Menu.Item>
                  {({ active }) => (
                    <button className={`w-full px-4 py-2 text-left flex items-center gap-2 ${active ? 'bg-slate-700' : ''}`}>
                      <User className="w-4 h-4" /> Account
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button className={`w-full px-4 py-2 text-left flex items-center gap-2 ${active ? 'bg-slate-700' : ''}`}>
                      <CreditCard className="w-4 h-4" /> Subscribe
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
                    onClick={() => console.log('Trigger login')}
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