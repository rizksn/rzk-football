"use client";

import Link from "next/link";

export default function SuccessPage() {
  // If needed in future for conditional logic
  const isPaidUser = true; // or pull from context/state

  return (
    <div className="min-h-screen flex items-center justify-center text-white bg-slate-950">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold">You're subscribed!</h1>
        <p className="text-white/70">
          You now have full access to premium features. You can start your draft
          anytime.
        </p>

        {/* Action buttons */}
        <div className="flex gap-4 justify-center pt-2">
          <Link
            href="/mockdraft"
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-md hover:shadow-lg hover:brightness-110 transition-all duration-200 active:scale-95"
          >
            🏈 Enter Draft Room
          </Link>
        </div>
      </div>
    </div>
  );
}
