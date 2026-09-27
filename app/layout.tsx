import type { Metadata } from "next";
// These local, unicode-ranged styles include Cyrillic Extended for Монгол Ө/Ү.
import "@fontsource/ibm-plex-sans/200.css";
import "@fontsource/ibm-plex-sans/300.css";
import "@fontsource/ibm-plex-sans/400.css";
import "@fontsource/ibm-plex-sans/500.css";
import "@fontsource/ibm-plex-sans/600.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/500.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Operating systems, Linux & your privacy · opitlcalOS",
  description:
    "A beginner's guide to operating systems, Linux, Fedora, security, and data collection. Read and explore 17 chapters in English or Mongolian.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
