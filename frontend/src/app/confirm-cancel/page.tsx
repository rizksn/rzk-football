"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthContext } from "@/context/AuthContext";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

function formatDate(iso?: string | null) {
  if (!iso) return "";
  const d = new Date(iso); // backend returns ISO yyyy-mm-dd
  return isNaN(d.getTime())
    ? ""
    : d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
}

export default function ConfirmCancelPage() {
  const router = useRouter();
  const { isPaidUser, setCancelInfo } = useAuthContext();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isPaidUser === false) router.replace("/subscribe");
  }, [isPaidUser, router]);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuth(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/stripe/cancel`,
        { method: "POST" }
      );
      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.detail || data?.message || "Cancel failed");

      // Instantly reflect new state in the header (cancelScheduled + end date)
      setCancelInfo(data?.current_period_end ?? null);

      const endText = data?.current_period_end
        ? ` (ends ${formatDate(data.current_period_end)})`
        : "";
      toast.success(`Subscription scheduled to cancel${endText}`);

      router.replace("/cancel");
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
            onClick={() => router.push("/")}
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
