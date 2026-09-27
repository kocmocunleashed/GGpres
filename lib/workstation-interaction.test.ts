import assert from "node:assert/strict";
import { test } from "node:test";
import { isWorkstationClick } from "./workstation-interaction";

test("a tap or a slightly unsteady click can activate a workstation object", () => {
  for (const delta of [0, 1, 2]) assert.equal(isWorkstationClick({ delta }), true);
});

test("releasing an orbit drag over its starting object does not activate it", () => {
  // Fiber dispatches onClick when both ends intersect the same mesh, even if
  // the pointer travelled far enough to orbit the camera in between.
  for (const delta of [3, 12, 80, 240]) assert.equal(isWorkstationClick({ delta }), false);
});

test("an invalid pointer distance cannot activate an object", () => {
  for (const delta of [-1, NaN, Infinity, -Infinity]) assert.equal(isWorkstationClick({ delta }), false);
});
