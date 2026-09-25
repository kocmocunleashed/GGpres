"use client";

import { create } from "zustand";

export type PourTarget = "plant" | "pc" | "desk";
export type RoomObject = "mug" | "paper" | "plant" | "pc" | "chair" | "desk";
export type RoomState = {
  held: boolean; target: PourTarget; pouring: boolean; fill: number;
  spills: Record<PourTarget, number>; powerOn: boolean; wetPc: boolean;
  chairTurns: number; noteOpen: boolean; hovered: RoomObject | null; message: string;
  pickUp: () => void; putDown: () => void; aim: (target: PourTarget) => void;
  setPouring: (pouring: boolean) => void; tick: (seconds: number) => void;
  swivelChair: () => void; openNote: () => void; closeNote: () => void;
  togglePower: () => void; cleanUp: () => void; reset: () => void;
  setHovered: (object: RoomObject | null) => void;
};

const initialRoom = () => ({
  held: false, target: "desk" as PourTarget, pouring: false, fill: 1,
  spills: { plant: 0, pc: 0, desk: 0 }, powerOn: true, wetPc: false,
  chairTurns: 0, noteOpen: false, hovered: null, message: "Make yourself at home. The objects are yours to explore.",
});

const targetNames: Record<PourTarget, string> = { plant: "plant", pc: "computer", desk: "desk" };

export const useRoomStore = create<RoomState>((set, get) => ({
  ...initialRoom(),
  pickUp: () => set({ held: true, pouring: false, noteOpen: false, message: "Mug in hand. Choose where to pour, then hold Pour or P." }),
  putDown: () => set({ held: false, pouring: false, message: "Mug returned to its place." }),
  aim: (target) => {
    if (!get().held || get().target === target) return;
    set({ target, pouring: false, message: `Mug aimed at the ${targetNames[target]}. Hold Pour or P.` });
  },
  setPouring: (pouring) => {
    const state = get();
    if (pouring && (!state.held || state.fill <= 0 || state.noteOpen)) return;
    if (state.pouring === pouring) return;
    set({ pouring, message: pouring ? `Pouring onto the ${targetNames[state.target]}…` : state.wetPc ? "The computer is wet and its power is off. Clean up to restore the session." : state.target === "plant" && state.spills.plant > 0 ? "The plant has had its coffee for the day." : "A little spill. Clean up whenever you like." });
  },
  tick: (seconds) => {
    const state = get();
    if (!state.held || !state.pouring || state.fill <= 0 || !Number.isFinite(seconds) || seconds <= 0) return;
    // Bound background-tab gaps so the whole mug cannot disappear between frames.
    const amount = Math.min(state.fill, Math.min(seconds, 0.1) * 0.18);
    const fill = Math.max(0, state.fill - amount);
    const spills = { ...state.spills, [state.target]: state.spills[state.target] + amount };
    const wetPc = state.wetPc || spills.pc >= 0.02;
    set({ fill, spills, wetPc, powerOn: wetPc ? false : state.powerOn, pouring: fill > 0,
      ...(fill <= 0 ? { message: "The mug is empty. Clean up & refill for another round." } : wetPc && !state.wetPc ? { message: "Coffee reached the computer. Simulated power cut — your apps are preserved." } : {}),
    });
  },
  swivelChair: () => set((state) => ({ chairTurns: state.chairTurns + 1, message: "One good turn." })),
  openNote: () => set({ noteOpen: true, pouring: false, message: "A note left on the desk." }),
  closeNote: () => set({ noteOpen: false }),
  togglePower: () => {
    const state = get();
    if (state.wetPc) { set({ message: "The computer is still wet. Clean up before switching it on." }); return; }
    set({ powerOn: !state.powerOn, message: state.powerOn ? "Computer switched off. Your simulated session is kept in memory." : "Computer switched on. Welcome back." });
  },
  cleanUp: () => set({ held: false, pouring: false, fill: 1, spills: { plant: 0, pc: 0, desk: 0 }, wetPc: false, powerOn: true, message: "All clean. Fresh coffee, same desktop session." }),
  reset: () => set(initialRoom()),
  setHovered: (hovered) => { if (get().hovered !== hovered) set({ hovered }); },
}));
