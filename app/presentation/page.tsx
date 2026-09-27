import type { Metadata } from 'next';
import DesktopSession from '@/components/desktop/DesktopSession';

export const metadata: Metadata = {
  title: 'Your computer, your choices — opitlcalOS',
  description: 'An English and Mongolian presentation about operating systems, Linux, Fedora, security, and privacy. Read along and try the interactive lessons.',
};

export default function PresentationPage() {
  return <DesktopSession startLesson />;
}
