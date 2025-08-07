"use client";

import { Menu } from "@headlessui/react";
import { User, LogOut, CreditCard } from "lucide-react";
import { useAuth } from "@/utils/useAuth";
import { loginWithGoogle } from "@/utils/firebase";

export default function UserMenu() {
  const { user, isPaidUser, logout } = useAuth();

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
    <Menu as="div" className="relative">
      <Menu.Button className="rounded-full overflow-hidden w-6 h-6">
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt="avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white text-xs">
            <User className="w-5 h-5 text-white" />
          </div>
        )}
      </Menu.Button>

      <Menu.Items className="absolute right-0 mt-2 w-48 bg-slate-800 text-white rounded-md shadow-lg overflow-hidden border border-white/10 z-50">
        {user ? (
          <>
            <div className="px-4 py-2 text-sm text-white/80 border-b border-white/10">
              {user.displayName || user.email}
            </div>

            <Menu.Item>
              {({ active }) => (
                <button
                  className={`w-full px-4 py-2 text-left flex items-center gap-2 ${
                    active ? "bg-slate-700" : ""
                  }`}
                >
                  <User className="w-4 h-4" /> Account
                </button>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={isPaidUser ? cancelMembership : subscribe}
                  className={`w-full px-4 py-2 text-left flex items-center gap-2 ${
                    active ? "bg-slate-700" : ""
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  {isPaidUser ? "Cancel Membership" : "Subscribe"}
                </button>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={logout}
                  className={`w-full px-4 py-2 text-left flex items-center gap-2 ${
                    active ? "bg-slate-700" : ""
                  }`}
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              )}
            </Menu.Item>
          </>
        ) : (
          <>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={loginWithGoogle}
                  className={`w-full px-4 py-2 text-left flex items-center gap-2 ${
                    active ? "bg-slate-700" : ""
                  }`}
                >
                  <User className="w-4 h-4" />
                  Sign In
                </button>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={async () => {
                    await loginWithGoogle();
                    window.location.href = "/subscribe";
                  }}
                  className={`w-full px-4 py-2 text-left flex items-center gap-2 ${
                    active ? "bg-slate-700" : ""
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  Subscribe
                </button>
              )}
            </Menu.Item>
          </>
        )}
      </Menu.Items>
    </Menu>
  );
}
