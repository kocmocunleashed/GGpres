import assert from "node:assert/strict";
import { test } from "node:test";
import { createSlotState, drawSlotReels, SLOT_START_CREDITS, SLOT_SYMBOLS, SLOT_TRIPLE_RETURNS, slotReelStrip, slotReturn, slotsReducer, type SlotReels } from "./slots";

test("every displayed return agrees with all 216 possible three-reel outcomes", () => {
  let triples = 0, pairs = 0, blanks = 0, totalReturned = 0;
  for (const a of SLOT_SYMBOLS) for (const b of SLOT_SYMBOLS) for (const c of SLOT_SYMBOLS) {
    const result = [a, b, c] as const;
    const unique = new Set(result).size;
    const returned = slotReturn(result);
    if (unique === 1) { triples++; assert.equal(returned, SLOT_TRIPLE_RETURNS[a]); }
    else if (unique === 2) { pairs++; assert.equal(returned, 1); }
    else { blanks++; assert.equal(returned, 0); }
    const started = slotsReducer(createSlotState(), { type: "spin", outcome: result });
    const settled = slotsReducer(started, { type: "settle", round: started.round });
    assert.equal(settled.credits, SLOT_START_CREDITS - 1 + returned);
    assert.deepEqual(settled.reels, result);
    assert.equal(settled.pending, null);
    totalReturned += returned;
  }
  assert.deepEqual([triples, pairs, blanks], [6, 90, 120]);
  assert.equal(totalReturned, 198);
});

test("spins are charged once, cannot overlap, and settlement cannot pay twice", () => {
  const original = createSlotState();
  const spun = slotsReducer(original, { type: "spin", outcome: ["seven", "seven", "seven"] });
  assert.equal(spun.credits, original.credits - 1);
  assert.equal(spun.spins, 1);
  assert.equal(original.pending, null);
  assert.equal(slotsReducer(spun, { type: "spin", outcome: ["cherry", "plum", "star"] }), spun);
  assert.equal(slotsReducer(spun, { type: "reset" }), spun);
  assert.equal(slotsReducer(spun, { type: "settle", round: spun.round - 1 }), spun);
  const settled = slotsReducer(spun, { type: "settle", round: spun.round });
  assert.equal(settled.credits, 65);
  assert.equal(slotsReducer(settled, { type: "settle", round: spun.round }), settled);
});

test("running out cannot produce negative credits; free reset rejects stale animation callbacks", () => {
  let state = createSlotState();
  const loss: SlotReels = ["cherry", "lemon", "plum"];
  for (let index = 0; index < SLOT_START_CREDITS; index++) {
    state = slotsReducer(state, { type: "spin", outcome: loss });
    state = slotsReducer(state, { type: "settle", round: state.round });
    assert.ok(state.credits >= 0);
  }
  assert.equal(state.credits, 0);
  assert.equal(slotsReducer(state, { type: "spin", outcome: loss }), state);
  const oldRound = state.round;
  state = slotsReducer(state, { type: "reset" });
  assert.equal(state.credits, SLOT_START_CREDITS);
  assert.equal(state.spins, 0);
  state = slotsReducer(state, { type: "spin", outcome: loss });
  assert.equal(slotsReducer(state, { type: "settle", round: oldRound }), state);
});

test("independent uniform samples select the six symbols including bucket boundaries", () => {
  for (let index = 0; index < SLOT_SYMBOLS.length; index++) {
    assert.deepEqual(drawSlotReels(() => index / SLOT_SYMBOLS.length), Array(3).fill(SLOT_SYMBOLS[index]));
  }
  const samples = [0, 0.5, 0.999999];
  assert.deepEqual(drawSlotReels(() => samples.shift()!), ["cherry", "diamond", "seven"]);
  for (const sample of [-1, 1, NaN, Infinity]) assert.throws(() => drawSlotReels(() => sample), RangeError);
});

test("animation strips land on their paid outcome and stay bounded", () => {
  for (const current of SLOT_SYMBOLS) for (const outcome of SLOT_SYMBOLS) for (const reel of [0, 1, 2]) {
    const strip = slotReelStrip(current, outcome, reel);
    assert.equal(strip[0], current);
    assert.equal(strip.at(-1), outcome);
    assert.ok(strip.length >= 16 && strip.length <= 28);
    assert.ok(strip.every((symbol) => SLOT_SYMBOLS.includes(symbol)));
  }
});
