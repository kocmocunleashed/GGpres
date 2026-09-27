import assert from "node:assert/strict";
import { test } from "node:test";
import { createFilesystem, listDirectory } from "./filesystem";
import {
  sceneState,
  sceneWords,
  transitionScene,
  type LessonScene,
  type SceneState,
  type SceneWords,
} from "./lesson-scene";
import { LESSON_SCENES } from "./lesson-scenes";

function lesson(chapter: number): LessonScene {
  const value = LESSON_SCENES.find((scene) => scene.chapter === chapter);
  assert.ok(value, `Chapter ${chapter} exists`);
  return value;
}

function at(chapter: number, state: string): SceneState {
  const value = lesson(chapter).states.find((item) => item.id === state);
  assert.ok(value, `Chapter ${chapter} contains ${state}`);
  return value;
}

function node(state: SceneState, id: string) {
  const value = state.nodes.find((item) => item.id === id);
  assert.ok(value, `${state.id} contains ${id}`);
  return value;
}

function follow(
  chapter: number,
  actions: string[],
  start = lesson(chapter).initial,
): SceneState {
  const scene = lesson(chapter);
  return sceneState(
    scene,
    actions.reduce(
      (state, action) => transitionScene(scene, state, action),
      start,
    ),
  );
}

function reachable(
  scene: LessonScene,
  excludedActions: readonly string[] = [],
): Set<string> {
  const visited = new Set<string>();
  const remaining = [scene.initial];
  while (remaining.length) {
    const id = remaining.shift()!;
    if (visited.has(id)) continue;
    visited.add(id);
    for (const action of sceneState(scene, id).actions) {
      if (!excludedActions.includes(action.id))
        remaining.push(transitionScene(scene, id, action.id));
    }
  }
  return visited;
}

function bilingual(words: SceneWords) {
  assert.equal(words.length, 2);
  assert.ok(sceneWords(words, "en").trim());
  assert.ok(sceneWords(words, "mn").trim());
}

test("the lesson supplies one scene for each of the 17 manuscript chapters", () => {
  assert.deepEqual(
    LESSON_SCENES.map((scene) => scene.chapter),
    Array.from({ length: 17 }, (_, index) => index + 1),
  );
});

for (const scene of LESSON_SCENES) {
  test(`chapter ${scene.chapter}: every bilingual state is reachable through valid explicit actions`, () => {
    bilingual(scene.title);
    bilingual(scene.summary);
    const stateIds = scene.states.map((state) => state.id);
    assert.equal(
      new Set(stateIds).size,
      stateIds.length,
      "State ids are unique",
    );
    assert.ok(stateIds.includes(scene.initial));
    assert.deepEqual(
      [...reachable(scene)].sort(),
      [...stateIds].sort(),
      "No inaccessible examples",
    );
    const entityKinds = new Map<string, string>();

    for (const state of scene.states) {
      bilingual(state.title);
      bilingual(state.description);
      if (state.container) bilingual(state.container);
      assert.ok(
        state.nodes.length > 0 && state.nodes.length <= 4,
        "Small scenes remain readable on mobile",
      );
      assert.ok(
        state.actions.length > 0,
        "Every state lets the learner continue or reset",
      );
      assert.equal(
        new Set(state.nodes.map((item) => item.id)).size,
        state.nodes.length,
      );
      assert.equal(
        new Set(state.actions.map((action) => action.id)).size,
        state.actions.length,
      );
      for (const item of state.nodes) {
        bilingual(item.label);
        if (item.detail) bilingual(item.detail);
        if (item.status) bilingual(item.status);
        if (item.ink) {
          bilingual(item.ink);
          assert.ok(
            ["text", "names", "code"].includes(item.content ?? ""),
            "Literal ink belongs to visible text, names, or code content",
          );
        }
        const previousKind = entityKinds.get(item.id);
        if (previousKind)
          assert.equal(
            item.kind,
            previousKind,
            `${item.id} must not turn from software into hardware`,
          );
        entityKinds.set(item.id, item.kind);
      }
      for (const action of state.actions) {
        bilingual(action.label);
        assert.ok(
          stateIds.includes(action.to),
          `${action.id} has a real destination`,
        );
        assert.notEqual(
          action.to,
          state.id,
          "Do not offer a button that changes nothing",
        );
      }
      for (const relation of state.relations ?? []) {
        bilingual(relation.label);
        const from = node(state, relation.from);
        const to = node(state, relation.to);
        if (relation.kind === "copy") {
          assert.equal(
            from.content,
            to.content,
            "A copy preserves the kind of content",
          );
          assert.deepEqual(
            from.ink,
            to.ink,
            "A copy preserves literal text/code rather than copying its explanation",
          );
        }
        assert.notEqual(
          from.id,
          to.id,
          "A relationship needs distinct entities",
        );
        assert.ok(
          !["cpu", "cpu-core", "ram"].includes(from.kind),
          "Physical role diagrams must not invent a CPU/RAM data conveyor",
        );
      }
      assert.equal(
        transitionScene(scene, state.id, "timer-tick"),
        state.id,
        "Time does not advance a lesson",
      );
      assert.equal(
        transitionScene(scene, state.id, "unknown-action"),
        state.id,
        "Unlisted actions cannot change its meaning",
      );
    }
  });
}

test("saving in the opening adds a stored copy and reset is the only way back", () => {
  const initial = at(1, "drawing");
  assert.equal(node(initial, "drawing-app").kind, "app");
  assert.equal(node(initial, "drawing-app").content, "drawing");
  assert.equal(node(initial, "storage").content, undefined);
  const saved = follow(1, ["save"]);
  assert.equal(node(saved, "storage").content, "drawing");
  assert.equal(node(saved, "drawing-app").content, "drawing");
  assert.equal(
    follow(1, ["save", "save"]).id,
    "saved",
    "Saving again cannot silently unsave",
  );
  assert.equal(follow(1, ["save", "reset"]).id, "drawing");
});

test("power loss destroys working RAM while storage survives, including a fresh restart", () => {
  const initial = at(2, "powered");
  const off = follow(2, ["power-off"]);
  const restarted = follow(2, ["power-off", "power-on"]);
  assert.equal(node(initial, "ram").content, "work");
  assert.equal(node(off, "ram").content, undefined);
  assert.equal(node(off, "cpu").tone, "muted");
  assert.equal(
    node(restarted, "ram").content,
    undefined,
    "Power-on alone must not resurrect old app memory",
  );
  assert.deepEqual(node(off, "storage"), node(initial, "storage"));
  assert.deepEqual(node(restarted, "storage"), node(initial, "storage"));
  assert.equal(
    node(follow(2, ["power-off", "power-on", "reopen-file"]), "ram").content,
    "work",
  );
  for (const state of lesson(2).states)
    assert.equal(state.relations?.length ?? 0, 0);
});

test("each CPU turn belongs to exactly one process and advances without moving or replacing programs", () => {
  let current = lesson(3).initial;
  const before = JSON.stringify(lesson(3));
  for (let turn = 0; turn < 12; turn++) {
    const state = sceneState(lesson(3), current);
    const running = state.nodes.filter(
      (item) => item.kind === "process" && item.tone === "active",
    );
    assert.equal(running.length, 1);
    assert.equal(
      running[0].id,
      turn % 2 === 0 ? "drawing-process" : "music-process",
    );
    assert.deepEqual(
      state.nodes
        .filter((item) => item.kind === "process")
        .map((item) => item.id),
      ["drawing-process", "music-process"],
    );
    assert.equal(state.relations?.length, 1);
    assert.equal(state.relations?.[0].from, running[0].id);
    assert.equal(state.relations?.[0].to, "core");
    assert.equal(state.relations?.[0].kind, "uses");
    assert.equal(
      node(state, "core").kind,
      "cpu-core",
      "The example concerns one core, not a whole CPU package",
    );
    current = transitionScene(lesson(3), current, "next-turn");
  }
  assert.equal(
    JSON.stringify(lesson(3)),
    before,
    "Transitions must not mutate shared scene definitions",
  );
});

test("save requests cannot produce a stored file before access is checked", () => {
  assert.equal(follow(4, ["write-file"]).id, "ready");
  assert.equal(follow(4, ["save", "write-file"]).id, "requested");
  for (const actions of [
    [],
    ["save"],
    ["save", "check-access"],
    ["save", "deny-access"],
  ]) {
    const state = follow(4, actions);
    assert.equal(node(state, "storage").content, undefined);
    assert.equal(node(state, "drawing-app").content, "drawing");
  }
  const saved = follow(4, ["save", "check-access", "write-file"]);
  assert.equal(node(saved, "storage").content, "drawing");
  assert.equal(node(saved, "storage").detail?.[0], "Pictures/cat.png");
  const denied = follow(4, ["save", "deny-access", "write-file"]);
  assert.equal(denied.id, "denied");
  assert.equal(node(denied, "storage").content, undefined);
  assert.equal(node(denied, "os").tone, "blocked");
});

test("kernel and distribution are software; Fedora containment never becomes data flow", () => {
  const kernel = follow(5, ["show-kernel"]);
  assert.equal(node(kernel, "kernel").kind, "software");
  assert.deepEqual(
    kernel.nodes
      .filter((item) => item.id !== "kernel")
      .map((item) => item.kind),
    ["cpu", "ram", "storage"],
  );
  for (const state of lesson(7).states) {
    assert.match(state.container?.[0] ?? "", /Fedora Workstation/);
    assert.equal(state.relations?.length ?? 0, 0);
    assert.deepEqual(
      state.nodes.map((item) => item.id),
      ["linux", "gnome", "apps"],
    );
    assert.equal(node(state, "linux").kind, "software");
    assert.equal(node(state, "gnome").kind, "desktop");
  }
});

test("reading source, changing a program, and sharing a code copy are separate actions", () => {
  assert.equal(node(at(8, "closed"), "source").content, undefined);
  const read = follow(8, ["read-code"]);
  assert.equal(node(read, "source").content, "code");
  assert.deepEqual(node(read, "source").ink, ["draw(cat)", "draw(cat)"]);
  assert.equal(node(read, "result").content, "drawing");
  const changed = follow(8, ["read-code", "change-code"]);
  assert.equal(node(changed, "result").content, "text");
  assert.deepEqual(node(changed, "source").ink, [
    'write("cat")',
    'write("cat")',
  ]);
  assert.deepEqual(node(changed, "result").ink, ["cat", "cat"]);
  assert.equal(node(changed, "shared-source").content, undefined);
  const shared = follow(8, ["read-code", "change-code", "share-code"]);
  assert.equal(node(shared, "source").content, "code");
  assert.equal(node(shared, "shared-source").content, "code");
  assert.deepEqual(
    node(shared, "source").ink,
    node(shared, "shared-source").ink,
  );
  assert.equal(
    node(shared, "shared-source").ink?.[0].includes("license"),
    false,
    "License explanations are not source code",
  );
  assert.equal(shared.relations?.[0].kind, "copy");
  assert.deepEqual([...reachable(lesson(8), ["share-code"])].sort(), [
    "changed",
    "closed",
    "read",
  ]);
});

test("example SELinux policy and user permission grant access without inventing an upload", () => {
  const policy = follow(9, ["show-rule"]);
  assert.equal(node(policy, "other-folder").tone, "blocked");
  assert.equal(
    node(policy, "other-folder").content,
    "text",
    "Denied access does not erase a resource",
  );
  assert.deepEqual(
    policy.relations?.map((item) => [item.from, item.to, item.kind]),
    [["confined-program", "work-folder", "access"]],
  );
  const pending = at(10, "pending");
  const allowed = follow(10, ["allow"]);
  const denied = follow(10, ["deny"]);
  assert.equal(pending.relations?.length ?? 0, 0);
  assert.equal(denied.relations?.length ?? 0, 0);
  assert.deepEqual(
    allowed.relations?.map((item) => [item.from, item.to, item.kind]),
    [["drawing-app", "contacts", "access"]],
  );
  for (const state of [pending, allowed, denied]) {
    assert.equal(node(state, "contacts").content, "contacts");
    assert.equal(node(state, "drawing-app").content, "drawing");
    assert.equal(
      state.nodes.some((item) => item.kind === "server"),
      false,
    );
    assert.equal(
      state.relations?.some((item) => item.kind === "copy") ?? false,
      false,
    );
  }
});

test("network examples start idle and each selected event has only its own recipient and content", () => {
  assert.equal(at(12, "choose").relations?.length ?? 0, 0);
  assert.equal(
    at(12, "choose").nodes.some((item) => item.kind === "server"),
    false,
  );
  for (const [action, recipient, contents, relation] of [
    ["show-update", "update-server", "text", "request"],
    ["show-diagnostic", "report-service", "text", "copy"],
    ["show-upload", "website", "drawing", "copy"],
  ] as const) {
    const state = follow(12, [action]);
    assert.equal(
      state.nodes.filter((item) => item.kind === "server").length,
      1,
    );
    assert.equal(node(state, recipient).content, contents);
    assert.equal(state.relations?.length, 1);
    assert.equal(state.relations?.[0].to, recipient);
    assert.equal(state.relations?.[0].kind, relation);
    if (action !== "show-upload") {
      assert.deepEqual(
        node(state, state.relations![0].from).ink,
        node(state, recipient).ink,
        "Recipient has the same example payload as the sender",
      );
      assert.notEqual(
        node(state, recipient).ink?.[0],
        node(state, recipient).detail?.[0],
        "A recipient's purpose is not the transmitted contents",
      );
    }
    if (action !== "show-upload")
      assert.equal(
        state.nodes.some((item) => item.content === "drawing"),
        false,
      );
  }
});

test("optional-report controls do not disable required diagnostics or separate services", () => {
  const windows = follow(13, ["show-windows"]);
  const optional = follow(13, ["show-windows", "enable-optional"]);
  const off = follow(13, [
    "show-windows",
    "enable-optional",
    "disable-optional",
  ]);
  assert.equal(node(windows, "optional").content, undefined);
  assert.equal(node(optional, "optional").content, "text");
  assert.equal(node(off, "optional").content, undefined);
  assert.deepEqual(node(windows, "required"), node(optional, "required"));
  assert.deepEqual(node(windows, "required"), node(off, "required"));
  assert.equal(node(off, "required").content, "text");
  assert.deepEqual(node(windows, "services"), node(off, "services"));
  const analytics = follow(13, ["show-macos", "enable-analytics"]);
  const noAnalytics = follow(13, [
    "show-macos",
    "enable-analytics",
    "disable-analytics",
  ]);
  assert.equal(node(analytics, "analytics").content, "text");
  assert.equal(node(noAnalytics, "analytics").content, undefined);
  assert.deepEqual(node(analytics, "services"), node(noAnalytics, "services"));
  assert.equal(
    at(13, "fedora").relations?.length ?? 0,
    0,
    "countme is not a constant standalone upload",
  );
  assert.ok(
    node(at(13, "fedora"), "crash-reports"),
    "Fedora profile must not imply countme is all reporting",
  );
});

test("a website receives the picture only after an explicit upload, while the local copy remains", () => {
  for (const chapter of [14, 17]) {
    const scene = lesson(chapter);
    for (const stateId of reachable(scene, ["upload-copy"])) {
      const website = sceneState(scene, stateId).nodes.find(
        (item) => item.id === "website",
      );
      assert.equal(
        website?.content,
        undefined,
        `${chapter}/${stateId} cannot share before upload`,
      );
    }
    const uploaded = follow(
      chapter,
      chapter === 14 ? ["upload-copy"] : ["save", "upload-copy"],
    );
    assert.equal(node(uploaded, "website").content, "drawing");
    assert.equal(
      node(uploaded, chapter === 14 ? "local-picture" : "storage").content,
      "drawing",
    );
    assert.equal(
      uploaded.nodes.filter((item) => item.content === "drawing").length,
      2,
    );
    assert.deepEqual(
      uploaded.relations?.map((item) => item.kind),
      ["copy"],
    );
    assert.equal(follow(chapter, ["reset"], uploaded.id).id, scene.initial);
  }
});

test("the backup example puts a second saved copy on separate storage", () => {
  const backup = follow(15, ["show-backup"]);
  assert.equal(node(backup, "original").kind, "storage");
  assert.equal(node(backup, "backup").kind, "storage");
  assert.equal(node(backup, "original").content, "drawing");
  assert.equal(node(backup, "backup").content, "drawing");
  assert.notEqual(node(backup, "original").id, node(backup, "backup").id);
  assert.match(node(backup, "backup").label[0], /Separate/);
  assert.deepEqual(
    backup.relations?.map((item) => [item.from, item.to, item.kind]),
    [["original", "backup", "copy"]],
  );
});

test("Fedora's desktop is software while the habits chapter shows a physical computer", () => {
  for (const state of lesson(7).states)
    assert.equal(node(state, "gnome").kind, "desktop");
  for (const stateId of ["updates", "sources", "help"])
    assert.equal(node(at(15, stateId), "computer").kind, "computer");
});

test("Files, ls, and cat show the real simulated note and distinguish names from contents in both languages", () => {
  const filesystem = createFilesystem();
  const before = JSON.stringify(filesystem);
  const names = follow(16, ["list-names"]);
  const text = follow(16, ["list-names", "read-text"]);
  const expectedNames = listDirectory(filesystem, "/home/student/Documents")
    .map((entry) => entry.name)
    .sort();
  const actual = filesystem["/home/student/Documents/notes.txt"];
  assert.equal(actual.type, "file");
  if (actual.type !== "file")
    throw new Error("The teaching note must be a file");
  for (const language of ["en", "mn"] as const) {
    const list = sceneWords(node(names, "terminal").ink!, language).split("\n");
    assert.deepEqual(list.sort(), expectedNames);
    assert.equal(
      sceneWords(node(names, "terminal").label, language),
      "Terminal: ls",
    );
    assert.equal(
      sceneWords(node(text, "terminal").label, language),
      "Terminal: cat",
    );
    assert.ok(
      sceneWords(names.description, language).includes("ls /home/student/Documents"),
      "The explanation preserves the full directory-listing command",
    );
    assert.ok(
      sceneWords(text.description, language).includes("cat /home/student/Documents/notes.txt"),
      "The explanation preserves the full read-only command for this file",
    );
    assert.ok(
      actual.content.startsWith(
        sceneWords(node(text, "terminal").ink!, language),
      ),
      "The displayed excerpt comes from the saved file, not invented or translated output",
    );
  }
  assert.equal(node(names, "terminal").content, "names");
  for (const language of ["en", "mn"] as const) {
    assert.equal(
      sceneWords(node(text, "terminal").ink!, language),
      sceneWords(node(text, "note").ink!, language),
      "cat shows the text stored in the file, not its pathname",
    );
    assert.notEqual(
      sceneWords(node(text, "note").ink!, language),
      sceneWords(node(text, "note").detail!, language),
    );
    const shell = follow(5, ["type-command"]);
    const [command, ...shellNames] = sceneWords(
      node(shell, "shell").ink!,
      language,
    ).split("\n");
    assert.equal(command, "$ ls /home/student/Documents");
    assert.deepEqual(shellNames.sort(), expectedNames);
    for (const stateId of ["desktop", "terminal"]) {
      assert.deepEqual(
        sceneWords(node(at(5, stateId), "files").ink!, language)
          .split("\n")
          .sort(),
        expectedNames,
      );
    }
  }
  assert.equal(node(text, "terminal").content, "text");
  for (const state of lesson(16).states) {
    for (const language of ["en", "mn"] as const) {
      assert.deepEqual(
        sceneWords(node(state, "files").ink!, language).split("\n").sort(),
        expectedNames,
      );
    }
    assert.equal(node(state, "note").kind, "text-file");
    assert.equal(node(state, "note").content, "text");
    assert.deepEqual(
      node(state, "note"),
      node(names, "note"),
      "Reading and listing preserve the same note",
    );
    assert.equal(
      state.nodes.some((item) => item.content === "drawing"),
      false,
    );
  }
  assert.equal(JSON.stringify(filesystem), before);
});
