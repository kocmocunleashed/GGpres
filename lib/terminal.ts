import { HOME_DIRECTORY, listDirectory, readVirtualFile, resolvePath, TOTAL_MEMORY_MB } from "@/lib/filesystem";
import { totalCpu, totalMemory, useSystemStore } from "@/store/system";

export type TerminalContext = { cwd: string; history: string[] };
export type TerminalResult = { output: string; cwd?: string; clear?: boolean };
const COMMANDS = ["help", "ls", "cd", "pwd", "cat", "clear", "history", "whoami", "uname", "hostname", "ps", "top", "free", "kill", "man", "neofetch", "lesson", "dino", "slots", "sudo", "rm", "reboot", "fedora", "geometry-dash"];
const MANUAL: Record<string, string> = {
  ls: "ls [path]\nList the files and folders at a virtual path. Try ls /home/student/Documents.", cd: "cd [path]\nChange directory. With no path, return home. Use cd .. to go up.",
  cat: "cat <file> [file...]\nRead a virtual text file. Try cat /home/student/Documents/notes.txt.\nFor Mongolian: cat /home/student/Documents/notes.mn.txt.",
  ps: "ps\nShow a snapshot of simulated processes. PID identifies a process; memory is in MiB. Opening an app adds its process.",
  top: "top\nShow one snapshot of simulated process and CPU usage. Open System Monitor for the live shared view.",
  kill: "kill <pid>\nEnd a simulated app process and close its window. Protected system processes cannot be ended in this lesson.",
  free: "free [-m|-h]\nShow the simulated system's memory allocation. These numbers match System Monitor.",
  uname: "uname [-a|-r]\nShow this fictional system's kernel name or version. opitlcalOS does not run a real kernel inside your browser.",
  lesson: "lesson\nOpen or focus Your computer, your choices: 17 chapters and 8 questions.\nChoose EN / MN for English or Mongolian. Read along opens the full manuscript.",
  dino: "dino\nOpen or focus Dino Runner. Space or Up jumps; Down ducks. Pauses when you leave the game.",
  slots: "slots\nOpen or focus Pocket Slots. Three reels, 30 free demo credits.\nA spin costs 1 credit. Press the Spin button with Enter or Space.\nDemo credits have no monetary value; Reset gives you a fresh set.",
  reboot: "reboot\nReset the virtual desktop session, closing every app. Your browser and real computer are unaffected.",
};

function processTable(): string {
  return ["  PID  PROCESS               CPU %    MEMORY", ...useSystemStore.getState().processes.map((process) => `${String(process.pid).padStart(5)}  ${process.name.padEnd(20)} ${process.cpu.toFixed(1).padStart(5)}  ${String(process.memory).padStart(5)} MiB${process.protected ? "  [system]" : ""}`)].join("\n");
}

export function executeCommand(input: string, context: TerminalContext): TerminalResult {
  const tokens = input.trim().match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g)?.map((token) => token.replace(/^("|')(.*)\1$/, "$2")) ?? [];
  const [command, ...args] = tokens;
  if (!command) return { output: "" };
  const state = useSystemStore.getState();
  const filesystem = state.filesystem;
  const usedMemory = totalMemory(state.processes);
  const path = resolvePath(args[0] ?? "", context.cwd);
  switch (command) {
    case "help": return { output: `opitlcal shell · a safe, simulated command line\n\n${COMMANDS.join("  ")}\n\nStart with the same files you see in Files:\nls /home/student/Documents\ncat /home/student/Documents/notes.txt\nFor Mongolian: cat /home/student/Documents/notes.mn.txt\n\nls lists names; cat reads text. Neither changes a file.\nType lesson to open the presentation, or man followed by a command to learn about it.\nUse ↑ / ↓ for history. Tab completes commands and paths.\nNothing here can access your real computer.` };
    case "pwd": return { output: context.cwd };
    case "whoami": return { output: "student" };
    case "hostname": return { output: "opitlcal-workstation" };
    case "clear": return { output: "", clear: true };
    case "history": return { output: context.history.map((entry, index) => `${String(index + 1).padStart(3)}  ${entry}`).join("\n") };
    case "ls": {
      const target = resolvePath(args.find((arg) => !arg.startsWith("-")) ?? "", context.cwd);
      if (!filesystem[target]) return { output: `ls: ${target}: no such file or directory` };
      if (filesystem[target].type === "file") return { output: target.split("/").at(-1) ?? target };
      const entries = listDirectory(filesystem, target);
      return { output: entries.length ? entries.map((entry) => `${entry.name}${entry.type === "directory" ? "/" : ""}`).join(args.includes("-l") || args.includes("-la") ? "\n" : "   ") : "(empty directory)" };
    }
    case "cd": {
      const target = args[0] ? path : HOME_DIRECTORY;
      if (!filesystem[target]) return { output: `cd: ${target}: no such file or directory` };
      if (filesystem[target].type !== "directory") return { output: `cd: ${target}: not a directory` };
      return { output: "", cwd: target };
    }
    case "cat": {
      if (!args.length) return { output: "Usage: cat <file>" };
      return { output: args.map((arg) => {
        const target = resolvePath(arg, context.cwd);
        if (filesystem[target]?.type === "directory") return `cat: ${arg}: is a directory`;
        return readVirtualFile(filesystem, target, { usedMemory, startedAt: state.startedAt }) ?? `cat: ${arg}: no such file`;
      }).join("\n") };
    }
    case "uname": return { output: args.includes("-a") ? "Linux opitlcal-workstation 6.12.0-opitlcal #1 SIMULATED x86_64 GNU/Linux" : args.includes("-r") ? "6.12.0-opitlcal (simulated)" : "Linux (simulated)" };
    case "ps": return { output: processTable() };
    case "top": return { output: `opitlcalOS · simulated resource snapshot\n${state.processes.length} processes · ${totalCpu(state.processes).toFixed(1)}% CPU · ${usedMemory} / ${TOTAL_MEMORY_MB} MiB\n\n${processTable()}\n\nFor a live view, open System Monitor.` };
    case "free": return { output: `SIMULATED MEMORY (MiB)\n            total     used     available\nMem:       ${String(TOTAL_MEMORY_MB).padStart(6)}   ${String(usedMemory).padStart(6)}   ${String(TOTAL_MEMORY_MB - usedMemory).padStart(9)}\nSwap:           0        0           0` };
    case "kill": {
      if (args.length !== 1 || !/^\d+$/.test(args[0])) return { output: "Usage: kill <pid>  ·  Use ps to find a process ID." };
      const pid = Number(args[0]);
      const process = state.processes.find((process) => process.pid === pid);
      if (!process) return { output: `kill: ${pid}: no such process` };
      if (process.protected) return { output: `kill: ${pid}: permission denied — core lesson services are protected.` };
      state.killProcess(pid);
      return { output: `Ended ${process.name} (${pid}). Released ${process.memory} MiB.` };
    }
    case "man": return { output: args[0] ? MANUAL[args[0]] ?? (COMMANDS.includes(args[0]) ? `${args[0]}\nA built-in opitlcalOS learning command. Type help for the full command list.` : `No manual entry for ${args[0]}.`) : "Usage: man <command>. Try man ls or man cat." };
    case "neofetch": return { output: "       /\\         student@opitlcal-workstation\n      /  \\        ─────────────────────────\n     / /\\ \\       OS       opitlcalOS 1.0 Classroom\n    / /  \\ \\      Kernel   Linux 6.12 (simulated)\n    \\ \\  / /      Desktop  opitlcal Shell · GNOME-inspired\n     \\ \\/ /       Shell    opitlcal-sh\n      \\  /        Memory   " + usedMemory + " / 8192 MiB\n       \\/         Motto    Make complexity usable.\n\nA fictional educational system. Not an official Fedora product." };
    case "lesson": state.openApp("lesson"); return { output: "Opening Your computer, your choices…" };
    case "dino": state.openApp("runner"); return { output: "Opening Dino Runner…" };
    case "slots": state.openApp("slots"); return { output: "Opening Pocket Slots…" };
    case "sudo": return { output: args[0] === "rm" ? "Absolutely not.\nThis is a school project." : "student is already the administrator of their curiosity.\nThis simulated shell does not elevate privileges." };
    case "rm": return { output: "This classroom filesystem is read-only. Your notes are safe." };
    case "reboot": state.resetSession(); state.notify("Session restarted", "A fresh desktop. The curiosity stays."); return { output: "Restarting virtual session…" };
    case "fedora": return { output: "Fedora is a Linux distribution. Linux is its kernel.\nGNOME is the desktop environment used by Fedora Workstation.\n\nWe like Fedora for exploring how a computer works.\nIt still needs updates, and your apps and devices need to work with it.\nType lesson to learn more." };
    case "geometry-dash": return { output: "Difficulty: remembering to save the cat.\nAttempts: unlimited.\nPractice mode: already enabled." };
    default: return { output: `${command}: command not found. Type help to see available commands.` };
  }
}

export function completeCommand(input: string, cwd: string): string {
  const parts = input.split(" ");
  const last = parts.at(-1) ?? "";
  if (parts.length === 1) {
    const matches = COMMANDS.filter((command) => command.startsWith(last));
    return matches.length === 1 ? `${matches[0]} ` : input;
  }
  const slash = last.lastIndexOf("/");
  const prefix = slash >= 0 ? last.slice(0, slash + 1) : "";
  const name = last.slice(slash + 1);
  const entries = listDirectory(useSystemStore.getState().filesystem, resolvePath(prefix || ".", cwd)).filter((entry) => entry.name.startsWith(name));
  if (entries.length !== 1) return input;
  return [...parts.slice(0, -1), `${prefix}${entries[0].name}${entries[0].type === "directory" ? "/" : " "}`].join(" ");
}
