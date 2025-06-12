"use client";

import { loginWithGoogle, logout } from "@/utils/firebase";
import { useAuth } from "@/utils/useAuth";

export default function AuthTest() {
  const { user, isLoggedIn } = useAuth();

  return (
    <div className="p-4">
      {isLoggedIn ? (
        <>
          <p>👋 Welcome, {user?.displayName}</p>
          <button onClick={logout}>Log out</button>
        </>
      ) : (
        <button onClick={loginWithGoogle}>Log in with Google</button>
      )}
    </div>
  );
}