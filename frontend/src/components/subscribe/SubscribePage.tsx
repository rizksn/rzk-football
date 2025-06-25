'use client';

import { useAuthContext } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { loginWithGoogle } from '@/utils/firebase'; // make sure this path is correct

export default function SubscribePage() {
  const { user, isPaidUser } = useAuthContext();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Redirect paid users immediately
  useEffect(() => {
    if (isPaidUser) {
      router.push('/draft');
    }
  }, [isPaidUser, router]);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      if (!user) {
        await loginWithGoogle();
        // Wait briefly to ensure user context updates (optional tweak)
        await new Promise((r) => setTimeout(r, 500));
      }

      console.log("📦 Sending user_id:", user?.uid);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/create-checkout-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user?.uid }),
      });

      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to start checkout session.');
      }
    } catch (err) {
      console.error('❌ Stripe checkout error:', err);
      alert('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white px-6 py-12 flex flex-col items-center">
      <div className="max-w-2xl w-full space-y-8 text-center">
        <h1 className="text-4xl font-bold">Unlock Premium Draft Tools</h1>
        <p className="text-white/70 text-lg">
          Gain access to advanced settings like format, scoring, and platform filters — plus future AI features.
        </p>

        <div className="bg-slate-900 rounded-xl p-6 shadow-lg space-y-4">
          <h2 className="text-2xl font-semibold">RZK Premium</h2>
          <p className="text-white/60">One-time purchase. Full access to all draft formats.</p>
          <ul className="text-left list-disc pl-6 text-white/70 space-y-1">
            <li>Draft format customization (1QB, Superflex, etc)</li>
            <li>Platform-specific ADP (Sleeper, FFPC, Yahoo...)</li>
            <li>AI-powered draft simulations</li>
            <li>More features coming this season</li>
          </ul>

          {/* Stripe payment button */}
          <button
            onClick={handleSubscribe}
            disabled={loading}
            className={`w-full px-6 py-3 rounded-lg font-semibold ${
              loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
            } text-white transition`}
          >
            {loading ? 'Please wait...' : 'Subscribe for $0.99'}
          </button>
        </div>

        <p className="text-xs text-white/40">Already subscribed? Changes take effect automatically.</p>
      </div>
    </div>
  );
}
