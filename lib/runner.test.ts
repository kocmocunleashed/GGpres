import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { isRunnerFocused, isRunnerSnapshot } from "./runner";

// Upstream also contains older sprite sheets whose frame positions do not
// match this engine. Keep the files used by its pinned index.html together.
test("vendored runner uses the matching engine and 1x/2x sprite sheets", () => {
  const files = {
    "engine.js": "e7a50d337bdbe4299068de034e4564cfe5fd45ca9257ded37b6ada9330cedf0f",
    "offline-sprite-1x.png": "e306705c996676db01f4072ed3d6f33d89089a848ab0b2a0ba07a2d866ec309f",
    "offline-sprite-2x.png": "b3011fd16e43cd860b9782c4eafe77c1cc40da2e0f6e2e5ea547d98d6efac879",
  };
  for (const [file, expected] of Object.entries(files)) {
    const bytes = readFileSync(new URL(`../public/games/runner/${file}`, import.meta.url));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), expected, `${file} must match the pinned upstream engine/sprite set`);
  }
});

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
