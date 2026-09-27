import { expect, test, type Page, type TestInfo } from "@playwright/test";

const browserErrors = new WeakMap<Page, string[]>();
const experience = (page: Page) => page.locator("main.experience");
const desktop = (page: Page) => page.frameLocator("iframe.world-desktop-frame");
const roomControls = (page: Page) => page.getByRole("region", { name: "Explore the workstation" });

test.beforeEach(async ({ page }) => {
  const errors: string[] = [];
  browserErrors.set(page, errors);
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  page.on("response", (response) => {
    if (response.status() >= 400) errors.push(`HTTP ${response.status()}: ${response.url()}`);
  });
});

test.afterEach(async ({ page }, testInfo) => {
  const errors = browserErrors.get(page) ?? [];
  await testInfo.attach("browser-errors", { body: JSON.stringify(errors, null, 2), contentType: "application/json" });
  expect(errors, "The workstation must not produce browser or HTTP errors").toEqual([]);
});

async function capture(page: Page, testInfo: TestInfo, name: string) {
  const path = testInfo.outputPath(`${name}.png`);
  await page.screenshot({ path });
  await testInfo.attach(name, { path, contentType: "image/png" });
}

// Wait for the rendered screen's projection, not just the React view attribute.
// A navigation button updates that attribute before its camera move has ended.
async function cameraSettled(page: Page) {
  let previous = "";
  let stable = 0;
  await expect.poll(async () => {
    const bounds = await page.locator(".world-screen-object").evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return [rect.x, rect.y, rect.width, rect.height].map((value) => Math.round(value * 10)).join(",");
    });
    stable = bounds === previous ? stable + 1 : 0;
    previous = bounds;
    return stable;
  }, { intervals: [100, 100, 200], timeout: 20_000 }).toBeGreaterThanOrEqual(2);
}

async function enterDesk(page: Page, reduced = true) {
  if (reduced) await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("button", { name: "START", exact: true })).toBeEnabled({ timeout: 90_000 });
  await page.getByRole("button", { name: "START", exact: true }).click();
  await expect(experience(page)).toHaveAttribute("data-introducing", "false");
  await expect(experience(page)).toHaveAttribute("data-computer-view", "overview");
  await page.getByRole("button", { name: "Click anywhere to begin" }).click();
  await expect(experience(page)).toHaveAttribute("data-computer-view", "desk");
  await cameraSettled(page);
}

async function explore(page: Page) {
  await page.getByRole("button", { name: "Explore the desk", exact: true }).click();
  await expect(roomControls(page)).toBeVisible();
  await expect(experience(page)).toHaveAttribute("data-computer-view", "room");
  await cameraSettled(page);
}

async function resetRoomCamera(page: Page) {
  await page.getByRole("button", { name: "Back to computer", exact: true }).click();
  // Leaving Explore keeps the current orbit. A deliberate view transition
  // resets the room camera before another physical hit-test uses coordinates.
  await page.getByRole("button", { name: "Free camera", exact: true }).click();
  await expect(experience(page)).toHaveAttribute("data-computer-view", "orbit");
  await cameraSettled(page);
  await page.getByRole("navigation", { name: "Computer views" }).getByRole("button", { name: "Return to computer", exact: true }).click();
  await explore(page);
}

async function clickPhysicalScreen(page: Page) {
  await cameraSettled(page);
  const bounds = await page.locator(".world-screen-object").boundingBox();
  expect(bounds).not.toBeNull();
  // This is a real pointer click on the WebGL canvas over the CRT opening,
  // not the DOM navigation shortcut or a store mutation.
  await page.mouse.click(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2);
  await expect(experience(page)).toHaveAttribute("data-computer-view", "monitor");
  await expect(desktop(page).locator(".desktop-session")).toHaveAttribute("data-active", "true");
}

test("original loading, START, desk and computer entry preserve one desktop session", async ({ page }, testInfo) => {
  let releaseModels!: () => void;
  const heldModels = new Promise<void>((resolve) => { releaseModels = resolve; });
  await page.route("**/models/henry/*.glb", async (route) => {
    await heldModels;
    await route.continue();
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  try {
    await expect(page.getByRole("button", { name: "START", exact: true })).toBeDisabled();
    await expect(page.locator(".entry-status")).toContainText("Loading workstation");
    await expect(experience(page)).toHaveAttribute("data-computer-view", "loading");
    await capture(page, testInfo, "original-loading");
  } finally {
    releaseModels();
  }
  await expect(page.getByRole("button", { name: "START", exact: true })).toBeEnabled({ timeout: 90_000 });
  await expect(page.locator(".entry-status")).toContainText("Click start to begin");
  await capture(page, testInfo, "original-start");
  await page.getByRole("button", { name: "START", exact: true }).click();
  await expect(experience(page)).toHaveAttribute("data-computer-view", "overview");
  await expect(experience(page)).toHaveAttribute("data-introducing", "false");
  await capture(page, testInfo, "original-overview");
  await page.getByRole("button", { name: "Click anywhere to begin" }).click();
  await expect(experience(page)).toHaveAttribute("data-computer-view", "desk");
  await cameraSettled(page);
  await capture(page, testInfo, "original-desk");
  const iframe = page.locator("iframe.world-desktop-frame");
  await iframe.evaluate((element) => { element.setAttribute("data-session-probe", "same-desktop"); });
  let navigations = 0;
  page.on("framenavigated", (frame) => { if (frame.url().endsWith("/desktop")) navigations += 1; });
  await clickPhysicalScreen(page);
  await expect(desktop(page).getByRole("button", { name: "Open quick settings" })).toBeVisible();
  await page.getByRole("button", { name: "Back to desk", exact: true }).click();
  await expect(desktop(page).locator(".desktop-session")).toHaveAttribute("data-active", "false");
  await explore(page);
  await capture(page, testInfo, "full-desk-coffee-plant-computer");
  await clickPhysicalScreen(page);
  await expect(iframe).toHaveAttribute("data-session-probe", "same-desktop");
  expect(navigations, "Entering and leaving the CRT must not reload its iframe").toBe(0);
});

// These points come from the original model's world coordinates projected by
// the room camera at 1440×900. Hover assertions prove each ray hits the intended
// object before testing clicks; screenshots record the actual rendered scene.
const objects = [
  { name: "monitor", x: 658, y: 254, hint: "Computer · click to enter" },
  { name: "case", x: 673, y: 387, hint: "Computer · click to enter" },
  { name: "power button", x: 604, y: 390, hint: "Power button · click to switch off" },
  { name: "mug", x: 851, y: 358, hint: "Mug · click to pick up" },
  { name: "chair", x: 853, y: 570, hint: "Chair · click to swivel" },
] as const;

for (const object of objects) {
  test(`dragging on the ${object.name} orbits without activation; clicking still works`, async ({ page }, testInfo) => {
    await enterDesk(page);
    await explore(page);
    await page.mouse.move(object.x, object.y);
    await expect(page.locator(".room-hover-label")).toHaveText(object.hint);
    const before = await page.locator(".room-feedback").textContent();
    await page.mouse.down();
    await page.mouse.move(object.x + 10, object.y, { steps: 5 });
    await page.mouse.up();
    await expect(experience(page)).toHaveAttribute("data-computer-view", "room");
    await expect(page.getByRole("button", { name: "Pick up mug", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Power off computer", exact: true })).toBeVisible();
    await expect(page.locator(".room-feedback")).toHaveText(before!);
    await resetRoomCamera(page);
    await page.mouse.move(object.x, object.y);
    await expect(page.locator(".room-hover-label")).toHaveText(object.hint);
    await page.mouse.click(object.x, object.y);
    if (object.name === "monitor" || object.name === "case") {
      await expect(experience(page)).toHaveAttribute("data-computer-view", "monitor");
      await expect(desktop(page).locator(".desktop-session")).toHaveAttribute("data-active", "true");
    } else if (object.name === "power button") {
      await expect(page.getByRole("button", { name: "Power on computer", exact: true })).toBeEnabled();
      await expect(desktop(page).locator(".desktop-session")).toHaveAttribute("data-powered", "false");
      await expect(page.locator(".room-hover-label")).toHaveText("Power button · click to switch on");
    } else if (object.name === "mug") {
      await expect(page.getByRole("progressbar", { name: "Coffee remaining" })).toHaveAttribute("aria-valuenow", "250");
      await expect(page.getByRole("button", { name: "Put mug down", exact: true })).toBeVisible();
    } else {
      await expect(page.locator(".room-feedback")).toHaveText("One good turn.");
    }
    await capture(page, testInfo, `${object.name.replaceAll(" ", "-")}-after-click`);
  });
}

test("note, power, three coffee targets, release and cleanup work through real controls", async ({ page }, testInfo) => {
  await enterDesk(page);
  await explore(page);
  await page.getByRole("button", { name: "Read note", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "Under the desktop." })).toBeVisible();
  await expect(roomControls(page)).toHaveAttribute("inert", "");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Under the desktop." })).toBeHidden();
  await expect(page.getByRole("button", { name: "Read note", exact: true })).toBeFocused();
  await page.getByRole("button", { name: "Power off computer", exact: true }).click();
  await expect(desktop(page).locator(".desktop-session")).toHaveAttribute("data-powered", "false");
  await page.getByRole("button", { name: "Power on computer", exact: true }).click();
  await expect(desktop(page).locator(".desktop-session")).toHaveAttribute("data-powered", "true");

  for (const target of ["Plant", "Desk", "PC"]) {
    await page.getByRole("button", { name: "Pick up mug", exact: true }).click();
    const level = page.getByRole("progressbar", { name: "Coffee remaining" });
    await expect(level).toHaveAttribute("aria-valuenow", "250");
    await page.getByRole("radio", { name: target, exact: true }).check();
    await page.keyboard.down("p");
    try {
      await expect.poll(async () => Number(await level.getAttribute("aria-valuenow"))).toBeLessThan(240);
      await capture(page, testInfo, `pouring-onto-${target.toLowerCase()}`);
    } finally {
      await page.keyboard.up("p");
    }
    await expect(page.getByRole("button", { name: `Hold to pour onto ${target.toLowerCase()}`, exact: true })).toHaveText("Hold to pour");
    const remaining = await level.getAttribute("aria-valuenow");
    // Observe future animation frames to prove releasing P stopped transfer.
    await page.waitForTimeout(250);
    await expect(level).toHaveAttribute("aria-valuenow", remaining!);
    if (target === "PC") {
      await expect(page.getByRole("button", { name: "Power on computer", exact: true })).toBeDisabled();
      await expect(desktop(page).locator(".desktop-session")).toHaveAttribute("data-powered", "false");
      await expect(page.locator(".room-power-status")).toContainText("PC off after spill");
    } else {
      await expect(page.getByRole("button", { name: "Power off computer", exact: true })).toBeEnabled();
    }
    await page.getByRole("button", { name: "Clean up / refill", exact: true }).click();
    await expect(page.getByRole("button", { name: "Pick up mug", exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Power off computer", exact: true })).toBeEnabled();
  }

  await page.getByRole("button", { name: "Pick up mug", exact: true }).click();
  await page.getByRole("radio", { name: "Desk", exact: true }).check();
  const pour = page.getByRole("button", { name: "Hold to pour onto desk", exact: true });
  const bounds = await pour.boundingBox();
  expect(bounds).not.toBeNull();
  await page.mouse.move(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2);
  await page.mouse.down();
  await expect(pour).toHaveText("Pouring…");
  await page.mouse.move(20, 500);
  await page.mouse.up();
  await expect(pour).toHaveText("Hold to pour");
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Pick up mug", exact: true })).toBeVisible();
});

test("system reduced motion keeps the original entrance usable", async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(experience(page)).toHaveAttribute("data-reduced-motion", "true");
  await expect(page.getByRole("button", { name: "START", exact: true })).toBeEnabled({ timeout: 90_000 });
  await page.getByRole("button", { name: "START", exact: true }).click();
  await expect(experience(page)).toHaveAttribute("data-introducing", "false", { timeout: 2_000 });
  await expect(page.getByRole("button", { name: "Click anywhere to begin" })).toBeVisible();
  await capture(page, testInfo, "reduced-motion-opening");
});

test("loss of WebGL falls back to a usable desktop", async ({ page }, testInfo) => {
  await enterDesk(page);
  await page.locator(".world-canvas canvas").evaluate((canvas) => {
    const context = (canvas as HTMLCanvasElement).getContext("webgl2");
    if (!context) throw new Error("No live WebGL2 context to test");
    const extension = context.getExtension("WEBGL_lose_context");
    if (!extension) throw new Error("WEBGL_lose_context is unavailable");
    extension.loseContext();
  });
  await expect(page.locator(".world-screen-layer")).toHaveClass(/is-expanded/);
  await expect(desktop(page).locator(".desktop-session")).toHaveAttribute("data-active", "true");
  await expect(page.locator(".world-canvas canvas")).toHaveCount(0);
  await desktop(page).getByRole("button", { name: "Open quick settings" }).click();
  await expect(desktop(page).getByRole("dialog", { name: "Quick settings" })).toBeVisible();
  await capture(page, testInfo, "webgl-fallback-desktop");
});

test("mobile entrance and complete desk stay within the viewport", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await enterDesk(page);
  await explore(page);
  await expect(page.locator(".world-canvas canvas")).toBeVisible();
  await expect(page.getByRole("button", { name: "Pick up mug", exact: true })).toBeInViewport();
  await expect(page.getByRole("button", { name: "Read note", exact: true })).toBeInViewport();
  const overflow = await page.evaluate(() => ({
    horizontal: document.documentElement.scrollWidth > innerWidth,
    vertical: document.documentElement.scrollHeight > innerHeight,
  }));
  expect(overflow).toEqual({ horizontal: false, vertical: false });
  await capture(page, testInfo, "mobile-full-desk");
  await clickPhysicalScreen(page);
  await page.getByRole("button", { name: "Expand desktop", exact: true }).click();
  await expect(desktop(page).getByRole("button", { name: "Open quick settings" })).toBeInViewport();
  await capture(page, testInfo, "mobile-expanded-desktop");
});
