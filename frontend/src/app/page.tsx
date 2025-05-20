import Link from "next/link";
import Image from "next/image"; 

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
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

          {/* Image Slot */}
          <div className="flex-1">
            <Image
              src="/mock-preview.png" 
              alt="Fantasy draft simulator preview"
              width={640}
              height={360}
              className="rounded-xl border border-gray-700 shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="bg-gray-900 text-white py-16 px-6 sm:px-12 lg:px-20 border-t border-gray-800">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Coming Soon to RZK Football
          </h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            We're just getting started. Upcoming features include:
          </p>
          <ul className="mt-6 space-y-3 text-left text-gray-300 max-w-xl mx-auto list-disc list-inside">
            <li>Custom player rankings per league format or platform</li>
            <li>AI Draft Assistant to guide your picks in real time</li>
            <li>Advanced player data, trends, and performance insights</li>
            <li>Fully customizable AI logic (position weighting, team strategy)</li>
          </ul>
          <p className="mt-6 text-sm text-gray-500 italic">
            Have a feature idea? Let us know — we're building this for real players like you.
          </p>
        </div>
      </section>
    </>
  );
}