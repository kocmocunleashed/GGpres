"use client";

import { useEffect, useReducer, useRef, useSyncExternalStore } from "react";
import { ArrowRight, ExternalLink, RotateCcw } from "lucide-react";
import { usePresentationLanguage } from "@/lib/presentation-language";
import { useSystemStore } from "@/store/system";
import { createSlotState, drawSlotReels, SLOT_START_CREDITS, SLOT_SYMBOLS, SLOT_TRIPLE_RETURNS, slotReelStrip, slotsReducer, type SlotSymbol } from "@/lib/slots";
import "./slots.css";

const copy = {
  en: {
    arcade: "A LITTLE ARCADE BREAK", title: "Pocket Slots", subtitle: "Demo credits. No real money.",
    credits: "Credits", spins: "Spins", spin: "Spin the reels", spinning: "Spinning…", cost: "1 credit per spin",
    ready: "Three reels. One line. Give it a spin.", win: "credits returned", pair: "A matching pair", triple: "Three of a kind",
    miss: "No match this time.", empty: "Out of demo credits. Start a fresh game.", reset: "New game", refill: "Start with 30 credits",
    returns: "Three matching symbols return", pairReturn: "Any pair returns 1. No match returns 0.",
    rules: "Each symbol has the same chance. Only one return is paid per spin.",
    source: "Source & license", line: "ONE LINE · THREE REELS", result: "Reel result", inactive: "Select this window to spin.",
    names: { cherry: "Cherry", lemon: "Lemon", plum: "Plum", diamond: "Diamond", star: "Star", seven: "Seven" },
  },
  mn: {
    arcade: "ЖААХАН ТОГЛООД АМАРЪЯ", title: "Pocket Slots", subtitle: "Тоглоомын оноо. Жинхэнэ мөнгө биш.",
    credits: "Оноо", spins: "Эргэлт", spin: "Эргүүлэх", spinning: "Эргэж байна…", cost: "Нэг эргэлтэд 1 оноо",
    ready: "Гурван хүрд. Нэг мөр. Эргүүлээд үзээрэй.", win: "оноо буцаж орлоо", pair: "Хоёр ижил тэмдэг", triple: "Гурван ижил тэмдэг",
    miss: "Энэ удаа таарсангүй.", empty: "Тоглоомын оноо дууслаа. Шинээр эхэлж болно.", reset: "Шинэ тоглоом", refill: "30 оноотой эхлэх",
    returns: "Гурван ижил тэмдэг таарвал", pairReturn: "Хоёр ижил бол 1 оноо. Таарахгүй бол 0.",
    rules: "Тэмдэг бүр ижил магадлалтай. Нэг эргэлтэд нэг л үр дүнгийн оноо олгоно.",
    source: "Эх код ба license", line: "НЭГ МӨР · ГУРВАН ХҮРД", result: "Хүрдний үр дүн", inactive: "Эргүүлэхийн тулд энэ цонхыг сонгоорой.",
    names: { cherry: "Интоор", lemon: "Нимбэг", plum: "Чавга", diamond: "Алмаз", star: "Од", seven: "Долоо" },
  },
};

function subscribeReducedMotion(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
const getReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const serverReducedMotion = () => false;

function SymbolArt({ symbol }: { symbol: SlotSymbol }) {
  return <svg className={`slots-symbol-art slots-symbol-${symbol}`} viewBox="0 0 80 80" aria-hidden="true">
    {symbol === "cherry" && <><path d="M29 49c4-18 21-20 18-37M47 12c15 2 22 9 22 16-12 1-19-5-22-16M47 12c8 11 10 24 8 38" fill="none" stroke="#3c6842" strokeWidth="4" strokeLinecap="round" /><circle cx="26" cy="53" r="15" fill="#d23d46" /><circle cx="55" cy="54" r="15" fill="#b8283b" /><path d="M18 48c1-3 3-5 6-5M47 49c1-3 3-5 6-5" fill="none" stroke="#ffc7b9" strokeWidth="4" strokeLinecap="round" /></>}
    {symbol === "lemon" && <><path d="M15 51C7 38 24 17 44 19l11-4 2 11c15 14-2 40-23 37l-12 3z" fill="#f4cd3c" stroke="#b9981c" strokeWidth="2" /><path d="M26 35c5-7 10-10 18-10" fill="none" stroke="#fff5b9" strokeWidth="5" strokeLinecap="round" /><path d="M55 17c4-9 12-10 18-8-2 9-9 14-18 8" fill="#4f7948" /></>}
    {symbol === "plum" && <><path d="M40 26c-21-14-41 28-17 41 8 4 12 0 17 0s9 4 17 0c24-13 4-55-17-41" fill="#735092" /><path d="M40 28c-5 14-6 26-2 39" fill="none" stroke="#57386d" strokeWidth="3" /><path d="M40 27c0-11 6-16 11-18" fill="none" stroke="#5b5732" strokeWidth="4" strokeLinecap="round" /><path d="M42 21c9-10 22-8 25 0-9 6-16 5-25 0" fill="#527c48" /><path d="M25 34c-4 3-6 8-6 13" fill="none" stroke="#c5a6da" strokeWidth="4" strokeLinecap="round" /></>}
    {symbol === "diamond" && <><path d="M23 16h34l15 20-32 36L8 36z" fill="#3573c7" /><path d="m23 16 17 56 17-56M8 36h64L40 16z" fill="none" stroke="#97cdf9" strokeWidth="2.5" strokeLinejoin="round" /><path d="m23 16 17 20 17-20" fill="#c2e5ff" opacity=".7" /></>}
    {symbol === "star" && <><path d="m40 7 10 22 24 3-18 17 5 25-21-12-21 12 5-25L6 32l24-3z" fill="#e7ad37" stroke="#b37c1d" strokeWidth="2" strokeLinejoin="round" /><path d="m40 15 7 17-7 22-16 10 5-18-16-12 20-2z" fill="#ffe49a" /></>}
    {symbol === "seven" && <><path d="M16 13h48v13L41 70H24l25-43H16z" fill="#c14435" /><path d="M22 20h34" stroke="#ffbdaa" strokeWidth="4" strokeLinecap="round" /><path d="M29 45h26" stroke="#8f2c2a" strokeWidth="4" /></>}
  </svg>;
}

export default function SlotsApp({ active = true }: { active?: boolean }) {
  const [language] = usePresentationLanguage();
  const text = copy[language];
  const [game, dispatch] = useReducer(slotsReducer, undefined, createSlotState);
  const root = useRef<HTMLDivElement>(null);
  const reels = useRef<Array<HTMLDivElement | null>>([]);
  const systemReduced = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, serverReducedMotion);
  const manualReduced = useSystemStore(state => state.reducedMotion);
  const motionPaused = useSystemStore(state => state.motionPaused);
  const reduced = systemReduced || manualReduced || motionPaused;
  const spinning = game.pending !== null;

  useEffect(() => {
    if (!game.pending) return;
    const round = game.round;
    let stopped = false;
    const animations: Animation[] = [];
    let fallback = 0;
    function settle() {
      if (stopped) return;
      stopped = true;
      window.clearTimeout(fallback);
      animations.forEach(animation => animation.cancel());
      dispatch({ type: "settle", round });
    }
    const unavailable = () => !active || document.hidden || !!root.current?.closest("[inert]");
    if (reduced || unavailable()) {
      fallback = window.setTimeout(settle, reduced && !unavailable() ? 80 : 0);
      return () => { stopped = true; window.clearTimeout(fallback); };
    }

    // The upstream reel-strip idea is kept; only transform moves, with no JS frame loop.
    // Percentages make the final position independent of the app window's size.
    for (const [index, strip] of reels.current.entries()) {
      if (!strip?.animate) continue;
      const distance = 100 * (strip.children.length - 1) / strip.children.length;
      animations.push(strip.animate([
        { transform: "translateY(0)" },
        { transform: `translateY(-${distance}%)` },
      ], { duration: 950 + index * 260, easing: "cubic-bezier(.18,.65,.22,1)", fill: "forwards" }));
    }
    fallback = window.setTimeout(settle, animations.length ? 1650 : 0);
    if (animations.length) void Promise.all(animations.map(animation => animation.finished)).then(settle, () => {});
    const checkAvailability = () => { if (unavailable()) settle(); };
    document.addEventListener("visibilitychange", checkAvailability);
    const observer = new MutationObserver(checkAvailability);
    for (let ancestor = root.current?.parentElement; ancestor; ancestor = ancestor.parentElement) {
      observer.observe(ancestor, { attributes: true, attributeFilter: ["inert"] });
    }
    return () => {
      stopped = true;
      window.clearTimeout(fallback);
      animations.forEach(animation => animation.cancel());
      observer.disconnect();
      document.removeEventListener("visibilitychange", checkAvailability);
    };
  }, [game.pending, game.round, active, reduced]);

  function spin() {
    if (!active || spinning || document.hidden || root.current?.closest("[inert]")) return;
    dispatch({ type: "spin", outcome: drawSlotReels() });
  }
  const allEqual = game.reels.every(symbol => symbol === game.reels[0]);
  const result = spinning ? text.spinning : game.lastReturn === null ? text.ready : game.lastReturn > 0
    ? `${allEqual ? text.triple : text.pair} · ${game.lastReturn} ${text.win}`
    : game.credits === 0 ? text.empty : text.miss;

  return <div ref={root} className="app-slots" lang={language} data-spinning={spinning} data-win={!spinning && (game.lastReturn ?? 0) > 1}>
    <header className="slots-heading"><div><span className="slots-eyebrow">{text.arcade}</span><h2>{text.title}<span aria-hidden="true">✳</span></h2><p>{text.subtitle}</p></div><div className="slots-balance"><span>{text.credits}</span><strong>{game.credits}</strong><small>{text.spins} / {String(game.spins).padStart(2, "0")}</small></div></header>
    <div className="slots-machine">
      <div className="slots-machine-label"><span aria-hidden="true">● ● ●</span>{text.line}<span aria-hidden="true">№ 02</span></div>
      <div className="slots-reels" role="img" aria-label={`${text.result}: ${spinning ? text.spinning : game.reels.map(symbol => text.names[symbol]).join(", ")}`}>
        {game.reels.map((symbol, index) => {
          const strip = game.pending && !reduced ? slotReelStrip(symbol, game.pending[index], index) : [game.pending?.[index] ?? symbol];
          return <div className="slots-reel" key={index}><div className="slots-strip" ref={node => { reels.current[index] = node; }} aria-hidden="true">{strip.map((item, row) => <div className="slots-symbol-cell" key={row}><SymbolArt symbol={item} /></div>)}</div></div>;
        })}
      </div>
      <div className="slots-machine-bottom"><span aria-hidden="true">←</span><span>{text.cost}</span><span aria-hidden="true">→</span></div>
    </div>
    <div className="slots-result" role="status" aria-live="polite" aria-atomic="true"><span className="slots-result-light" aria-hidden="true" /><p>{!active && !spinning ? text.inactive : result}</p></div>
    <div className="slots-controls"><button className="slots-spin" data-initial-focus disabled={!active || spinning || game.credits < 1} onClick={spin}><span>{spinning ? text.spinning : text.spin}</span><ArrowRight size={20} /></button><button className="slots-reset" disabled={spinning || !active} onClick={() => dispatch({ type: "reset" })} aria-label={game.credits === 0 ? text.refill : `${text.reset} · ${SLOT_START_CREDITS}`}><RotateCcw size={17} /><span>{game.credits === 0 ? text.refill : text.reset}</span></button></div>
    <section className="slots-payouts" aria-label={text.returns}><h3>{text.returns}</h3><dl>{SLOT_SYMBOLS.map(symbol => <div key={symbol}><dt><SymbolArt symbol={symbol} /><span className="sr-only">{text.names[symbol]} × 3</span></dt><dd>{SLOT_TRIPLE_RETURNS[symbol]}<span>{text.credits.toLowerCase()}</span></dd></div>)}</dl><p>{text.pairReturn}</p></section>
    <footer className="slots-footer"><span>{text.rules}</span><a href="/games/slots/SOURCE.md" target="_blank" rel="noreferrer">{text.source}<ExternalLink size={11} /></a></footer>
  </div>;
}
