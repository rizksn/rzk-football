import HeroCarousel from "@/components/homepage/HeroCarousel";

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
    <main>
      <HeroCarousel />

      {/* Other stuff like Testimonials, Suggestion Box, Pricing, etc can go here */}

      {/* 🔽 Mission + Anubis Draft Engine moved to bottom */}
      <section className="bg-[#090032] text-white py-24 px-6 sm:px-12 lg:px-20 border-t border-gray-800">
        <div className="max-w-6xl mx-auto space-y-20">
          {/* Mission */}
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-gray-300 max-w-4xl">
              To build the most intelligent, customizable, and immersive mock
              draft experience ever created. Not just another simulator — RZK
              Football is a{" "}
              <span className="text-blue-400 font-semibold">
                data-driven cockpit
              </span>
              , engineered to help you dominate any fantasy league format
              through AI reasoning, real-world draft modeling, and real-time
              strategy assistance.
            </p>
          </div>

          {/* The Anubis Draft Engine */}
          <div>
            <h2 className="text-4xl font-bold text-white mb-12">
              The Anubis Draft Engine
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-gray-300">
              {anubisFeatures.map((feature, i) => (
                <div
                  key={i}
                  className="bg-gray-900 p-6 rounded-xl border border-gray-800 shadow hover:shadow-blue-600/20 transition"
                >
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
