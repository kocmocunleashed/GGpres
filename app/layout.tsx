import type { Metadata } from "next";
import "@fontsource/ibm-plex-sans/latin-200.css";
import "@fontsource/ibm-plex-sans/latin-300.css";
import "@fontsource/ibm-plex-sans/latin-400.css";
import "@fontsource/ibm-plex-sans/latin-500.css";
import "@fontsource/ibm-plex-sans/latin-600.css";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "@fontsource/ibm-plex-mono/latin-500.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "WaveOS — Beneath the Interface",
  description: "An interactive journey through operating systems. Enter a workstation, explore a working desktop, and discover the complexity underneath.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
