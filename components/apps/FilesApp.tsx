"use client";

import { useState } from "react";
import { ArrowLeft, ArrowUp, ChevronRight, FileText, Folder, HardDrive, Home, Image, Download, X } from "lucide-react";
import { HOME_DIRECTORY, listDirectory, readVirtualFile, resolvePath } from "@/lib/filesystem";
import { totalMemory, useSystemStore } from "@/store/system";

const locations = [
  { path: HOME_DIRECTORY, label: "Home", icon: Home },
  { path: `${HOME_DIRECTORY}/Documents`, label: "Documents", icon: FileText },
  { path: `${HOME_DIRECTORY}/Pictures`, label: "Pictures", icon: Image },
  { path: `${HOME_DIRECTORY}/Downloads`, label: "Downloads", icon: Download },
  { path: "/", label: "Other Locations", icon: HardDrive },
];

export function FilesApp() {
  const [path, setPath] = useState(HOME_DIRECTORY);
  const [backStack, setBackStack] = useState<string[]>([]);
  const [openFile, setOpenFile] = useState<string | null>(null);
  const filesystem = useSystemStore((state) => state.filesystem);
  const processes = useSystemStore((state) => state.processes);
  const startedAt = useSystemStore((state) => state.startedAt);
  const entries = listDirectory(filesystem, path);
  const navigate = (next: string) => { if (next !== path) { setBackStack((stack) => [...stack, path]); setPath(next); } setOpenFile(null); };
  const segments = path.split("/").filter(Boolean);
  return (
    <div className="app-files">
      <nav className="app-sidebar" aria-label="File locations">
        {locations.map(({ path: location, label, icon: Icon }) => <button key={location} aria-label={label} title={label} className={path === location ? "app-sidebar-item is-active" : "app-sidebar-item"} onClick={() => navigate(location)}><Icon size={18} aria-hidden="true" /><span>{label}</span></button>)}
        <div className="app-sidebar-caption">ON THIS WORKSTATION</div>
        <div className="app-storage-info"><HardDrive size={18} aria-hidden="true" /><div>Virtual disk<small>Classroom filesystem</small></div></div>
      </nav>
      <div className="app-files-main">
        <div className="app-files-toolbar">
          <button className="app-icon-button" aria-label="Back" disabled={!backStack.length} onClick={() => { setPath(backStack.at(-1)!); setBackStack((stack) => stack.slice(0, -1)); setOpenFile(null); }}><ArrowLeft size={17} /></button>
          <button className="app-icon-button" aria-label="Parent folder" disabled={path === "/"} onClick={() => navigate(resolvePath("..", path))}><ArrowUp size={17} /></button>
          <div className="app-breadcrumbs"><button onClick={() => navigate("/")} aria-label="Filesystem root"><HardDrive size={15} /></button>{segments.map((segment, index) => <span key={index}><ChevronRight size={12} aria-hidden="true" /><button onClick={() => navigate(`/${segments.slice(0, index + 1).join("/")}`)}>{segment === "student" ? "Home" : segment}</button></span>)}</div>
        </div>
        {openFile ? <div className="app-file-preview"><div className="app-file-preview-title"><FileText size={17} /><strong>{openFile.split("/").at(-1)}</strong><button className="app-icon-button" aria-label="Close file preview" onClick={() => setOpenFile(null)}><X size={17} /></button></div><pre>{readVirtualFile(filesystem, openFile, { usedMemory: totalMemory(processes), startedAt })}</pre></div> : <div className="app-file-grid">
          {entries.map((entry) => <button className="app-file-item" key={entry.path} onClick={() => entry.type === "directory" ? navigate(entry.path) : setOpenFile(entry.path)} aria-label={`${entry.type === "directory" ? "Open folder" : "Read"} ${entry.name}`}>
            {entry.type === "directory" ? <Folder size={49} strokeWidth={1.25} className="app-folder-icon" fill="currentColor" aria-hidden="true" /> : <FileText size={43} strokeWidth={1.25} className="app-document-icon" aria-hidden="true" />}
            <span>{entry.name}</span>
          </button>)}
          {!entries.length && <div className="app-empty-state"><Folder size={44} strokeWidth={1} /><h3>This folder is empty</h3><p>A little room for possibility.</p></div>}
        </div>}
        <footer className="app-statusbar"><span>{openFile ? "Read-only document" : `${entries.length} ${entries.length === 1 ? "item" : "items"}`}</span><span>Virtual filesystem</span></footer>
      </div>
    </div>
  );
}
export default FilesApp;
