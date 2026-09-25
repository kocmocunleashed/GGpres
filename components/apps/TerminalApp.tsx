"use client";

import { useEffect, useRef, useState } from "react";
import { HOME_DIRECTORY } from "@/lib/filesystem";
import { completeCommand, executeCommand } from "@/lib/terminal";

type TerminalEntry = { input: string; cwd: string; output: string };
const shortPath = (path: string) => path === HOME_DIRECTORY || path.startsWith(`${HOME_DIRECTORY}/`) ? `~${path.slice(HOME_DIRECTORY.length)}` : path;

export function TerminalApp() {
  const [cwd, setCwd] = useState(HOME_DIRECTORY);
  const [input, setInput] = useState("");
  const [entries, setEntries] = useState<TerminalEntry[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [draft, setDraft] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "instant" }); }, [entries]);

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!input.trim()) return;
    const newHistory = [...history, input].slice(-100);
    const result = executeCommand(input, { cwd, history: newHistory });
    setHistory(newHistory); setHistoryIndex(-1); setDraft("");
    if (result.clear) { setEntries([]); setShowWelcome(false); }
    else setEntries((previous) => [...previous.slice(-149), { input, cwd, output: result.output }]);
    if (result.cwd) setCwd(result.cwd);
    setInput("");
  }

  return (
    <div className="app-terminal" onClick={(event) => { if (!(event.target instanceof HTMLButtonElement) && !window.getSelection()?.toString()) inputRef.current?.focus(); }}>
      <div className="app-terminal-scroll" ref={scrollRef}>
        {showWelcome && <div className="app-terminal-welcome"><span>opitlcalOS 1.0</span><span className="app-terminal-dim"> — Classroom edition</span><p>A small window into a bigger system.</p><p className="app-terminal-dim">Type <button onClick={() => { setInput("help"); inputRef.current?.focus(); }}>help</button> to get started. This is a simulated shell.</p></div>}
        <div role="log" aria-label="Terminal output" aria-live="polite" aria-relevant="additions">
          {entries.map((entry, index) => <div className="app-terminal-entry" key={index}><div className="app-terminal-command"><span className="app-terminal-user">student@opitlcal</span><span className="app-terminal-dim">:</span><span className="app-terminal-path">{shortPath(entry.cwd)}</span><span className="app-terminal-prompt">$</span>{entry.input}</div>{entry.output && <pre>{entry.output}</pre>}</div>)}
        </div>
        <form className="app-terminal-input-row" onSubmit={submit}>
          <label htmlFor="opitlcal-terminal-input" className="app-terminal-label"><span className="app-terminal-user">student@opitlcal</span><span className="app-terminal-dim">:</span><span className="app-terminal-path">{shortPath(cwd)}</span><span className="app-terminal-prompt">$</span></label>
          <input id="opitlcal-terminal-input" ref={inputRef} aria-label="Terminal command" autoFocus autoComplete="off" autoCapitalize="none" spellCheck={false} value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => {
            event.stopPropagation();
            if (event.key === "Tab" && !event.shiftKey) { event.preventDefault(); setInput(completeCommand(input, cwd)); }
            if (event.key === "ArrowUp" && history.length) { event.preventDefault(); if (historyIndex === -1) setDraft(input); const index = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1); setHistoryIndex(index); setInput(history[index]); }
            if (event.key === "ArrowDown" && historyIndex >= 0) { event.preventDefault(); const index = historyIndex + 1; if (index >= history.length) { setHistoryIndex(-1); setInput(draft); } else { setHistoryIndex(index); setInput(history[index]); } }
            if (event.ctrlKey && event.key === "l") { event.preventDefault(); setEntries([]); setShowWelcome(false); }
            if (event.ctrlKey && event.key === "c") { event.preventDefault(); setEntries((previous) => [...previous, { input: `${input}^C`, cwd, output: "" }]); setInput(""); }
          }} />
        </form>
      </div>
      <footer className="app-statusbar"><span>opitlcal-sh</span><span>Virtual session · no host access</span></footer>
    </div>
  );
}
export default TerminalApp;
