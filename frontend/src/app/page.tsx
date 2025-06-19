import Link from "next/link";
import Image from "next/image"; 

const anubisFeatures = [
  {
    title: "Realistic Draft Simulation",
    desc: "Mimics real draft behavior using league-aware modeling — format, positional value, opponent needs.",
  },
  {
    title: "Strategic Presets",
    desc: "Configure Zero RB, Hero WR, Best Player Available, or create your own draft strategy profiles.",
  },
  {
    title: "Custom CPU Behavior",
    desc: "Prioritize WR in standard leagues, QBs in Superflex, or assign specific strategies to each team.",
  },
  {
    title: "Keeper + League Upload",
    desc: "Upload your real league’s structure and keeper list to simulate your actual draft conditions.",
  },
  {
    title: "Variance & Aggression Control",
    desc: "Dial up CPU randomness, aggression, or balance to simulate casual vs competitive leagues.",
  },
  {
    title: "Coming Soon",
    desc: "AI pick rationales, adaptive CPU pivots, and smarter draft context awareness.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-black text-white py-20 px-6 sm:px-12 lg:px-20">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
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

          {/* Anubis Draft Engine (Fixed) */}
          <div>
            <h2 className="text-4xl font-bold text-white mb-12">The Anubis Draft Engine</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-gray-300">
              {anubisFeatures.map((feature, i) => (
                <div
                  key={i}
                  className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow hover:shadow-blue-600/20 transition"
                >
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* The rest of your sections remain unchanged below */}
          {/* Real-Time Fantasy Data, Customization, AI Assistant, Supported Formats, Membership Tiers, Community Build */}

        </div>
      </section>
    </>
  );
}
