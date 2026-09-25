"use client";

import { useState } from "react";
import { ArrowUpRight, Check, Search } from "lucide-react";
import { APP_META, useSystemStore, type AppId } from "@/store/system";
import AppIcon from "@/components/desktop/AppIcon";

const collection: { id: AppId; description: string }[] = [
  { id: "lesson", description: "An interactive journey through the system beneath your desktop." },
  { id: "files", description: "Explore a small filesystem. Big ideas, neatly organized." },
  { id: "terminal", description: "A command line for the curious. Type help to begin." },
  { id: "system-monitor", description: "Meet your processes. Watch your resources. Connect the dots." },
];

export function SoftwareApp() {
  const [query, setQuery] = useState("");
  const openApp = useSystemStore((state) => state.openApp);
  const matches = collection.filter((app) => `${app.id} ${APP_META[app.id].title} ${app.description}`.toLowerCase().includes(query.trim().toLowerCase()));
  return <div className="app-software app-scroll-content"><div className="app-software-search"><Search size={18} /><input type="search" aria-label="Search software" placeholder="Find something to explore" value={query} onChange={(event) => setQuery(event.target.value)} /></div>
    {!query && <div className="app-software-feature"><span>CURATED FOR CURIOSITY</span><h2>Everything you need.<br />Already here.</h2><p>Your workstation comes ready to explore.</p></div>}
    <div className="app-software-heading"><h3>{query ? "Search results" : "Your collection"}</h3><span>{matches.length} {matches.length === 1 ? "app" : "apps"}</span></div>
    <div className="app-software-list">{matches.map(({ id, description }) => <div className="app-software-item" key={id}><AppIcon appId={id} size={46} className="app-software-icon" /><div><h4>{APP_META[id].title}</h4><p>{description}</p><span className="app-installed"><Check size={12} /> Installed</span></div><button className="app-button" aria-label={`Open ${APP_META[id].title}`} onClick={() => openApp(id)}>Open<ArrowUpRight size={14} /></button></div>)}</div>
    {!matches.length && <div className="app-empty-state"><Search size={35} /><h3>No results</h3><p>{query.toLowerCase().includes("windows") ? "Have you considered Fedora?" : "Try “Files”, “Terminal”, or “Lesson”."}</p>{query.toLowerCase().includes("windows") && <small>A little distro humor. Windows is a perfectly real operating system.</small>}</div>}
    <p className="app-software-note">A simulated software collection. No downloads or installations.</p>
  </div>;
}
export default SoftwareApp;
