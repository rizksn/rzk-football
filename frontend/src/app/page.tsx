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

      {/* Platform Overview Section */}
      <section className="bg-gray-950 text-white py-24 px-6 sm:px-12 lg:px-20 border-t border-gray-800">
        <div className="max-w-6xl mx-auto space-y-20">
          {/* Mission */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-gray-300 max-w-4xl">
              To build the most intelligent, customizable, and immersive mock draft experience ever created.
              Not just another simulator — RZK Football is a <span className="text-blue-400 font-semibold">data-driven cockpit</span>, engineered to help you dominate any fantasy league format through AI reasoning, real-world draft modeling, and real-time strategy assistance.
            </p>
          </div>

          {/* Anubis Draft Engine */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">🧠 The Anubis Draft Engine</h2>
            <ul className="space-y-2 text-gray-300 list-disc list-inside">
              <li>Simulates real-world drafting behavior using advanced modeling</li>
              <li>Adjusts for league format, positional value, and opponent team needs</li>
              <li>Supports strategic presets like Zero RB, Hero WR, and BPA</li>
              <li>Controls for randomness and aggression to mimic human variance</li>
              <li>Users can adjust CPU behavior to prioritize certain positions (e.g. WR-heavy, QB-heavy in Superflex)</li>
              <li>Assign different draft strategies to specific CPU teams for realism</li>
              <li>Upload league settings and keeper data to simulate your exact league</li>
              <li>Coming soon: Pick explanations, mid-draft pivots, and smarter CPU logic</li>
            </ul>
          </div>

          {/* Data Section */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">📊 Real-Time Fantasy Data</h2>
            <ul className="space-y-2 text-gray-300 list-disc list-inside">
              <li>Pulls live ADP from platforms like Sleeper, FantasyPros, DraftSharks</li>
              <li>Filter player pool by team, injury status, position, and trend</li>
              <li>Import your own rankings or sync subscribed services</li>
              <li>Platform-specific accuracy for redraft, dynasty, rookie, and best ball</li>
            </ul>
          </div>

          {/* Customization */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">🛠️ Draft Room Customization</h2>
            <ul className="space-y-2 text-gray-300 list-disc list-inside">
              <li>Reorder and toggle UI panels to create your ideal layout</li>
              <li>Side-by-side player comparisons</li>
              <li>Persistent queue + roster display for control during the draft</li>
              <li>Save layouts per league or strategy profile</li>
              <li>Practice and test trades, mock draft replays, and scenario walkthroughs</li>
            </ul>
          </div>

          {/* AI Draft Assistant */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">🤖 AI Draft Assistant (Coming Soon)</h2>
            <p className="text-gray-300 mb-4 max-w-3xl">
              Like having your own fantasy coach mid-draft. Our assistant will answer questions, track your strategy, and provide live suggestions.
            </p>
            <ul className="space-y-2 text-gray-300 list-disc list-inside">
              <li>“Should I go WR here or lock up my QB?” — get real-time answers</li>
              <li>Knows your roster, strategy, league format, and draft context</li>
              <li>Warns you if you’re veering off-plan</li>
              <li>Explains CPU picks and suggests counter-moves</li>
              <li>Future modes: analytics GM, casual coach, aggressive strategist</li>
            </ul>
          </div>

          {/* Supported Formats */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">🧪 Supported Formats</h2>
            <p className="text-gray-300">RZK Football supports every league type:</p>
            <ul className="mt-4 flex flex-wrap gap-4 text-sm text-blue-300">
              <li>Redraft</li>
              <li>Dynasty</li>
              <li>Rookie</li>
              <li>Keeper</li>
              <li>Superflex / 2QB</li>
              <li>PPR / Half-PPR / Non-PPR</li>
              <li>Custom roster structures</li>
            </ul>
          </div>

          {/* Membership Tiers */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">🔒 Membership Tiers (Coming Soon)</h2>
            <table className="w-full text-left text-gray-300 border-t border-gray-700 mt-6">
              <thead>
                <tr className="text-blue-400">
                  <th className="py-2">Tier</th>
                  <th className="py-2">Features</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-700">
                  <td className="py-3 font-bold">Free</td>
                  <td className="py-3">Dynasty 1QB mocks, basic data, core UI</td>
                </tr>
                <tr className="border-t border-gray-700">
                  <td className="py-3 font-bold">Pro ($0.99/mo)</td>
                  <td className="py-3">Redraft, Best Ball, Superflex access, advanced tools</td>
                </tr>
                <tr className="border-t border-gray-700">
                  <td className="py-3 font-bold">Elite (TBD)</td>
                  <td className="py-3">Full AI co-pilot, strategy coach, premium data</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Community Build */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">💬 Built With the Community</h2>
            <p className="text-gray-300 max-w-3xl">
              We’re building this platform with real fantasy minds like you.
              Share your ideas, request features, and vote on our public roadmap.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
