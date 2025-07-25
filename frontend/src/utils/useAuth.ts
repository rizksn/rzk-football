import { useEffect, useState } from "react";
import { auth, listenToAuth } from "./firebase";
import type { User } from "firebase/auth";
import { logout } from './firebase';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isPaidUser, setIsPaidUser] = useState(false);

  useEffect(() => {
    const unsubscribe = listenToAuth(async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          const token = await firebaseUser.getIdToken();
          const res = await fetch(`${BACKEND_URL}/api/auth/persist`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const json = await res.json();
          setIsPaidUser(json?.stripe_active === true);
        } catch (err) {
          console.error("❌ Error persisting user / getting Stripe status:", err);
          setIsPaidUser(false);
        }
      } else {
        setIsPaidUser(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return {
    user,
    isLoggedIn: !!user,
    isPaidUser,
    logout,
  };
}
