import { expect, test, type Page, type TestInfo } from "@playwright/test";
import { LESSON_SCENES } from "../lib/lesson-scenes";
import { sceneWords, type LessonScene, type SceneLanguage } from "../lib/lesson-scene";

const chapterFigure = (page: Page) => page.locator(".chapter-scene-3d");

async function begin(page: Page, language: SceneLanguage = "en") {
  await page.addInitScript((lang) => localStorage.setItem("opitlcal-presentation-language", lang), language);
  await page.goto("/desktop");
  await page.getByRole("button", { name: language === "en" ? "Begin the lesson" : "Хичээл эхлүүлэх", exact: true }).click();
  await page.getByRole("button", { name: language === "en" ? "Start presentation" : "Илтгэл эхлүүлэх", exact: true }).click();
  await expect(chapterFigure(page)).toHaveAttribute("data-chapter", "1");
}

async function jump(page: Page, chapter: number, language: SceneLanguage = "en") {
  await page.locator(".p-toolbar").getByRole("button", { name: language === "en" ? /^Chapters/ : /^Хэсгүүд/ }).click();
  await page.locator(".p-contents button").nth(chapter - 1).click();
  await expect(chapterFigure(page)).toHaveAttribute("data-chapter", String(chapter));
}

function pathTo(scene: LessonScene, from: string, to: string): string[] {
  const queue: { id: string; actions: string[] }[] = [{ id: from, actions: [] }];
  const visited = new Set<string>();
  while (queue.length) {
    const node = queue.shift()!;
    if (node.id === to) return node.actions;
    if (visited.has(node.id)) continue;
    visited.add(node.id);
    for (const action of scene.states.find(state => state.id === node.id)!.actions) queue.push({ id: action.to, actions: [...node.actions, action.id] });
  }
  throw new Error(`No path in chapter ${scene.chapter}: ${from} -> ${to}`);
}

async function action(page: Page, id: string) {
  await chapterFigure(page).locator(`button[data-action="${id}"]`).click();
}

async function assertLabelsFit(page: Page) {
  const failures = await page.locator(".cs3d-stage").evaluate((stage) => {
    const box = stage.getBoundingClientRect();
    const labels = [...stage.querySelectorAll<HTMLElement>(".scene3d-node-label")];
    const issues: string[] = [];
    const rects = labels.map(label => ({ label, rect: label.getBoundingClientRect() }));
    for (const { label, rect } of rects) {
      if (rect.left < box.left - 1 || rect.right > box.right + 1 || rect.top < box.top - 1 || rect.bottom > box.bottom + 1) issues.push(`clipped label: ${label.innerText}`);
      if (label.scrollWidth > label.clientWidth + 1 || label.scrollHeight > label.clientHeight + 1) issues.push(`overflow: ${label.innerText}`);
      if (parseFloat(getComputedStyle(label).fontSize) < 12) issues.push(`tiny label: ${label.innerText}`);
    }
    for (let a = 0; a < rects.length; a++) for (let b = a + 1; b < rects.length; b++) {
      const x = rects[a].rect, y = rects[b].rect;
      if (Math.min(x.right, y.right) > Math.max(x.left, y.left) + 1 && Math.min(x.bottom, y.bottom) > Math.max(x.top, y.top) + 1) issues.push(`overlap: ${rects[a].label.innerText} / ${rects[b].label.innerText}`);
    }
    return issues;
  });
  expect(failures).toEqual([]);
}

async function screenshot(page: Page, info: TestInfo, name: string) {
  await page.locator(".cs3d-stage").screenshot({ path: info.outputPath(`${name}.png`), animations: "disabled" });
}

for (const language of ["en", "mn"] as const) {
  for (const viewport of [{ name: "desktop", width: 1440, height: 900 }, { name: "mobile", width: 390, height: 844 }]) {
    test(`all 17 chapters and every teaching state: ${language} ${viewport.name}`, async ({ page }, info) => {
      test.setTimeout(480_000);
      await page.setViewportSize(viewport);
      const errors: string[] = [];
      page.on("pageerror", error => errors.push(error.message));
      page.on("console", message => { if (message.type() === "error") errors.push(message.text()); });
      page.on("response", response => { if (response.status() >= 400) errors.push(`HTTP ${response.status()}: ${response.url()}`); });
      await begin(page, language);
      await expect(page.locator(".cs3d-stage[data-ready=true] canvas")).toBeVisible();
      const firstCanvas = await page.locator(".cs3d-stage canvas").elementHandle();
      for (const scene of LESSON_SCENES) {
        if (scene.chapter > 1) await jump(page, scene.chapter, language);
        let current = scene.initial;
        for (const state of scene.states) {
          for (const step of pathTo(scene, current, state.id)) await action(page, step);
          current = state.id;
          await expect(chapterFigure(page)).toHaveAttribute("data-state", state.id);
          await expect(page.locator(".scene3d-outcome h3")).toHaveText(sceneWords(state.title, language));
          await expect(page.locator(".scene3d-outcome p")).toHaveText(sceneWords(state.description, language));
          await expect(page.locator(".cs3d-stage[data-ready=true] canvas")).toBeVisible();
          await expect(page.locator(".scene3d-node-label")).toHaveCount(state.nodes.length);
          for (const node of state.nodes) {
            const fact = page.locator(`.scene3d-fact[data-node="${node.id}"]`);
            await expect(fact).toHaveAttribute("data-content", node.content ?? "empty");
            await expect(fact).toHaveAttribute("data-kind", node.kind);
          }
          await assertLabelsFit(page);
          await expect(page.locator(".p-engine")).toHaveAttribute("lang", language);
          expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
          // Every initial view and each distinct state has a reviewable artifact.
          await screenshot(page, info, `${String(scene.chapter).padStart(2, "0")}-${state.id}`);
          if ([1, 13, 16].includes(scene.chapter) && state.id === scene.initial) await page.screenshot({ path: info.outputPath(`page-${scene.chapter}.png`) });
        }
        expect(await firstCanvas!.evaluate(canvas => canvas.isConnected)).toBe(true);
        await expect(page.locator("canvas")).toHaveCount(1);
      }
      // Finish all eight questions after exercising all diagrams.
      await page.locator(".p-next-button").click();
      for (let question = 0; question < 8; question++) {
        await page.locator(".p-quiz .p-solid-button").click();
        await expect(page.locator("#quiz-answer")).toBeVisible();
        await page.locator(".p-next-button").click();
      }
      await expect(page.locator(".p-finished")).toBeVisible();
      expect(errors).toEqual([]);
    });
  }
}

test("save and upload require actions; graphics toggling retains the result", async ({ page }) => {
  await begin(page);
  await jump(page, 14);
  await expect(chapterFigure(page)).toHaveAttribute("data-state", "local");
  await expect(page.locator('.scene3d-fact[data-kind="server"]')).toHaveAttribute("data-content", "empty");
  await action(page, "upload-copy");
  await expect(chapterFigure(page)).toHaveAttribute("data-state", "uploaded");
  await expect(page.locator('.scene3d-fact[data-content="drawing"]')).toHaveCount(2);
  await page.locator(".p-graphics-toggle").click();
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(chapterFigure(page)).toHaveAttribute("data-state", "uploaded");
  await expect(page.locator(".scene3d-facts")).toBeVisible();
  await expect(page.locator(".scene3d-facts")).not.toHaveClass(/is-sr-only/);
  expect(await page.evaluate(() => localStorage.getItem("opitlcal-presentation-3d"))).toBe("off");
  await page.locator(".p-graphics-toggle").click();
  await expect(page.locator(".cs3d-stage[data-ready=true] canvas")).toBeVisible();
  await expect(chapterFigure(page)).toHaveAttribute("data-state", "uploaded");
});

test("context loss retains the same controls and data, and retry works", async ({ page }) => {
  await begin(page);
  await expect(page.locator(".cs3d-stage[data-ready=true] canvas")).toBeVisible();
  await page.locator(".cs3d-stage canvas").evaluate(canvas => {
    const gl = (canvas as HTMLCanvasElement).getContext("webgl2");
    const loss = gl?.getExtension("WEBGL_lose_context");
    if (!loss) throw new Error("No context-loss extension for the live canvas");
    loss.loseContext();
  });
  await expect(chapterFigure(page)).toHaveAttribute("data-renderer", "text");
  await action(page, "save");
  await expect(chapterFigure(page)).toHaveAttribute("data-state", "saved");
  await page.getByRole("button", { name: "Retry 3D" }).click();
  await expect(page.locator(".cs3d-stage[data-ready=true] canvas")).toBeVisible();
  await expect(chapterFigure(page)).toHaveAttribute("data-state", "saved");
});

test("WebGL unavailable keeps save and upload actions usable", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(this: HTMLCanvasElement, type: string, ...args: unknown[]) {
      if (type === "webgl" || type === "webgl2" || type === "experimental-webgl") return null;
      return original.apply(this, [type, ...args] as Parameters<typeof original>);
    } as typeof original;
  });
  await begin(page);
  await expect(chapterFigure(page)).toHaveAttribute("data-renderer", "text");
  await action(page, "save");
  await expect(chapterFigure(page)).toHaveAttribute("data-state", "saved");
  await jump(page, 14);
  await action(page, "upload-copy");
  await expect(page.locator('.scene3d-fact[data-content="drawing"]')).toHaveCount(2);
});

test("reduced motion and keyboard activation preserve teaching meaning", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await begin(page);
  await expect(chapterFigure(page)).toHaveAttribute("data-paused", "true");
  await page.locator('button[data-action="save"]').focus();
  await page.keyboard.press("Enter");
  await expect(chapterFigure(page)).toHaveAttribute("data-state", "saved");
  await expect(page.locator(".scene3d-outcome")).toBeFocused();
  await expect(page.locator(".p-engine")).toHaveAttribute("data-chapter", "1");
});

test("3D preference survives reload and blocked storage keeps controls usable", async ({ page }) => {
  await begin(page);
  await page.locator(".p-graphics-toggle").click();
  await page.reload();
  await page.getByRole("button", { name: "Begin the lesson", exact: true }).click();
  await page.getByRole("button", { name: "Start presentation", exact: true }).click();
  await expect(chapterFigure(page)).toHaveAttribute("data-renderer", "text");
  await expect(page.locator("canvas")).toHaveCount(0);
  await page.evaluate(() => {
    Storage.prototype.setItem = () => { throw new DOMException("Blocked", "SecurityError"); };
    Storage.prototype.getItem = () => { throw new DOMException("Blocked", "SecurityError"); };
  });
  await page.locator(".p-graphics-toggle").click();
  await expect(page.locator(".cs3d-stage[data-ready=true] canvas")).toBeVisible();
  await page.locator(".p-graphics-toggle").click();
  await expect(page.locator("canvas")).toHaveCount(0);
});

test("language is only in Settings and changing language preserves the active state", async ({ page }) => {
  await begin(page);
  await action(page, "save");
  await expect(page.locator(".language-toggle")).toHaveCount(0);
  // The storage event is how another same-origin Settings session updates an open lesson.
  await page.evaluate(() => {
    localStorage.setItem("opitlcal-presentation-language", "mn");
    window.dispatchEvent(new StorageEvent("storage", { key: "opitlcal-presentation-language", newValue: "mn" }));
  });
  await expect(page.locator(".p-engine")).toHaveAttribute("lang", "mn");
  await expect(chapterFigure(page)).toHaveAttribute("data-state", "saved");
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Open Settings", exact: true }).click();
  await expect(page.getByRole("button", { name: "Монгол", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "English", exact: true }).click();
  expect(await page.evaluate(() => localStorage.getItem("opitlcal-presentation-language"))).toBe("en");
});

test("power loss and a denied request have the correct visible consequences", async ({ page }) => {
  await begin(page);
  await jump(page, 2);
  await action(page, "power-off");
  await expect(page.locator('.scene3d-fact[data-node="ram"]')).toHaveAttribute("data-content", "empty");
  await expect(page.locator('.scene3d-fact[data-node="storage"]')).toHaveAttribute("data-content", "drawing");
  await expect(page.locator('.scene3d-node-label[data-node="ram"]')).toContainText("Previous work is gone");
  await action(page, "power-on");
  await expect(page.locator('.scene3d-fact[data-node="ram"]')).toHaveAttribute("data-content", "empty");
  await action(page, "reopen-file");
  await expect(page.locator('.scene3d-fact[data-node="ram"]')).toHaveAttribute("data-content", "work");
  await jump(page, 4);
  await action(page, "save");
  await action(page, "deny-access");
  await expect(page.locator('.scene3d-fact[data-node="storage"]')).toHaveAttribute("data-content", "empty");
  await expect(page.locator('.scene3d-fact[data-node="drawing-app"]')).toHaveAttribute("data-content", "drawing");
  await jump(page, 10);
  await action(page, "deny");
  await expect(page.locator('.scene3d-fact[data-node="contacts"]')).toHaveAttribute("data-content", "contacts");
  await expect(page.locator('.scene3d-fact[data-kind="server"]')).toHaveCount(0);
});

test("Mongolian labels and controls fit a 320px phone", async ({ page }, info) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await begin(page, "mn");
  for (const chapter of [3, 5, 7, 13, 16, 17]) {
    await jump(page, chapter, "mn");
    const scene = LESSON_SCENES[chapter - 1];
    let current = scene.initial;
    for (const state of scene.states) {
      for (const step of pathTo(scene, current, state.id)) await action(page, step);
      current = state.id;
      await assertLabelsFit(page);
      await screenshot(page, info, `${chapter}-${state.id}`);
    }
  }
});

test("Files and Terminal remain usable from the rebuilt chapter", async ({ page }) => {
  await begin(page);
  await jump(page, 16);
  await page.locator(".scene3d-demo").getByRole("button", { name: "Open Terminal", exact: true }).click();
  await expect(page.locator(".p-engine")).toHaveCount(0);
  const input = page.locator("#opitlcal-terminal-input");
  await input.fill("cat /home/student/Documents/notes.txt");
  await input.press("Enter");
  await expect(page.locator(".app-terminal-entry").last()).toContainText("A note about the blue cat");
  await page.getByRole("button", { name: "Open Operating Systems", exact: true }).click();
  await page.getByRole("button", { name: "Continue reading", exact: true }).click();
  await expect(chapterFigure(page)).toHaveAttribute("data-chapter", "16");
  await page.locator(".scene3d-demo").getByRole("button", { name: "Open Files", exact: true }).click();
  await expect(page.locator(".p-engine")).toHaveCount(0);
  await expect(page.locator(".app-files")).toBeVisible();
});

test("idle scenes do not render continuously and revisiting chapters releases GPU allocations", async ({ page }) => {
  await page.addInitScript(() => {
    const buffers = new Set<WebGLBuffer>();
    const textures = new Set<WebGLTexture>();
    let draws = 0;
    const p = WebGL2RenderingContext.prototype;
    const createBuffer = p.createBuffer, deleteBuffer = p.deleteBuffer;
    const createTexture = p.createTexture, deleteTexture = p.deleteTexture;
    const drawElements = p.drawElements, drawArrays = p.drawArrays;
    p.createBuffer = function() { const value = createBuffer.call(this); if (value) buffers.add(value); return value; };
    p.deleteBuffer = function(value) { if (value) buffers.delete(value); deleteBuffer.call(this, value); };
    p.createTexture = function() { const value = createTexture.call(this); if (value) textures.add(value); return value; };
    p.deleteTexture = function(value) { if (value) textures.delete(value); deleteTexture.call(this, value); };
    p.drawElements = function(...args) { draws++; drawElements.apply(this, args); };
    p.drawArrays = function(...args) { draws++; drawArrays.apply(this, args); };
    Object.defineProperty(window, "__sceneGpuCounts", { get: () => ({ buffers: buffers.size, textures: textures.size, draws }) });
  });
  const gpu = () => page.evaluate(() => (window as unknown as { __sceneGpuCounts: { buffers: number; textures: number; draws: number } }).__sceneGpuCounts);
  await begin(page);
  await expect(page.locator(".cs3d-stage[data-ready=true] canvas")).toBeVisible();
  // Observe a quiet interval after the first render and font/layout measurement.
  await expect.poll(async () => {
    const before = await gpu();
    await page.waitForTimeout(250);
    return (await gpu()).draws === before.draws;
  }).toBe(true);
  const baseline = await gpu();
  expect(baseline.buffers).toBeGreaterThan(0);
  for (let round = 0; round < 2; round++) for (const chapter of [2, 5, 8, 13, 14, 16, 17, 1]) await jump(page, chapter);
  await expect.poll(async () => {
    const current = await gpu();
    return { buffers: current.buffers, textures: current.textures };
  }).toEqual({ buffers: baseline.buffers, textures: baseline.textures });
  const beforeIdle = await gpu();
  await page.waitForTimeout(400);
  expect((await gpu()).draws).toBe(beforeIdle.draws);
});

test("read-along resizing keeps the diagram and its state intact", async ({ page }, info) => {
  await begin(page);
  await jump(page, 13);
  await action(page, "show-windows");
  await action(page, "enable-optional");
  await page.getByRole("button", { name: "Read along", exact: true }).click();
  await expect(page.locator(".p-reading")).toBeVisible();
  await expect(chapterFigure(page)).toHaveAttribute("data-state", "windows-optional");
  await assertLabelsFit(page);
  await screenshot(page, info, "reporting-with-read-along");
  await page.getByRole("button", { name: "Slides", exact: true }).click();
  await expect(chapterFigure(page)).toHaveAttribute("data-state", "windows-optional");
  await assertLabelsFit(page);
});
