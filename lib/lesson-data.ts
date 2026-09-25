export type LessonSceneType = 'chapter' | 'statement' | 'diagram' | 'compare' | 'demoBridge' | 'fault' | 'final';
export type LessonDiagram = 'resources' | 'abstraction' | 'boundary' | 'scheduler' | 'memory' | 'files' | 'devices' | 'distro' | 'synthesis' | 'check';
export type LessonScene = {
  id: string;
  type: LessonSceneType;
  chapter: string;
  title: string;
  subtitle?: string;
  body?: string;
  diagram?: LessonDiagram;
  compare?: 'interfaces' | 'families' | 'fedora';
  demoApp?: 'files' | 'terminal' | 'system-monitor';
  demoLabel?: string;
  steps?: string[];
  provenance: 'outline' | 'clarification' | 'teaching-demo';
};

export const lessonChapters = [
  { number: '00', title: 'Beneath the surface' },
  { number: '01', title: 'The operating system' },
  { number: '02', title: 'Layers of abstraction' },
  { number: '03', title: 'Inside the kernel' },
  { number: '04', title: 'Processes & CPU' },
  { number: '05', title: 'Memory & protection' },
  { number: '06', title: 'Files & storage' },
  { number: '07', title: 'Devices & drivers' },
  { number: '08', title: 'Speaking to the system' },
  { number: '09', title: 'A family resemblance' },
  { number: '10', title: 'Linux, unpacked' },
  { number: '11', title: 'Fedora & GNOME' },
  { number: '12', title: 'The whole picture' },
  { number: '13', title: 'Yours to explore' },
];

export const lessonScenes: LessonScene[] = [
  { id: 'opening', type: 'chapter', chapter: '00', title: 'OPERATING\nSYSTEMS', subtitle: 'A journey beneath the surface.', body: 'You have already used one. Now let’s find out what made it possible.', provenance: 'outline' },
  { id: 'surface', type: 'statement', chapter: '00', title: 'ONE CLICK.\nA LOT HAPPENS.', body: 'A window opens. A process starts. Memory is assigned. Pixels reach the display. The desktop is the part you can see.', provenance: 'teaching-demo' },
  { id: 'definition', type: 'chapter', chapter: '01', title: 'THE QUIET\nCOORDINATOR.', subtitle: 'An operating system manages hardware resources and provides services for programs.', provenance: 'outline' },
  { id: 'resources', type: 'diagram', chapter: '01', title: 'SHARED HARDWARE.\nORDERED ACCESS.', body: 'Applications need the same resources. The OS coordinates access, isolates programs, and gives them useful abstractions.', diagram: 'resources', provenance: 'outline' },
  { id: 'abstraction', type: 'diagram', chapter: '02', title: 'LAYERS MAKE\nTHINGS SIMPLER.', body: 'An app asks to read a file. It does not need to know how a particular SSD moves electrical signals.', diagram: 'abstraction', provenance: 'outline' },
  { id: 'kernel', type: 'statement', chapter: '03', title: 'THE DESKTOP\nIS NOT THE KERNEL.', body: 'The kernel is the privileged core. The desktop, applications, and command shells run in user space, with limits enforced by the OS and hardware.', provenance: 'clarification' },
  { id: 'boundary', type: 'diagram', chapter: '03', title: 'CROSSING\nTHE BOUNDARY.', body: 'A system call is a controlled request for a kernel service. The kernel checks the request, performs permitted work, and returns a result.', diagram: 'boundary', provenance: 'clarification' },
  { id: 'process-demo', type: 'demoBridge', chapter: '04', title: 'AN APP IS OPEN.\nA PROCESS IS ALIVE.', body: 'A process is a running instance of a program, with its own state and resources. Let’s inspect this desktop’s simulated processes.', demoApp: 'system-monitor', demoLabel: 'Open System Monitor', steps: ['Notice the Lesson process.', 'Open Files from the dock.', 'Watch a new process and memory allocation appear.'], provenance: 'teaching-demo' },
  { id: 'scheduler', type: 'diagram', chapter: '04', title: 'ONE CORE.\nMANY TURNS.', body: 'The scheduler chooses a runnable thread. Hardware executes its instructions. A context switch saves one thread’s state and restores another’s.', diagram: 'scheduler', provenance: 'clarification' },
  { id: 'memory-intro', type: 'chapter', chapter: '05', title: 'A SPACE\nOF YOUR OWN.', subtitle: 'Virtual memory gives each process an address space.', body: 'Memory can be shared deliberately. Otherwise, protection helps keep one program from damaging another.', provenance: 'clarification' },
  { id: 'memory', type: 'diagram', chapter: '05', title: 'VIRTUAL ADDRESS.\nPHYSICAL MEMORY.', body: 'The OS allocates memory and sets up mappings and permissions. The CPU’s MMU translates addresses and enforces access while the program runs.', diagram: 'memory', provenance: 'clarification' },
  { id: 'fault', type: 'fault', chapter: '05', title: 'PAGE\nFAULT.', body: 'This is a valid address, but its page is not in RAM. The CPU raises an exception and the kernel handles it. A page fault does not always mean a crash.', provenance: 'clarification' },
  { id: 'files', type: 'diagram', chapter: '06', title: 'A NAME.\nA PLACE TO KEEP IT.', body: 'Filesystems organize names, directories, metadata, and stored data. The OS checks permissions and works with storage drivers to read or write.', diagram: 'files', provenance: 'outline' },
  { id: 'files-demo', type: 'demoBridge', chapter: '06', title: 'FOLLOW\nTHE PATH.', body: 'The desktop and terminal are two ways to explore the same virtual filesystem. Everything here stays inside this lesson.', demoApp: 'files', demoLabel: 'Explore Files', steps: ['Open Documents in your home folder.', 'Read notes.txt.', 'Find /etc/os-release to meet opitlcalOS.'], provenance: 'teaching-demo' },
  { id: 'devices', type: 'diagram', chapter: '07', title: 'HARDWARE HAS\nA TRANSLATOR.', body: 'Drivers know how to communicate with particular devices. An interrupt can signal that a device needs attention, so the CPU can run an appropriate handler.', diagram: 'devices', provenance: 'clarification' },
  { id: 'interfaces', type: 'compare', chapter: '08', title: 'DIFFERENT WORDS.\nTHE SAME SYSTEM.', body: 'A terminal provides text input and output. A command shell interprets commands. A graphical desktop uses windows, buttons, and pointers.', compare: 'interfaces', provenance: 'outline' },
  { id: 'terminal-demo', type: 'demoBridge', chapter: '08', title: 'ASK THE SYSTEM\nDIRECTLY.', body: 'Use this educational shell to inspect the same processes you saw in System Monitor. Terminating an app process closes its window.', demoApp: 'terminal', demoLabel: 'Open Terminal', steps: ['Run ps to list processes.', 'Find the PID for Files.', 'Run kill <PID> and watch Files close.'], provenance: 'teaching-demo' },
  { id: 'families', type: 'compare', chapter: '09', title: 'DIFFERENT FAMILIES.\nSHARED JOBS.', body: 'All coordinate processes, memory, files, and devices. Their kernels, interfaces, software ecosystems, and distribution models differ.', compare: 'families', provenance: 'outline' },
  { id: 'history', type: 'statement', chapter: '09', title: 'THE PROMPT\nCAME FIRST.', subtitle: 'A brief historical detour.', body: 'DOS and MS-DOS brought command-driven computing to early PCs. Macintosh helped popularize graphical interfaces. UNIX influenced many systems, including the Unix-like Linux family. Modern Windows is built on the NT family.', provenance: 'outline' },
  { id: 'distro', type: 'diagram', chapter: '10', title: 'LINUX IS\nTHE KERNEL.', body: 'A distribution combines the Linux kernel with tools, libraries, a package system, applications, and chosen defaults. A desktop environment is another layer.', diagram: 'distro', provenance: 'clarification' },
  { id: 'fedora', type: 'compare', chapter: '11', title: 'PUT NAMES\nTO THE LAYERS.', body: 'Fedora Workstation brings these pieces together. opitlcalOS borrows its desktop sensibility for this fictional, in-browser learning environment.', compare: 'fedora', provenance: 'clarification' },
  { id: 'synthesis', type: 'diagram', chapter: '12', title: 'EVERY LAYER.\nWORKING TOGETHER.', body: 'Opening a document touches the interface, a running process, memory, a filesystem, and a device. The OS coordinates the journey.', diagram: 'synthesis', provenance: 'outline' },
  { id: 'check', type: 'diagram', chapter: '12', title: 'YOUR TURN.', body: 'You click a document. Which component decides which runnable thread gets CPU time?', diagram: 'check', provenance: 'teaching-demo' },
  { id: 'complexity', type: 'statement', chapter: '12', title: 'IT MAKES\nCOMPLEXITY\nUSABLE.', body: 'That is what an operating system does.', provenance: 'outline' },
  { id: 'thank-you', type: 'final', chapter: '13', title: 'THANK\nYOU.', subtitle: 'The surface is yours to explore.', body: 'Open apps. Inspect processes. Read files. You know a little more about what happens underneath.', provenance: 'teaching-demo' },
];

export const lessonSources = [
  { title: 'Operating Systems: Three Easy Pieces', detail: 'Processes, scheduling, virtual memory, files, and I/O.', href: 'https://pages.cs.wisc.edu/~remzi/OSTEP/' },
  { title: 'Linux kernel documentation — Page Tables', detail: 'Address translation, the MMU, and page-fault handling.', href: 'https://docs.kernel.org/mm/page_tables.html' },
  { title: 'Fedora Workstation', detail: 'A Linux distribution with the GNOME desktop.', href: 'https://fedoraproject.org/workstation/' },
  { title: 'GNOME Human Interface Guidelines', detail: 'Desktop interaction and interface design reference.', href: 'https://developer.gnome.org/hig/' },
];
