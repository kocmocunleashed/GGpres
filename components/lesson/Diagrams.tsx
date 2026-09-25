'use client';

import { useState } from 'react';
import { ArrowDown, ArrowRight, Check, Cpu, FileText, HardDrive, Keyboard, MemoryStick, MousePointer2, Play, RotateCcw, ShieldCheck } from 'lucide-react';
import type { LessonDiagram } from '@/lib/lesson-data';
import { Diamond } from './LessonWorld';

function KernelCore({ label = 'KERNEL' }: { label?: string }) {
  return <div className="ld-core"><Diamond /><span>{label}</span><i /></div>;
}

function Resources({ synthesis = false }: { synthesis?: boolean }) {
  return <div className={`ld-resources ${synthesis ? 'ld-synthesis' : ''}`}>
    <div className="ld-resource ld-resource-1"><Cpu /><span>{synthesis ? 'PROCESSES' : 'CPU TIME'}</span></div>
    <div className="ld-resource ld-resource-2"><MemoryStick /><span>MEMORY</span></div>
    <KernelCore label={synthesis ? 'OS' : 'KERNEL'} />
    <div className="ld-resource ld-resource-3"><FileText /><span>FILES</span></div>
    <div className="ld-resource ld-resource-4"><HardDrive /><span>DEVICES</span></div>
    <svg className="ld-resource-lines" viewBox="0 0 700 300" preserveAspectRatio="none" aria-hidden="true"><path d="M100 75H230L300 145M600 75H470L400 145M100 225H230L300 155M600 225H470L400 155" stroke="currentColor" fill="none" strokeWidth="1" /></svg>
    {synthesis && <div className="ld-interface-label">INTERFACES CONNECT US TO IT ALL</div>}
  </div>;
}

function Abstraction({ distro = false }: { distro?: boolean }) {
  const [selected, setSelected] = useState(0);
  const layers = distro ? [
    { title: 'GNOME', tag: 'DESKTOP ENVIRONMENT', detail: 'The visible desktop: windows, workspaces, settings, and ways to launch apps.' },
    { title: 'TOOLS + LIBRARIES', tag: 'USER SPACE', detail: 'Applications, command shells, system services, and libraries work above the kernel.' },
    { title: 'LINUX', tag: 'KERNEL', detail: 'The core that schedules work, manages memory, and communicates with hardware through drivers.' },
    { title: 'HARDWARE', tag: 'PHYSICAL MACHINE', detail: 'Processors, memory, storage, and connected devices do the physical work.' },
  ] : [
    { title: 'APPLICATION', tag: '“OPEN MY DOCUMENT”', detail: 'The app uses a library or API to request file access.' },
    { title: 'SYSTEM CALL', tag: 'A CONTROLLED REQUEST', detail: 'The request enters the kernel through a defined interface.' },
    { title: 'KERNEL', tag: 'CHECK + COORDINATE', detail: 'The kernel checks access and coordinates the filesystem and device driver.' },
    { title: 'HARDWARE', tag: 'READ THE DATA', detail: 'The storage device retrieves the data, which returns through the layers.' },
  ];
  return <div className="ld-stack-wrap"><div className="ld-stack">{layers.map((layer, index) => <button key={layer.title} className={`ld-stack-layer ${selected === index ? 'is-selected' : ''}`} onClick={() => setSelected(index)} aria-pressed={selected === index}><span>{layer.title}</span><small>{layer.tag}</small><span className="ld-layer-number">0{index + 1}</span></button>)}</div><p className="ld-stack-detail" aria-live="polite"><span>{distro ? 'SELECT A LAYER' : 'FOLLOW THE REQUEST'}</span>{layers[selected].detail}</p>{distro && <p className="ld-stack-note">A distribution brings the software layers together.</p>}</div>;
}

function Boundary() {
  const [requested, setRequested] = useState(false);
  return <div className={`ld-boundary ${requested ? 'is-requested' : ''}`}>
    <div className="ld-zone"><small>USER SPACE</small><div className="ld-application"><FileText /><span>DOCUMENT APP</span></div><code>open(&quot;notes.txt&quot;)</code></div>
    <div className="ld-boundary-line"><span /><button className="lw-action" onClick={() => setRequested(v => !v)}>{requested ? 'Reset request' : 'Make a system call'}<ArrowRight size={18} /></button><span /></div>
    <div className="ld-zone ld-zone-kernel"><small>KERNEL SPACE</small><ShieldCheck /><span aria-live="polite">{requested ? 'Permission checked. File opened.' : 'The boundary protects shared resources.'}</span></div>
  </div>;
}

const jobs = ['LESSON', 'FILES', 'TERMINAL'];
function Scheduler() {
  const [tick, setTick] = useState(0);
  const current = tick % jobs.length;
  return <div className="ld-scheduler">
    <div className="ld-scheduler-top"><div className="ld-runqueue"><small>RUNNABLE THREADS</small>{jobs.map((job, index) => <div key={job} className={`ld-job ${index === current ? 'is-running' : ''}`}><span className="ld-job-dot" /><span>{job}</span><small>{index === current ? 'RUNNING' : 'READY'}</small></div>)}</div><ArrowRight className="ld-cpu-arrow" /><div className="ld-cpu"><Cpu size={38} /><span>CPU CORE 01</span><strong aria-live="polite">{jobs[current]}</strong></div></div>
    <div className="ld-timeline" aria-label={`Time slices elapsed: ${tick + 1}`}>{Array.from({ length: 9 }, (_, index) => <div key={index} className={`ld-slice ${index <= tick % 9 ? 'is-past' : ''}`} data-job={index % 3}>{index <= tick % 9 ? jobs[index % 3].slice(0, 1) : '·'}</div>)}</div>
    <div className="ld-demo-controls"><span>Illustrative round-robin model · one thread per app</span><button className="lw-action" onClick={() => setTick(v => v + 1)}>Next time slice <Play size={16} /></button></div>
  </div>;
}

function Memory() {
  const [page, setPage] = useState(0);
  const addresses = [{ virtual: '0x1000', physical: '0xA000', frame: 3 }, { virtual: '0x2000', physical: '0x4000', frame: 1 }, { virtual: '0x3000', physical: '0xF000', frame: 5 }];
  const physicalFrames = ['0x0000', '0x4000', '0x6000', '0xA000', '0xC000', '0xF000'];
  const mapping = addresses[page];
  return <div className="ld-memory">
    <div className="ld-memory-col"><small>PROGRAM → CPU INSTRUCTION</small><h3>Virtual address</h3><div className="ld-addresses">{addresses.map((address, index) => <button key={address.virtual} className={page === index ? 'is-selected' : ''} onClick={() => setPage(index)} aria-pressed={page === index}>{address.virtual}<ArrowRight size={15} /></button>)}</div></div>
    <div className="ld-mmu"><Cpu /><strong>MMU</strong><span>Uses page tables<br />and cached translations</span><div className="ld-mapping" aria-live="polite"><code>{mapping.virtual}</code><ArrowDown size={18} /><code>{mapping.physical}</code></div></div>
    <div className="ld-memory-col"><small>PHYSICAL MEMORY</small><h3>RAM</h3><div className="ld-ram">{physicalFrames.map((address, i) => <div className={i === mapping.frame ? 'is-selected' : ''} key={address}><span>{address}</span>{i === mapping.frame && <Check size={16} />}</div>)}</div></div>
    <p className="ld-diagram-note">Illustrative 4 KiB pages; selected physical frame base addresses shown. Click an address to follow its translation.</p>
  </div>;
}

function FileFlow() {
  return <div className="ld-file-flow"><div className="ld-file-document"><FileText size={44} /><strong>notes.txt</strong><code>/home/student/Documents/</code></div><div className="ld-file-route"><div><span>01</span><strong>Filesystem</strong><small>Names, metadata, permissions</small></div><ArrowDown /><div><span>02</span><strong>Storage driver</strong><small>Device-specific requests</small></div><ArrowDown /><div><span>03</span><strong>Storage device</strong><small>Persistent data</small></div></div></div>;
}

function Devices() {
  const [sent, setSent] = useState(false);
  return <div className={`ld-devices ${sent ? 'is-sent' : ''}`}><div className="ld-device-route"><button onClick={() => setSent(v => !v)} aria-label={sent ? 'Reset keyboard interrupt demonstration' : 'Send keyboard interrupt'}><Keyboard size={40} /><span>KEYBOARD</span><small>{sent ? 'Key pressed' : 'Click to press a key'}</small></button><div className="ld-signal"><span /><small>INTERRUPT</small><ArrowRight /></div><div className="ld-driver"><Cpu size={36} /><span>CPU + KERNEL</span><small>Interrupt handler + driver</small></div><div className="ld-signal"><span /><small>INPUT EVENT</small><ArrowRight /></div><div className="ld-device-app"><MousePointer2 size={32} /><span>APPLICATION</span><kbd aria-live="polite">{sent ? 'A' : '▏'}</kbd></div></div><p className="ld-diagram-note">{sent ? 'An input event reaches the focused application. Different devices can use interrupts, polling, and DMA in different combinations.' : 'Simplified input path: a device signals an event; system software handles and routes it.'}</p></div>;
}

function KnowledgeCheck() {
  const [choice, setChoice] = useState<string | null>(null);
  const answers = ['The desktop wallpaper', 'The OS scheduler', 'The filesystem'];
  return <div className="ld-check"><div className="ld-answers">{answers.map((answer, index) => <button key={answer} className={`${choice === answer ? 'is-selected' : ''} ${choice === answer && index === 1 ? 'is-correct' : ''}`} onClick={() => setChoice(answer)} aria-pressed={choice === answer}><span>0{index + 1}</span>{answer}{choice === answer && index === 1 && <Check />}</button>)}</div><p className="ld-check-feedback" aria-live="polite">{choice === null ? 'Choose an answer.' : choice === answers[1] ? 'Exactly. The scheduler chooses the thread; the CPU executes its instructions.' : 'Think about who shares CPU time between runnable threads. Try again.'}</p></div>;
}

export function FaultDiagram() {
  const [stage, setStage] = useState(0);
  const stages = ['PAGE NOT PRESENT', 'KERNEL HANDLING', 'MAPPING UPDATED', 'PROGRAM RESUMED'];
  const messages = [
    'The thread pauses. Control passes to the kernel’s page-fault handler.',
    'For this valid, file-backed page, the kernel obtains a RAM frame and reads the needed data from storage.',
    'The kernel updates the mapping. The CPU can retry the instruction.',
    'Execution continues. An invalid access instead may cause the OS to terminate the process.',
  ];
  return <div className={`ld-fault-diagram ld-fault-stage-${stage}`}><div className="ld-fault-track">{stages.map((label, index) => <div className={index <= stage ? 'is-active' : ''} key={label}><span>{index < stage ? <Check size={16} /> : String(index + 1).padStart(2, '0')}</span><small>{label}</small></div>)}</div><p aria-live="polite">{messages[stage]}</p><button className="lw-action" onClick={() => setStage(v => (v + 1) % 4)}>{stage === 3 ? 'Replay page fault' : ['Let the kernel handle it', 'Update the mapping', 'Resume the program'][stage]}{stage === 3 ? <RotateCcw size={17} /> : <ArrowRight size={17} />}</button></div>;
}

export default function Diagrams({ diagram }: { diagram: LessonDiagram }) {
  switch (diagram) {
    case 'resources': return <Resources />;
    case 'synthesis': return <Resources synthesis />;
    case 'abstraction': return <Abstraction />;
    case 'distro': return <Abstraction distro />;
    case 'boundary': return <Boundary />;
    case 'scheduler': return <Scheduler />;
    case 'memory': return <Memory />;
    case 'files': return <FileFlow />;
    case 'devices': return <Devices />;
    case 'check': return <KnowledgeCheck />;
  }
}
