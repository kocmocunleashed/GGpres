import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { isRunnerFocused, isRunnerSnapshot } from "./runner";

describe("runner lifecycle boundary", () => {
  const runner = { appId: "runner", minimized: false, zIndex: 12 };
  const terminal = { appId: "terminal", minimized: false, zIndex: 13 };
  test("only the foreground visible runner is enabled", () => {
    assert.equal(isRunnerFocused([runner], false), true);
    assert.equal(isRunnerFocused([runner, terminal], false), false);
    assert.equal(isRunnerFocused([runner, { ...terminal, minimized: true }], false), true);
    assert.equal(isRunnerFocused([{ ...runner, minimized: true }], false), false);
  });
  test("lesson and closed game do not receive game controls", () => {
    assert.equal(isRunnerFocused([runner], true), false);
    assert.equal(isRunnerFocused([], false), false);
  });
  test("accepts finite score messages only from the game protocol", () => {
    const message = { source: "opitlcal-runner", type: "status", status: "paused", score: 12, best: 42 };
    assert.equal(isRunnerSnapshot(message), true);
    assert.equal(isRunnerSnapshot({ ...message, source: "other-frame" }), false);
    assert.equal(isRunnerSnapshot({ ...message, status: "unknown" }), false);
    assert.equal(isRunnerSnapshot({ ...message, score: Infinity }), false);
    assert.equal(isRunnerSnapshot({ ...message, best: -1 }), false);
  });
});
