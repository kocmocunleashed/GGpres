import { useEffect, useState } from "react";
import { X } from "lucide-react";
import WaveMark from "@/components/visual/WaveMark";

export default function NotificationToast({ notification }: { notification: { id: number | string; title: string; message: string } }) {
  const [visible, setVisible] = useState(true);
  useEffect(() => { const timer = setTimeout(() => setVisible(false), 6500); return () => clearTimeout(timer); }, []);
  if (!visible) return null;
  return <aside className="desktop-notification" role="status"><WaveMark /><div><strong>{notification.title}</strong><p>{notification.message}</p></div><button onClick={() => setVisible(false)} aria-label="Dismiss notification"><X size={15} /></button></aside>;
}
