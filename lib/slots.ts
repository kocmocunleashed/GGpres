export const SLOT_SYMBOLS = ["cherry", "lemon", "plum", "diamond", "star", "seven"] as const;
export type SlotSymbol = (typeof SLOT_SYMBOLS)[number];
export type SlotReels = readonly [SlotSymbol, SlotSymbol, SlotSymbol];
export const SLOT_START_CREDITS = 30;
export const SLOT_SPIN_COST = 1;
export const SLOT_TRIPLE_RETURNS: Record<SlotSymbol, number> = {
  cherry: 8, lemon: 10, plum: 12, diamond: 18, star: 24, seven: 36,
};

export type SlotState = {
  credits: number;
  reels: SlotReels;
  pending: SlotReels | null;
  lastReturn: number | null;
  spins: number;
  round: number;
};
export type SlotAction =
  | { type: "spin"; outcome: SlotReels }
  | { type: "settle"; round: number }
  | { type: "reset" };

export function createSlotState(): SlotState {
  return { credits: SLOT_START_CREDITS, reels: ["cherry", "lemon", "seven"], pending: null, lastReturn: null, spins: 0, round: 0 };
}

/** Each of the six symbols has the same chance on each independent reel. */
export function drawSlotReels(random = Math.random): SlotReels {
  const symbol = () => {
    const sample = random();
    if (!Number.isFinite(sample) || sample < 0 || sample >= 1) throw new RangeError("Random samples must be in [0, 1).");
    return SLOT_SYMBOLS[Math.floor(sample * SLOT_SYMBOLS.length)];
  };
  return [symbol(), symbol(), symbol()];
}

/** Returns are total credits paid after the spin cost, never stacked awards. */
export function slotReturn([a, b, c]: SlotReels): number {
  if (a === b && b === c) return SLOT_TRIPLE_RETURNS[a];
  if (a === b || b === c || a === c) return 1;
  return 0;
}

export function slotsReducer(state: SlotState, action: SlotAction): SlotState {
  switch (action.type) {
    case "spin":
      if (state.pending || state.credits < SLOT_SPIN_COST) return state;
      return { ...state, credits: state.credits - SLOT_SPIN_COST, pending: action.outcome, lastReturn: null, spins: state.spins + 1, round: state.round + 1 };
    case "settle": {
      if (!state.pending || action.round !== state.round) return state;
      const returned = slotReturn(state.pending);
      return { ...state, credits: state.credits + returned, reels: state.pending, pending: null, lastReturn: returned };
    }
    case "reset":
      if (state.pending) return state;
      return { ...createSlotState(), round: state.round + 1 };
  }
}

/**
 * Short reel-strip adaptation of johakr/html5-slot-machine's Reel.renderSymbols.
 * MIT © 2017 Johannes Kronmüller; license and pinned source: /games/slots/SOURCE.md.
 * Intermediate symbols are decorative; only the independently drawn final result pays.
 */
export function slotReelStrip(current: SlotSymbol, result: SlotSymbol, reel: number): SlotSymbol[] {
  const steps = 15 + reel * 6;
  const offset = SLOT_SYMBOLS.indexOf(current);
  return [current, ...Array.from({ length: steps - 1 }, (_, index) => SLOT_SYMBOLS[(offset + index + 1) % SLOT_SYMBOLS.length]), result];
}
