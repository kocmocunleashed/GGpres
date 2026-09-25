export type VirtualEntry = { type: "directory" } | { type: "file"; content: string };
export type VirtualFilesystem = Record<string, VirtualEntry>;
export const HOME_DIRECTORY = "/home/student";
export const TOTAL_MEMORY_MB = 8192;

export function createFilesystem(): VirtualFilesystem {
  return {
    "/": { type: "directory" },
    "/home": { type: "directory" },
    "/home/student": { type: "directory" },
    "/home/student/Documents": { type: "directory" },
    "/home/student/Pictures": { type: "directory" },
    "/home/student/Downloads": { type: "directory" },
    "/home/student/Documents/notes.txt": { type: "file", content: "A note from your workstation\n\nThe desktop is only the surface.\n\nOpen Files, then open System Monitor. Notice the new process?\nIn Terminal, type ps to see the same list. Use kill PID to end an app.\n\nEvery window belongs to a process. The operating system manages the resources that let it run.\n\nThis entire workstation is a learning simulation. Your real files are never accessed." },
    "/home/student/Documents/lesson-outline.md": { type: "file", content: "# Operating systems: beneath the surface\n\n01  What is an operating system?\n02  Applications, system calls, and abstraction\n03  Kernel and user space\n04  Processes and CPU scheduling\n05  Memory and virtual memory\n06  Files and storage\n07  Devices, drivers, and interrupts\n08  Graphical and command-line interfaces\n09  Windows, macOS, UNIX, and Linux distributions\n10  Linux kernel vs. a distribution\n11  Fedora and GNOME\n12  Making complexity usable\n\nThe Linux kernel is not the same thing as a complete Linux distribution.\nGNOME is a desktop environment. A shell interprets commands in user space." },
    "/home/student/Downloads/read-me.txt": { type: "file", content: "Nothing to download. Everything you need is already here.\n\nTry: cat /etc/os-release\nThen: neofetch" },
    "/etc": { type: "directory" },
    "/etc/os-release": { type: "file", content: 'NAME="opitlcalOS"\nID=opitlcal\nVERSION="1.0 (Classroom)"\nPRETTY_NAME="opitlcalOS — A Completely Unbiased Linux Distribution"\nEDUCATIONAL_SIMULATION=yes\n# Fictional system. Not an official Fedora product.' },
    "/etc/hostname": { type: "file", content: "opitlcal-workstation" },
    "/proc": { type: "directory" },
    "/proc/cpuinfo": { type: "file", content: "processor       : 0\nmodel name      : opitlcal Virtual CPU\ncpu cores       : 4\n\nEducational simulation. These are not your device specifications." },
    "/proc/meminfo": { type: "file", content: "" },
    "/proc/uptime": { type: "file", content: "" },
    "/usr": { type: "directory" },
    "/usr/share": { type: "directory" },
    "/usr/share/opitlcalos.txt": { type: "file", content: "opitlcalOS 1.0 / Classroom edition\n\nAn original, fictional desktop inspired by the calm interaction patterns of GNOME.\nLinux is a kernel. Fedora is a distribution. GNOME is a desktop environment.\n\nOpinionated wallpaper. Unbiased lesson." },
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
