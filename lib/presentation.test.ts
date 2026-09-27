import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { manuscript, slideCopy, type Language } from "./presentation-data";
import { HOME_DIRECTORY, readVirtualFile } from "./filesystem";
import { executeCommand } from "./terminal";
import { totalMemory, useSystemStore } from "../store/system";

const root = new URL("../", import.meta.url);
const languages: Language[] = ["en", "mn"];
const source = {
  en: readFileSync(new URL("docs/presentation-manuscript.md", root), "utf8").trim(),
  mn: readFileSync(new URL("docs/presentation-manuscript.mn.md", root), "utf8").trim(),
};

test("the generated presentation matches the current manuscripts before it ships", () => {
  const output = execFileSync("bun", ["scripts/generate-presentation.ts", "--check"], {
    cwd: fileURLToPath(root),
    encoding: "utf8",
  });
  assert.match(output, /matches both source manuscripts/);
});

for (const language of languages) {
  test(`${language}: all 17 manuscript sections reach the reader without abridgment`, () => {
    const content = manuscript[language];
    assert.equal(content.sections.length, 17);
    assert.equal(source[language].split("\n")[0], `# ${content.title}`);
    assert.ok(source[language].startsWith(`# ${content.title}\n\n${content.intro}\n\n## 1. `));

    const expectedIds = Array.from({ length: 17 }, (_, index) => index + 1);
    assert.deepEqual(content.sections.map((section) => section.id), expectedIds);
    const fullLesson = content.sections.map((section) =>
      `## ${section.id}. ${section.title}\n\n${section.markdown}`,
    ).join("\n\n");

    // A contiguous source match catches shortened explanations, dropped question/answer
    // pairs, lost source links, reordered sections, and missing demonstration steps.
    const firstSection = source[language].indexOf("\n\n## 1. ") + 2;
    const quizHeading = language === "en" ? "## Check what you learned" : "## Сурснаа шалгаарай";
    const lessonEnd = source[language].indexOf(`\n\n${quizHeading}`);
    assert.equal(fullLesson, source[language].slice(firstSection, lessonEnd));
    assert.ok(source[language].endsWith(content.notes));
    assert.match(content.notes, /^## /);
  });

  test(`${language}: the eight quiz questions keep their original answers`, () => {
    assert.equal(manuscript[language].quiz.length, 8);
    const quizHeading = language === "en" ? "## Check what you learned" : "## Сурснаа шалгаарай";
    const quizSource = source[language].slice(source[language].indexOf(quizHeading));
    const lines = quizSource.split("\n");
    for (const [index, item] of manuscript[language].quiz.entries()) {
      assert.ok(lines.includes(`${index + 1}. ${item.question}`));
      assert.ok(lines.includes(`${index + 1}. ${item.answer}`));
      assert.ok(item.question.length > 10);
      assert.ok(item.answer.length > 5);
    }
  });
}

test("switching languages retains the same sections, sources, and technical terms", () => {
  assert.deepEqual(manuscript.en.sections.map((section) => section.id), manuscript.mn.sections.map((section) => section.id));
  const urls = (text: string) => [...text.matchAll(/\]\((https?:\/\/[^)]+)\)/g)].map((match) => match[1]).sort();
  assert.deepEqual(urls(source.en), urls(source.mn));
  for (const language of languages) {
    const text = JSON.stringify(manuscript[language]);
    assert.deepEqual(urls(text), urls(source[language]), `${language}: every source link is available in the app`);
    assert.equal(slideCopy[language].length, 17);
    for (const copy of slideCopy[language]) {
      assert.ok(copy.title.trim() && copy.eyebrow.trim() && copy.summary.trim() && copy.takeaway.trim());
    }
  }
  for (const [index, terms] of [
    [1, ["RAM", "CPU", "Storage"]],
    [4, ["kernel", "Desktop", "Terminal", "Shell"]],
    [6, ["Linux", "Fedora", "GNOME", "distro"]],
    [8, ["SELinux"]],
    [12, ["countme", "IP address"]],
  ] as const) {
    for (const term of terms) assert.ok(manuscript.mn.sections[index].markdown.includes(term));
  }
});

test("both language versions teach working read-only commands for the same demo file", () => {
  const state = useSystemStore.getState();
  const before = structuredClone(state.filesystem);
  const context = { cwd: HOME_DIRECTORY, history: [] };
  const commands = ["ls /home/student/Documents", "cat /home/student/Documents/notes.txt"];
  for (const language of languages) {
    for (const command of commands) {
      assert.ok(manuscript[language].sections[15].markdown.includes(`\`${command}\``));
    }
  }
  assert.match(executeCommand(commands[0], context).output, /notes\.txt/);
  assert.equal(executeCommand(commands[1], context).output, readVirtualFile(
    state.filesystem,
    "/home/student/Documents/notes.txt",
    { usedMemory: totalMemory(state.processes), startedAt: state.startedAt },
  ));
  assert.deepEqual(useSystemStore.getState().filesystem, before);
});
