import type { Metadata } from "next";
import DesktopSession from "@/components/desktop/DesktopSession";

export const metadata: Metadata = {
  title: "WaveOS Desktop",
  description: "The interactive WaveOS classroom desktop.",
};

export default function DesktopPage() {
  return <DesktopSession />;
}
