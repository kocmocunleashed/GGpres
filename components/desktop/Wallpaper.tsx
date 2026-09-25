import { useSystemStore } from "@/store/system";

export default function Wallpaper() {
  const wallpaper = useSystemStore((s) => s.wallpaper);
  return (
    <div className={`desktop-wallpaper wallpaper-${wallpaper}`} aria-hidden="true">
      <svg viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="wall-base" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#0a1430" /><stop offset=".5" stopColor="#152552" /><stop offset="1" stopColor="#3a285f" />
          </linearGradient>
          <linearGradient id="wall-ribbon" x1="0" y1="0" x2=".8" y2="1">
            <stop stopColor="#488bcc" /><stop offset=".36" stopColor="#689ce1" /><stop offset=".55" stopColor="#a0aef0" /><stop offset=".75" stopColor="#495eab" /><stop offset="1" stopColor="#242346" />
          </linearGradient>
          <linearGradient id="wall-fold" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#131b3c" /><stop offset=".46" stopColor="#223e78" /><stop offset=".7" stopColor="#335590" /><stop offset="1" stopColor="#787abb" />
          </linearGradient>
          <linearGradient id="wall-edge" x1="0" y1="0" x2="1" y2=".6">
            <stop stopColor="#afd8ff" stopOpacity=".05" /><stop offset=".5" stopColor="#adc7ff" stopOpacity=".65" /><stop offset="1" stopColor="#9ea2ff" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="wall-light"><stop stopColor="#8499e8" stopOpacity=".17" /><stop offset="1" stopColor="#8194ff" stopOpacity="0" /></radialGradient>
        </defs>
        <path fill="url(#wall-base)" d="M0 0h1920v1080H0z" />
        <ellipse fill="url(#wall-light)" cx="1100" cy="320" rx="1100" ry="740" />
        <path d="M-150 1220C220 1110 930 1065 1262 686 1502 412 1599 95 2020-134L2120 518C1708 610 1678 973 1332 1175Z" fill="url(#wall-ribbon)" />
        <path d="M-150 1220C220 1110 930 1065 1262 686 1502 412 1599 95 2020-134" fill="none" stroke="url(#wall-edge)" strokeWidth="2" />
        <path d="M-100 1320C569 918 1012 1099 1398 689 1558 519 1620 333 1772 253 1635 609 1933 826 2090 851L2130 1175Z" fill="url(#wall-fold)" />
        <path d="M-100 1320C569 918 1012 1099 1398 689 1558 519 1620 333 1772 253" fill="none" stroke="url(#wall-edge)" strokeWidth="1.5" />
      </svg>
      <div className="desktop-wallpaper-wordmark">opitlcal<span>OS</span></div>
    </div>
  );
}
