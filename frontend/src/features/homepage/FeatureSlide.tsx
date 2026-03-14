import Link from "next/link";

interface SlideProps {
  title: string;
  desc: string;
  cta?: string;
  href?: string;
}

export default function FeatureSlide({ title, desc, cta, href }: SlideProps) {
  return (
    <section className="relative bg-[#080029] text-white py-20 px-6 sm:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight tracking-tight">
            {title}
          </h1>
          <p className="mt-6 text-lg text-gray-300 max-w-xl">{desc}</p>
          {cta && href && (
            <Link
              href={href}
              className="mt-8 inline-block rounded-xl bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:bg-blue-500"
            >
              {cta}
            </Link>
          )}
        </div>
        <div className="flex-1">
          <div className="w-[640px] h-[360px] rounded-xl bg-gray-800 border border-gray-700 shadow-lg flex items-center justify-center text-gray-500 text-sm">
            [Placeholder image]
          </div>
        </div>
      </div>
    </section>
  );
}
