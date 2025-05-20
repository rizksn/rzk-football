import Link from "next/link";

export default function HomePage() {
  return (
    <section className="relative bg-black text-white py-20 px-6 sm:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">

        {/* Text Column */}
        <div className="flex-1">
          <p className="text-sm uppercase tracking-widest text-blue-500 mb-4">
            Built for serious fantasy football minds
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
            AI-Powered Fantasy Football Draft Simulator
          </h1>
          <p className="mt-6 text-lg text-gray-300 max-w-xl">
            Simulate redraft, dynasty, or best ball drafts with real ADP and smart CPU logic.
            RZK Football helps you practice like the pros — powered by data, optimized by AI.
          </p>
          <Link
            href="/mockdraft"
            className="mt-8 inline-block rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-blue-500"
          >
            Enter Mock Draft Room
          </Link>
        </div>

        {/* Image or UI Preview Slot */}
        <div className="flex-1">
          <div className="w-full h-64 sm:h-80 lg:h-96 bg-gray-800 rounded-2xl border border-gray-700 shadow-inner flex items-center justify-center">
            <span className="text-gray-500 text-sm">
              Future draft UI preview or player image here
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}