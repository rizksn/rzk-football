import { useEffect, useState } from "react";
import { auth, listenToAuth } from "./firebase";
import { persistUser } from "./auth"; 
import type { User } from "firebase/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = listenToAuth(async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          await persistUser(); // 👈 ping backend when user logs in
        } catch (err) {
          console.error("❌ Failed to persist user:", err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, isLoggedIn: !!user };
}