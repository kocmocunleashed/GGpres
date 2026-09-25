"use client";

import { useState } from "react";
import { Activity, Cpu, LockKeyhole, MemoryStick, X } from "lucide-react";
import { totalCpu, totalMemory, TOTAL_MEMORY_MB, useSystemStore } from "@/store/system";

export function SystemMonitorApp() {
  const processes = useSystemStore((state) => state.processes);
  const killProcess = useSystemStore((state) => state.killProcess);
  const [selected, setSelected] = useState<number | null>(null);
  const memory = totalMemory(processes);
  const cpu = totalCpu(processes);
  const displayedProcesses = [...processes].sort((a, b) => Number(Boolean(a.protected)) - Number(Boolean(b.protected)));
  const selectedProcess = processes.find((process) => process.pid === selected);
  return <div className="app-monitor">
    <div className="app-monitor-summary">
      <div className="app-monitor-stat"><div className="app-monitor-stat-label"><Cpu size={18} /><span>CPU</span></div><strong>{cpu.toFixed(1)}<span>%</span></strong><div className="app-resource-track"><span style={{ width: `${cpu}%` }} /></div><small>4 virtual cores</small></div>
      <div className="app-monitor-stat"><div className="app-monitor-stat-label"><MemoryStick size={18} /><span>Memory</span></div><strong>{(memory / 1024).toFixed(2)}<span> / 8 GiB</span></strong><div className="app-resource-track is-memory"><span style={{ width: `${memory / TOTAL_MEMORY_MB * 100}%` }} /></div><small>{memory.toLocaleString()} MiB allocated</small></div>
      <div className="app-monitor-stat app-monitor-process-count"><div className="app-monitor-stat-label"><Activity size={18} /><span>Processes</span></div><strong>{processes.length}</strong><small>{processes.filter((process) => !process.protected).length} applications running</small></div>
    </div>
    <div className="app-monitor-list-heading"><strong>Processes</strong><span>Shared with Terminal</span></div>
    <div className="app-monitor-table-wrap"><table className="app-monitor-table"><thead><tr><th>Name</th><th>PID</th><th>CPU</th><th>Memory</th><th><span className="app-sr-only">Action</span></th></tr></thead><tbody>{displayedProcesses.map((process) => <tr key={process.pid} className={selected === process.pid ? "is-selected" : ""} onClick={() => setSelected(process.pid)}><td><button className="app-process-name" aria-pressed={selected === process.pid} aria-label={`Select ${process.name} process`} onClick={(event) => { event.stopPropagation(); setSelected(selected === process.pid ? null : process.pid); }}><span className={`app-process-mark ${process.protected ? "is-system" : ""}`} aria-hidden="true">{process.protected ? <LockKeyhole size={13} /> : <Activity size={13} />}</span>{process.name}</button></td><td>{process.pid}</td><td>{process.cpu.toFixed(1)}%</td><td>{process.memory} MiB</td><td><button className="app-icon-button" aria-label={`End ${process.name} process`} title={process.protected ? "Protected system service" : `End ${process.name}`} disabled={process.protected} onClick={(event) => { event.stopPropagation(); killProcess(process.pid); }}><X size={15} /></button></td></tr>)}</tbody></table></div>
    <div className="app-monitor-footer"><p aria-live="polite">{selectedProcess?.protected ? "Core services are protected in this learning environment." : selectedProcess ? `${selectedProcess.name} · PID ${selectedProcess.pid} · ${selectedProcess.memory} MiB. Ending it closes its window.` : "Open an app. Watch a process appear. End it to release its memory."}</p><span className="app-simulation-tag">SIMULATED RESOURCES</span></div>
  </div>;
}
export default SystemMonitorApp;
