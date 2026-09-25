import type { Metadata } from "next";
import DesktopSession from "@/components/desktop/DesktopSession";

export const metadata: Metadata = {
  title: "opitlcalOS Desktop",
  description: "The interactive opitlcalOS classroom desktop.",
};

export default function DesktopPage() {
  return <DesktopSession />;
}
