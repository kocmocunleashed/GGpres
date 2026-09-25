import type { CSSProperties } from 'react';

const particles = Array.from({ length: 34 }, (_, index) => ({
  left: `${(index * 37 + 7) % 100}%`,
  top: `${(index * 23 + 13) % 100}%`,
  animationDelay: `${-(index % 11) * 2}s`,
  animationDuration: `${18 + (index % 5) * 5}s`,
  opacity: 0.15 + (index % 4) * 0.12,
}));

export function Diamond({ className = '' }: { className?: string }) {
  return <svg className={className} viewBox="0 0 100 100" fill="none" aria-hidden="true"><path d="M50 2 98 50 50 98 2 50Z" stroke="currentColor" strokeWidth=".7" /><path d="M50 14 86 50 50 86 14 50Z" stroke="currentColor" strokeWidth=".35" /></svg>;
}

export default function LessonWorld() {
  return (
    <div className="lw-world" aria-hidden="true">
      <div className="lw-ambient" />
      <svg className="lw-grid" width="100%" height="100%"><defs><pattern id="lesson-diamonds" width="150" height="150" patternUnits="userSpaceOnUse"><path d="M75 0 150 75 75 150 0 75Z" fill="none" stroke="currentColor" strokeWidth=".45" /></pattern></defs><rect width="100%" height="100%" fill="url(#lesson-diamonds)" /></svg>
      <div className="lw-particles">{particles.map((style, i) => <i key={i} style={style as CSSProperties} />)}</div>
      <div className="lw-rail lw-rail-top"><span /><Diamond /><span /></div>
      <div className="lw-rail lw-rail-bottom"><span /><Diamond /><span /></div>
      <svg className="lw-horizon" viewBox="0 0 1440 300" preserveAspectRatio="none"><path d="M0 215H330L425 120H800L920 0H1440M0 228H338L433 133H806L926 13H1440" fill="none" stroke="currentColor" strokeWidth="1" /></svg>
      <Diamond className="lw-orbital-diamond" />
      <div className="lw-stripe-band" />
    </div>
  );
}
