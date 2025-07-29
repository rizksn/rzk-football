import { defaultMetadata } from "./metadata";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "sonner";
import ClientNavbarWrapper from "@/components/layout/ClientNavbarWrapper";
import "./globals.css";

export const metadata = defaultMetadata;

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "RZK Football",
  url: "https://rzkfootball.com",
  description:
    "Simulate fantasy football drafts instantly with our AI-powered mock draft tool. Practice redraft, dynasty, or best ball formats with up-to-date ADP and player data.",
  applicationCategory: "SportsApplication",
  browserRequirements: "Requires JavaScript",
  operatingSystem: "All",
  inLanguage: "en-US",
  offers: {
    "@type": "Offer",
    price: "0.00",
    priceCurrency: "USD",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* 🧠 Performance + font optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
          rel="stylesheet"
        />

        {/* 🔍 Structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="overflow-x-hidden w-full font-sans bg-base text-white">
        <AuthProvider>
          <ClientNavbarWrapper />
          {children}
          <Toaster richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
