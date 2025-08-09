"use client";

import { useEffect, useState, useCallback } from "react";
import { auth, listenToAuth, logout } from "./firebase";
import type { User } from "firebase/auth";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isPaidUser, setIsPaidUser] = useState(false);
  const [cancelScheduled, setCancelScheduled] = useState(false);
  const [subscriptionEndsOn, setSubscriptionEndsOn] = useState<string | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  const refreshAuth = useCallback(async () => {
    if (!auth.currentUser) return;
    const res = await fetchWithAuth(`${BACKEND_URL}/api/auth/persist`, {
      method: "POST",
    });
    const json = await res.json();
    setIsPaidUser(json?.is_premium === true);
    setCancelScheduled(!!json?.cancel_scheduled);
    setSubscriptionEndsOn(json?.current_period_end ?? null);
  }, []);

  useEffect(() => {
    const unsubscribe = listenToAuth(async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          await refreshAuth();
        } catch (err) {
          console.error("❌ persist error:", err);
          setIsPaidUser(false);
          setCancelScheduled(false);
          setSubscriptionEndsOn(null);
        }
      } else {
        setIsPaidUser(false);
        setCancelScheduled(false);
        setSubscriptionEndsOn(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [refreshAuth]);

  const setCancelInfo = (endISO: string | null) => {
    setCancelScheduled(true);
    setSubscriptionEndsOn(endISO);
  };

  return {
    user,
    isLoggedIn: !!user,
    isPaidUser,
    cancelScheduled,
    subscriptionEndsOn,
    loading,
    refreshAuth,
    setCancelInfo,
    logout,
  };
}
