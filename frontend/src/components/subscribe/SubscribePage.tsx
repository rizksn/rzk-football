"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import { loginWithGoogle, auth } from "@/utils/firebase";

export default function SubscribePage() {
  const { user, isPaidUser } = useAuthContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // 🔁 Redirect if user is already paid
  useEffect(() => {
    if (isPaidUser) {
      router.push("/mockdraft");
    }
  }, [isPaidUser, router]);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      let currentUser = user;

      // 🔐 Force login if not logged in
      if (!currentUser) {
        await loginWithGoogle();

        // Wait for Firebase to hydrate currentUser
        currentUser = auth.currentUser;
        let retries = 10;
        while (!currentUser && retries-- > 0) {
          await new Promise((r) => setTimeout(r, 200));
          currentUser = auth.currentUser;
        }
      }

      if (!currentUser) throw new Error("Login failed. Please try again.");

      const token = await currentUser.getIdToken();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/stripe/checkout`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.status === 400 && data?.message === "User already subscribed") {
        alert("You’re already subscribed! Redirecting to draft...");
        router.push("/draft");
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        alert("Failed to start checkout session.");
      }
    } catch (err) {
      console.error("❌ Stripe checkout error:", err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-12 flex flex-col items-center">
      <div className="max-w-2xl w-full space-y-8 text-center">
        <h1 className="text-4xl font-bold">Unlock Premium Draft Tools</h1>
        <p className="text-white/70 text-lg">
          Gain access to advanced settings like format, scoring, and platform
          filters — plus future AI features.
        </p>

        <div className="bg-slate-900 rounded-xl p-6 shadow-lg space-y-4">
          <h2 className="text-2xl font-semibold">RZK Premium</h2>
          <p className="text-white/60">
            Recurring monthly membership. Cancel anytime.
          </p>
          <ul className="text-left list-disc pl-6 text-white/70 space-y-1">
            <li>Draft format customization (1QB, Superflex, redraft, etc)</li>
            <li>Platform-specific ADP (Sleeper, FFPC, Yahoo...)</li>
            <li>AI-powered draft simulations</li>
            <li>Save custom rankings and keeper leagues</li>
            <li>More features coming this season</li>
          </ul>

          <button
            onClick={handleSubscribe}
            disabled={loading}
            className={`w-full px-6 py-3 rounded-lg font-semibold ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white transition`}
          >
            {loading ? "Please wait..." : "Subscribe for $0.99/month"}
          </button>
        </div>

        <p className="text-xs text-white/40">
          Already subscribed? Changes take effect automatically.
        </p>
      </div>
    </div>
  );
}
