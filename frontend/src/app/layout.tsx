import { defaultMetadata } from './metadata';
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
    priceCurrency: "USD"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}