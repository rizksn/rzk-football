import Link from "next/link";

export default function HomePage() {
  return (
    <main className="p-8 text-white">
      <h1 className="text-4xl font-bold mb-4">Welcome to RZK Football</h1>
      <Link
        href="/mockdraft"
        className="text-blue-400 underline hover:text-blue-200"
      >
        Enter Mock Draft Room
      </Link>
    </main>
  );
}
