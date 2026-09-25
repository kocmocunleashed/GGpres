"use client";

import { useEffect, useRef, type KeyboardEvent, type PointerEvent } from "react";
import { ArrowLeft, X } from "lucide-react";
import { useDialogFocus } from "@/lib/use-dialog-focus";
import { useRoomStore } from "@/store/room";
import "./room-controls.css";

const targetLabels = { plant: "Plant", pc: "PC", desk: "Desk" } as const;
const objectLabels = {
  mug: "Mug · click to pick up",
  paper: "Note · click to read",
  plant: "Plant · aim the mug here",
  pc: "Computer · power button",
  chair: "Chair · click to swivel",
  desk: "Desk · aim the mug here",
} as const;

function DeskNote() {
  const ref = useRef<HTMLDivElement>(null);
  const closeNote = useRoomStore((state) => state.closeNote);
  useDialogFocus(ref, closeNote);

  return <div className="room-note-backdrop" onClick={closeNote}>
    <div className="room-note" role="dialog" aria-modal="true" aria-labelledby="room-note-title" ref={ref} onClick={(event) => event.stopPropagation()}>
      <button className="room-note-close" aria-label="Put the note down" onClick={closeNote} data-initial-focus><X size={20} /></button>
      <span className="room-note-index">DESK NOTE / 01</span>
      <h2 id="room-note-title">Under the desktop.</h2>
      <p>You can touch the hardware. You interact with the desktop. The operating system connects the two.</p>
      <p>Hardware executes instructions. The OS coordinates CPU time, memory, files, and devices so applications can work together.</p>
      <p>Inside WaveOS, open a few apps. Then run <code>ps</code> in Terminal to see their processes.</p>
      <p className="room-note-postscript">P.S. Coffee belongs in the mug.<br />The computer has enough processes already.</p>
      <button className="room-note-done" onClick={closeNote}>Put note down <span aria-hidden="true">↙</span></button>
    </div>
  </div>;
}

export default function RoomControls({ onExit }: { onExit: () => void; muted?: boolean }) {
  const room = useRoomStore();
  const heldInputs = useRef(new Set<string>());
  const exitRef = useRef(onExit);
  const noteTrigger = useRef<HTMLButtonElement>(null);
  const noteWasOpen = useRef(false);

  useEffect(() => { exitRef.current = onExit; }, [onExit]);
  useEffect(() => {
    // The inert controls lose focus before the dialog mounts. Restore its
    // explicit trigger after React has removed inert on close.
    if (noteWasOpen.current && !room.noteOpen) noteTrigger.current?.focus();
    noteWasOpen.current = room.noteOpen;
  }, [room.noteOpen]);

  function beginPour(input: string) {
    const state = useRoomStore.getState();
    if (!state.held || state.fill <= 0 || state.noteOpen) return;
    heldInputs.current.add(input);
    state.setPouring(true);
  }

  function endPour(input: string) {
    heldInputs.current.delete(input);
    if (heldInputs.current.size === 0) useRoomStore.getState().setPouring(false);
  }

  useEffect(() => {
    const inputs = heldInputs.current;
    const stop = () => { inputs.clear(); useRoomStore.getState().setPouring(false); };
    const keydown = (event: globalThis.KeyboardEvent) => {
      if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
      if ((event.target as HTMLElement | null)?.closest('input:not([type="radio"]):not([type="checkbox"]), textarea, select, [contenteditable=true]')) return;
      const state = useRoomStore.getState();
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        stop();
        if (state.noteOpen) state.closeNote();
        else if (state.held) state.putDown();
        else exitRef.current();
      } else if (event.key.toLowerCase() === "p" && state.held && !state.noteOpen) {
        event.preventDefault();
        if (!event.repeat && state.fill > 0) { inputs.add("p"); state.setPouring(true); }
      }
    };
    const keyup = (event: globalThis.KeyboardEvent) => {
      if (event.key.toLowerCase() !== "p") return;
      inputs.delete("p");
      if (inputs.size === 0) useRoomStore.getState().setPouring(false);
    };
    const visibility = () => { if (document.hidden) stop(); };
    window.addEventListener("keydown", keydown);
    window.addEventListener("keyup", keyup);
    window.addEventListener("blur", stop);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      window.removeEventListener("keydown", keydown);
      window.removeEventListener("keyup", keyup);
      window.removeEventListener("blur", stop);
      document.removeEventListener("visibilitychange", visibility);
      stop();
    };
  }, []);

  function exit() {
    heldInputs.current.clear();
    room.setPouring(false);
    room.putDown();
    onExit();
  }

  function releasePointer(event: PointerEvent<HTMLButtonElement>) {
    endPour("pointer");
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function pourKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key !== " " && event.key !== "Enter") return;
    event.preventDefault();
    if (!event.repeat) beginPour("button");
  }

  const amount = Math.round(room.fill * 250);
  const hasSpill = room.spills.plant > 0 || room.spills.pc > 0 || room.spills.desk > 0;

  return <>
    <section className="room-controls" aria-label="Explore the workstation" inert={room.noteOpen}>
      <div className="room-status-line">
        <p className="room-feedback" role="status" aria-live="polite">{room.message || "Click an object to explore."}</p>
        {room.hovered && <span className="room-hover-label" aria-hidden="true">{objectLabels[room.hovered]}</span>}
      </div>
      {room.held && <div className="room-mug-controls">
        <div className="room-mug-level" role="progressbar" aria-label="Coffee remaining" aria-valuemin={0} aria-valuemax={250} aria-valuenow={amount} aria-valuetext={amount ? `${amount} millilitres` : "Mug empty"}>
          <span>{amount ? `${amount} ml` : "Empty mug"}</span>
          <span className="room-mug-meter" aria-hidden="true"><span style={{ width: `${room.fill * 100}%` }} /></span>
        </div>
        <fieldset className="room-targets">
          <legend>Pour onto</legend>
          {Object.entries(targetLabels).map(([target, label]) => <label key={target}>
            <input type="radio" name="pour-target" value={target} checked={room.target === target} onChange={() => room.aim(target as keyof typeof targetLabels)} />
            <span>{label}</span>
          </label>)}
        </fieldset>
        <button
          className={`room-pour-button${room.pouring ? " is-pouring" : ""}`}
          disabled={room.fill <= 0}
          aria-label={`Hold to pour onto ${targetLabels[room.target].toLowerCase()}`}
          aria-describedby="room-pour-help"
          onPointerDown={(event) => {
            if (event.button !== 0) return;
            event.preventDefault();
            event.currentTarget.focus();
            event.currentTarget.setPointerCapture(event.pointerId);
            beginPour("pointer");
          }}
          onPointerUp={releasePointer}
          onPointerCancel={releasePointer}
          onLostPointerCapture={() => endPour("pointer")}
          onKeyDown={pourKeyDown}
          onKeyUp={(event) => { if (event.key === " " || event.key === "Enter") { event.preventDefault(); endPour("button"); } }}
          onBlur={() => { endPour("button"); endPour("pointer"); }}
          onContextMenu={(event) => event.preventDefault()}
        >{room.pouring ? "Pouring…" : room.fill <= 0 ? "Mug empty" : "Hold to pour"}</button>
        <button onClick={() => { heldInputs.current.clear(); room.putDown(); }}>Put mug down</button>
        <span id="room-pour-help" className="room-pour-help">Hold P or hold Pour · Release to stop</span>
      </div>}
      <nav className="room-actions" aria-label="Room actions">
        {!room.held && <button onClick={room.pickUp}>Pick up mug</button>}
        <button ref={noteTrigger} onClick={room.openNote}>Read note</button>
        <button onClick={room.swivelChair}>Swivel chair</button>
        <button onClick={room.togglePower} aria-label={room.powerOn ? "Power off computer" : "Power on computer"} aria-describedby={room.wetPc ? "room-pc-status" : undefined} disabled={room.wetPc}>{room.powerOn ? "Power off" : "Power on"}</button>
        <button onClick={() => { heldInputs.current.clear(); room.cleanUp(); }} disabled={!hasSpill && room.fill >= 1}>Clean up / refill</button>
        <button className="room-exit" onClick={exit}><ArrowLeft size={14} aria-hidden="true" />Back to computer</button>
      </nav>
      {room.wetPc && <p className="room-power-status" id="room-pc-status">PC off after spill · Clean up before switching it on.</p>}
      {!room.wetPc && !room.powerOn && <p className="room-power-status">PC powered off · Your simulated desktop is paused.</p>}
    </section>
    {room.noteOpen && <DeskNote />}
  </>;
}
