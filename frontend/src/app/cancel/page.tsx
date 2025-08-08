export default function CancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center text-white bg-slate-950">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">
          Subscription scheduled for cancellation
        </h1>
        <p className="text-white/70">
          You’ll keep premium access until the end of your current billing
          period. You can renew anytime from the settings menu or homepage.
        </p>
      </div>
    </div>
  );
}
