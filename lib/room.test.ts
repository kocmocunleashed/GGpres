import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { useRoomStore } from "../store/room";

const room = () => useRoomStore.getState();
const totalLiquid = () => room().fill + Object.values(room().spills).reduce((sum, amount) => sum + amount, 0);
const assertLiquidConserved = () => assert.ok(Math.abs(totalLiquid() - 1) < 1e-10, "liquid must stay in the mug or a pour target");

beforeEach(() => room().reset());

test("liquid moves only to the selected target and stops on release or a target change", () => {
  room().pickUp();
  room().aim("plant");
  room().setPouring(true);
  room().tick(0.08);
  const plantAmount = room().spills.plant;
  assert.ok(plantAmount > 0);
  assert.equal(room().spills.desk, 0);
  assert.equal(room().spills.pc, 0);
  assertLiquidConserved();

  room().setPouring(false);
  const released = room();
  room().tick(0.1);
  assert.equal(room(), released, "releasing Pour must immediately stop the flow");

  room().setPouring(true);
  room().aim("desk");
  assert.equal(room().pouring, false, "changing targets requires a fresh pour action");
  room().tick(0.1);
  assert.equal(room().spills.desk, 0);
  room().setPouring(true);
  room().tick(0.1);
  assert.ok(room().spills.desk > 0);
  assert.equal(room().spills.plant, plantAmount);
  assert.equal(room().spills.pc, 0);
  assertLiquidConserved();
});

test("invalid clock deltas do nothing and a background-tab gap cannot empty the mug", () => {
  room().pickUp();
  room().setPouring(true);
  const before = room();
  for (const seconds of [0, -0.1, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY]) {
    room().tick(seconds);
    assert.equal(room(), before);
  }
  room().tick(3600);
  assert.ok(room().fill > 0.9 && room().fill < 1, "one delayed frame should transfer only a small amount");
  assertLiquidConserved();
});

test("an empty mug stops pouring and cannot create more liquid", () => {
  room().pickUp();
  room().aim("plant");
  room().setPouring(true);
  for (let frame = 0; frame < 100; frame += 1) room().tick(0.1);
  assert.equal(room().fill, 0);
  assert.equal(room().pouring, false);
  assertLiquidConserved();

  const empty = room();
  room().setPouring(true);
  room().tick(0.1);
  assert.equal(room(), empty);
});

test("a wet computer loses power and cannot restart until cleanup", () => {
  room().togglePower();
  assert.equal(room().powerOn, false);
  room().togglePower();
  assert.equal(room().powerOn, true);

  room().pickUp();
  room().aim("pc");
  room().setPouring(true);
  room().tick(0.1);
  room().tick(0.1);
  assert.equal(room().wetPc, true);
  assert.equal(room().powerOn, false);
  assert.ok(room().spills.pc > 0);
  assertLiquidConserved();

  room().setPouring(false);
  room().togglePower();
  assert.equal(room().powerOn, false);
  assert.equal(room().wetPc, true);

  room().cleanUp();
  assert.equal(room().wetPc, false);
  assert.equal(room().powerOn, true);
  assert.equal(room().held, false);
  assert.equal(room().pouring, false);
  assert.equal(room().fill, 1);
  assert.deepEqual(room().spills, { plant: 0, pc: 0, desk: 0 });
});

test("reading the note or putting the mug down stops pouring without losing its contents", () => {
  room().setPouring(true);
  assert.equal(room().pouring, false, "the mug must be picked up first");
  room().pickUp();
  room().setPouring(true);
  room().tick(0.1);
  const remaining = room().fill;
  room().openNote();
  assert.equal(room().pouring, false);
  room().setPouring(true);
  room().tick(0.1);
  assert.equal(room().fill, remaining);
  room().closeNote();
  assert.equal(room().pouring, false, "closing the note must not resume a held action");

  room().setPouring(true);
  room().putDown();
  assert.equal(room().held, false);
  assert.equal(room().pouring, false);
  room().setPouring(true);
  room().tick(0.1);
  assert.equal(room().fill, remaining);
  assertLiquidConserved();
});

test("reset restores a fresh room after spills and object interactions", () => {
  const initial = room();
  room().pickUp();
  room().aim("pc");
  room().setPouring(true);
  room().tick(0.1);
  room().tick(0.1);
  room().swivelChair();
  room().swivelChair();
  room().openNote();
  room().setHovered("paper");
  assert.equal(room().wetPc, true);
  assert.equal(room().chairTurns, 2);
  assert.equal(room().noteOpen, true);
  room().reset();
  assert.deepEqual(room(), initial);
});
