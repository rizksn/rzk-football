import { defaultMetadata } from './metadata';
import "./globals.css";

export const metadata = defaultMetadata;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}