"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import UserMenu from "@/features/shared/UserMenu";

export default function Navbar() {
  const pathname = usePathname();
  const { user, isPaidUser, loginWithGoogle, logout } = useAuthContext();

  const isMockDraft = pathname.startsWith("/mockdraft");

  return (
    <nav
      className={`w-full flex flex-col ${
        isMockDraft ? "bg-black" : "bg-[#f3f0ff]"
      } text-${isMockDraft ? "white" : "black"}`}
    >
      <div className="px-4 py-4 flex flex-wrap items-center justify-between gap-y-4 min-h-[3rem]">
        {/* Logo (left) — hidden on mobile */}
        <Link href="/" className="font-bold text-lg z-10 hidden sm:block">
          RZK Football
        </Link>

        {/* Centered buttons */}
        {pathname === "/" && (
          <div className="flex gap-4 items-center mx-auto">
            <Link
              href="/mockdraft"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-md hover:shadow-lg hover:brightness-110 transition-all duration-200 active:scale-95"
            >
              🏈 Enter Draft Room
            </Link>

            {!isPaidUser && (
              <Link
                href="/subscribe"
                className="px-4 py-2 rounded-xl border border-blue-600 text-blue-600 font-medium hover:bg-blue-600 hover:text-white transition-all duration-200 active:scale-95"
              >
                💎 Subscribe
              </Link>
            )}
          </div>
        )}

        {/* Avatar (right) */}
        <div className="z-10">
          <UserMenu />
        </div>
      </div>
    </nav>
  );
}
