'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const { user, isPaidUser, loginWithGoogle, logout } = useAuthContext(); 

  const isMockDraft = pathname.startsWith("/mockdraft");

  return (
    <nav className={`w-full flex flex-col ${isMockDraft ? "bg-black" : "bg-[#f3f0ff]"} text-${isMockDraft ? "white" : "black"}`}>
      <div className="py-4 px-6 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg">RZK Football</Link>

        <div className="flex gap-4 items-center">
          {pathname === "/" && (
            <>
              <Link href="/mockdraft" className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded">
                Enter Draft Room
              </Link>

              {!isPaidUser && (
                <Link href="/subscribe" className="text-sm underline">
                  Subscribe
                </Link>
              )}
            </>
          )}

          {user ? (
            <button onClick={logout} className="text-sm underline">Logout</button>
          ) : (
            <button onClick={loginWithGoogle} className="text-sm underline">Login</button>
          )}
        </div>
      </div>
    </nav>
  );
}
