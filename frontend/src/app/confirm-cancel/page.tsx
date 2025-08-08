"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthContext } from "@/context/AuthContext";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

export default function ConfirmCancelPage() {
  const router = useRouter();
  const { isPaidUser } = useAuthContext();
  const [loading, setLoading] = useState(false);

  // If they're not premium, don't let them sit on this page
  useEffect(() => {
    if (isPaidUser === false) router.replace("/settings");
  }, [isPaidUser, router]);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth("/api/stripe/cancel", { method: "POST" });
      const data = await res.json();

      if (!res.ok)
        throw new Error(data?.detail || data?.message || "Cancel failed");

      toast.success("Subscription canceled");
      router.push("/cancel");
    } catch (err: any) {
      console.error("Cancel error:", err);
      toast.error(err?.message || "Cancel failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="space-y-4 text-center max-w-md">
        <h1 className="text-3xl font-bold">Cancel subscription?</h1>
        <p className="text-white/70">
          Are you sure? Your subscription will remain active until the end of
          your billing period.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`px-6 py-2 rounded font-semibold ${
              loading
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading ? "Cancelling..." : "Yes, cancel"}
          </button>
          <button
            onClick={() => router.push("/settings")}
            disabled={loading}
            className="px-6 py-2 rounded bg-slate-700 hover:bg-slate-600"
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}
