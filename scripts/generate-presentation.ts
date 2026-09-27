import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const destination = new URL("lib/presentation-manuscript.generated.json", root);
const sourceFiles = {
  en: "docs/presentation-manuscript.md",
  mn: "docs/presentation-manuscript.mn.md",
} as const;

function numberedItems(markdown: string, source: string) {
  const items = [...markdown.matchAll(/^(\d+)\. (.+)$/gm)];
  if (items.length !== 8 || items.some((item, index) => Number(item[1]) !== index + 1)) {
    throw new Error(`${source}: the self-study quiz must have eight ordered items.`);
  }
  return items.map((item) => item[2]);
}

function readManuscript(source: string) {
  const markdown = readFileSync(new URL(source, root), "utf8").replaceAll("\r\n", "\n").trim();
  const title = markdown.match(/^# (.+)\n/);
  const headings = [...markdown.matchAll(/^## (.+)$/gm)];
  if (!title || headings.length !== 19) {
    throw new Error(`${source}: expected a title, 17 sections, a quiz, and presenter notes.`);
  }

  const body = (index: number) =>
    markdown.slice(headings[index].index + headings[index][0].length, headings[index + 1]?.index).trim();

  const sections = headings.slice(0, 17).map((heading, index) => {
    const section = heading[1].match(/^(\d+)\. (.+)$/);
    if (!section || Number(section[1]) !== index + 1 || !body(index)) {
      throw new Error(`${source}: section ${index + 1} is missing, empty, or out of order.`);
    }
    return { id: index + 1, title: section[2], markdown: body(index) };
  });

  const quizParts = body(17).split(/\n\*\*(?:Answers|Хариултууд)\*\*\n/);
  if (quizParts.length !== 2) {
    throw new Error(`${source}: could not find the quiz answers.`);
  }
  const questions = numberedItems(quizParts[0], source);
  const answers = numberedItems(quizParts[1], source);

  return {
    title: title[1],
    intro: markdown.slice(title[0].length, headings[0].index).trim(),
    sections,
    quiz: questions.map((question, index) => ({ question, answer: answers[index] })),
    notes: markdown.slice(headings[18].index).trim(),
  };
}

const manuscript = Object.fromEntries(
  Object.entries(sourceFiles).map(([language, source]) => [language, readManuscript(source)]),
);
const generated = `${JSON.stringify(manuscript, null, 2)}\n`;

if (process.argv.includes("--check")) {
  let current = "";
  try {
    current = readFileSync(destination, "utf8");
  } catch {
    // Report a missing generated file with the same actionable message as a stale one.
  }
  if (current !== generated) {
    console.error("Presentation content is out of date. Run bun run generate:presentation.");
    process.exitCode = 1;
  } else {
    console.log("Presentation content matches both source manuscripts.");
  }
} else {
  writeFileSync(destination, generated);
  console.log(`Generated ${fileURLToPath(destination)}`);
}
