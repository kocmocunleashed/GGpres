import assert from "node:assert/strict";
import { beforeEach, test } from "node:test";
import { createFilesystem, HOME_DIRECTORY, listDirectory, resolvePath, TOTAL_MEMORY_MB } from "./filesystem";
import { completeCommand, executeCommand } from "./terminal";
import { totalMemory, useSystemStore } from "../store/system";

const run = (input: string, cwd = HOME_DIRECTORY) => executeCommand(input, { cwd, history: [] });
beforeEach(() => useSystemStore.getState().resetSession());

test("launching, inspecting, and killing an app updates every view of the system", () => {
  const before = totalMemory(useSystemStore.getState().processes);
  useSystemStore.getState().openApp("files");
  const files = useSystemStore.getState().windows[0];
  const process = useSystemStore.getState().processes.find((item) => item.pid === files.processId)!;
  const allocated = totalMemory(useSystemStore.getState().processes);
  assert.equal(allocated, before + process.memory);
  assert.match(run("ps").output, new RegExp(`${process.pid} +files`));
  assert.match(run("free").output, new RegExp(String(allocated)));
  assert.match(run("cat /proc/meminfo").output, new RegExp(String(allocated * 1024)));
  assert.match(run(`kill ${process.pid}`).output, /Released/);
  assert.equal(useSystemStore.getState().windows.length, 0);
  assert.equal(totalMemory(useSystemStore.getState().processes), before);
  assert.doesNotMatch(run("ps").output, /files/);
  assert.match(run("cat /proc/meminfo").output, new RegExp(String((TOTAL_MEMORY_MB - before) * 1024)));
});

test("focusing or restoring an existing app never duplicates its process", () => {
  useSystemStore.getState().openApp("terminal");
  const terminal = useSystemStore.getState().windows[0];
  useSystemStore.getState().minimizeWindow(terminal.id);
  assert.equal(useSystemStore.getState().windows[0].minimized, true);
  useSystemStore.getState().openApp("terminal");
  assert.equal(useSystemStore.getState().windows.length, 1);
  assert.equal(useSystemStore.getState().windows[0].minimized, false);
  assert.equal(useSystemStore.getState().windows[0].processId, terminal.processId);
  assert.equal(useSystemStore.getState().processes.filter((process) => process.name === "terminal").length, 1);
});

test("protected services and invalid kill requests leave the session intact", () => {
  const processes = useSystemStore.getState().processes;
  assert.match(run("kill 1").output, /permission denied/);
  assert.match(run("kill 9999").output, /no such process/);
  assert.match(run("kill 42garbage").output, /Usage/);
  assert.deepEqual(useSystemStore.getState().processes, processes);
});

test("closing or killing the lesson also exits presentation mode", () => {
  useSystemStore.getState().openApp("lesson");
  useSystemStore.getState().setLessonPresenting(true);
  const lesson = useSystemStore.getState().windows[0];
  run(`kill ${lesson.processId}`);
  assert.equal(useSystemStore.getState().lessonPresenting, false);
  useSystemStore.getState().openApp("lesson");
  useSystemStore.getState().setLessonPresenting(true);
  useSystemStore.getState().closeWindow("window-lesson");
  assert.equal(useSystemStore.getState().lessonPresenting, false);
});

test("virtual navigation resolves relative paths and cannot escape its root", () => {
  assert.equal(resolvePath("../../../../../../etc", HOME_DIRECTORY), "/etc");
  assert.equal(resolvePath("~/Documents/../Pictures"), `${HOME_DIRECTORY}/Pictures`);
  assert.equal(run("cd Documents").cwd, `${HOME_DIRECTORY}/Documents`);
  assert.equal(run("cd ..", "/").cwd, "/");
  assert.match(run("cd /etc/hostname").output, /not a directory/);
  assert.match(run("cat /etc/passwd").output, /no such file/);
  assert.match(run("cat Documents/notes.txt").output, /learning simulation/);
  assert.deepEqual(listDirectory(createFilesystem(), "/home").map((entry) => entry.name), ["student"]);
});

test("shell completion, safe jokes, and reset retain intentional boundaries", () => {
  assert.equal(completeCommand("neo", HOME_DIRECTORY), "neofetch ");
  assert.equal(completeCommand("cat Doc", HOME_DIRECTORY), "cat Documents/");
  const before = useSystemStore.getState().filesystem;
  assert.match(run("sudo rm -rf /").output, /school project/);
  assert.deepEqual(useSystemStore.getState().filesystem, before);
  useSystemStore.getState().openApp("files");
  useSystemStore.getState().setLessonIndex(5);
  run("reboot");
  assert.equal(useSystemStore.getState().windows.length, 0);
  assert.equal(useSystemStore.getState().lessonIndex, 0);
  assert.equal(useSystemStore.getState().processes.length, 3);
});
