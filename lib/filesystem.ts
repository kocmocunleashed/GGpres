import { manuscript, type Language } from "./presentation-data";

export type VirtualEntry = { type: "directory" } | { type: "file"; content: string };
export type VirtualFilesystem = Record<string, VirtualEntry>;
export const HOME_DIRECTORY = "/home/student";
export const TOTAL_MEMORY_MB = 8192;

function lessonOutline(language: Language): string {
  const lesson = manuscript[language];
  const chapters = lesson.sections.map((section) => `${String(section.id).padStart(2, "0")}  ${section.title}`).join("\n");
  const instructions = language === "en"
    ? "17 chapters, then 8 questions. Choose English or Mongolian in Settings.\nChoose Read along for the full story and questions with answers to reveal.\n\nTry: ls /home/student/Documents\nThen: cat /home/student/Documents/notes.txt"
    : "17 хэсгийн дараа 8 асуулт бий. Settings дотор English эсвэл Монгол хэлээ сонгоно.\nУншиж дагах горимоор дэлгэрэнгүй тайлбар болон хариуг нь нээж үзэх асуултуудыг уншаарай.\n\nТуршаарай: ls /home/student/Documents\nДараа нь: cat /home/student/Documents/notes.mn.txt";
  return `# ${lesson.title}\n\n${chapters}\n\n${instructions}`;
}

export function createFilesystem(): VirtualFilesystem {
  return {
    "/": { type: "directory" },
    "/home": { type: "directory" },
    "/home/student": { type: "directory" },
    "/home/student/Documents": { type: "directory" },
    "/home/student/Pictures": { type: "directory" },
    "/home/student/Downloads": { type: "directory" },
    "/home/student/Documents/notes.txt": { type: "file", content: "A note about the blue cat\n\nYou opened an app, drew a cat, and saved it.\nThe CPU followed instructions. RAM held the work. Storage kept the saved picture.\nThe operating system helped the app use those parts.\n\nOpen Files and find this note in Documents. Then open Terminal and try:\nls /home/student/Documents\ncat /home/student/Documents/notes.txt\n\nThe window and commands show the same pretend files. These commands only list names and read text.\nFor Mongolian, read notes.mn.txt. The lesson-outline files list all 17 chapters.\n\nThis entire workstation is a learning simulation. Your real files are never accessed." },
    "/home/student/Documents/notes.mn.txt": { type: "file", content: "Цэнхэр муурын тухай тэмдэглэл\n\nЧи апп нээж, муур зураад хадгалсан.\nCPU зааврыг биелүүлсэн. RAM ажлын мэдээллийг байлгасан. Storage хадгалсан зургийг үлдээсэн.\nOS аппад эдгээр хэсгийг ашиглахад тусалсан.\n\nFiles-ийн Documents хавтсаас энэ тэмдэглэлийг ол. Дараа нь Terminal нээгээд туршаарай:\nls /home/student/Documents\ncat /home/student/Documents/notes.mn.txt\n\nЦонх болон команд ижил дуураймал файлуудыг харуулна. Эдгээр команд зөвхөн нэрсийг жагсааж, бичвэрийг уншина.\nlesson-outline.mn.md файлд бүх 17 хэсгийн нэр бий.\n\nЭнэ desktop бол сургалтын загвар. Чиний жинхэнэ файлуудад хандахгүй." },
    "/home/student/Documents/lesson-outline.md": { type: "file", content: lessonOutline("en") },
    "/home/student/Documents/lesson-outline.mn.md": { type: "file", content: lessonOutline("mn") },
    "/home/student/Downloads/read-me.txt": { type: "file", content: "Nothing to download. Everything you need is already here.\n\nTry: cat /etc/os-release\nThen: neofetch" },
    "/etc": { type: "directory" },
    "/etc/os-release": { type: "file", content: 'NAME="opitlcalOS"\nID=opitlcal\nVERSION="1.0 (Classroom)"\nPRETTY_NAME="opitlcalOS — Classroom simulation"\nEDUCATIONAL_SIMULATION=yes\n# Fictional system. Not an official Fedora product.' },
    "/etc/hostname": { type: "file", content: "opitlcal-workstation" },
    "/proc": { type: "directory" },
    "/proc/cpuinfo": { type: "file", content: "processor       : 0\nmodel name      : opitlcal Virtual CPU\ncpu cores       : 4\n\nEducational simulation. These are not your device specifications." },
    "/proc/meminfo": { type: "file", content: "" },
    "/proc/uptime": { type: "file", content: "" },
    "/usr": { type: "directory" },
    "/usr/share": { type: "directory" },
    "/usr/share/opitlcalos.txt": { type: "file", content: "opitlcalOS 1.0 / Classroom edition\n\nA fictional desktop inspired by GNOME. It runs inside a web page.\nLinux is a kernel. Fedora is a distribution. GNOME is a desktop environment.\n\nWe like Fedora as a place to learn. This model is not a real Fedora installation.\nIts files, processes, and system numbers are pretend." },
    "/var": { type: "directory" },
    "/tmp": { type: "directory" },
  };
}

export function resolvePath(input: string, cwd = HOME_DIRECTORY): string {
  const expanded = input === "~" ? HOME_DIRECTORY : input.startsWith("~/") ? `${HOME_DIRECTORY}/${input.slice(2)}` : input;
  const absolute = expanded.startsWith("/") ? expanded : `${cwd}/${expanded}`;
  const parts: string[] = [];
  for (const part of absolute.split("/")) {
    if (part === "..") parts.pop();
    else if (part && part !== ".") parts.push(part);
  }
  return `/${parts.join("/")}`;
}

export function listDirectory(filesystem: VirtualFilesystem, path: string): { name: string; path: string; type: VirtualEntry["type"] }[] {
  if (filesystem[path]?.type !== "directory") return [];
  const prefix = path === "/" ? "/" : `${path}/`;
  return Object.entries(filesystem)
    .filter(([entryPath]) => entryPath.startsWith(prefix) && entryPath !== path && !entryPath.slice(prefix.length).includes("/"))
    .map(([entryPath, entry]) => ({ name: entryPath.slice(prefix.length), path: entryPath, type: entry.type }))
    .sort((a, b) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === "directory" ? -1 : 1));
}

export function readVirtualFile(filesystem: VirtualFilesystem, path: string, metrics: { usedMemory: number; startedAt: number }): string | null {
  const file = filesystem[path];
  if (!file || file.type !== "file") return null;
  if (path === "/proc/meminfo") return `MemTotal:       ${TOTAL_MEMORY_MB * 1024} kB\nMemUsed:        ${metrics.usedMemory * 1024} kB\nMemAvailable:   ${(TOTAL_MEMORY_MB - metrics.usedMemory) * 1024} kB\n\nSimulated allocations shared with System Monitor.`;
  if (path === "/proc/uptime") return `${Math.max(0, (Date.now() - metrics.startedAt) / 1000).toFixed(2)} 0.00\n# Simulated session uptime in seconds.`;
  return file.content;
}
