import { useEffect, useState } from "react";
import { auth, listenToAuth } from "./firebase";
import type { User } from "firebase/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = listenToAuth(setUser);
    return () => unsubscribe();
  }, []);

  return { user, isLoggedIn: !!user };
}
