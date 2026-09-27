import type {
  LessonScene,
  SceneAction,
  SceneKind,
  SceneNode,
  SceneWords,
} from "./lesson-scene";

const w = (en: string, mn: string): SceneWords => [en, mn];
const n = (
  id: string,
  kind: SceneKind,
  en: string,
  mn: string,
  options: Omit<SceneNode, "id" | "kind" | "label"> = {},
): SceneNode => ({ id, kind, label: w(en, mn), ...options });
const a = (id: string, en: string, mn: string, to: string): SceneAction => ({
  id,
  label: w(en, mn),
  to,
});
const reset = (to: string) =>
  a("reset", "Reset example", "Жишээг эхлүүлэх", to);
const choose = (actions: readonly SceneAction[], current: string) =>
  actions.filter((action) => action.to !== current);

const drawingApp = () =>
  n("drawing-app", "app", "Drawing app", "Зургийн апп", { content: "drawing" });
const os = () =>
  n("os", "software", "Operating system", "Operating system", {
    detail: w(
      "Software that helps apps use the computer.",
      "Аппад компьютер ашиглахад тусалдаг программ.",
    ),
  });
const storedCat = (saved: boolean) =>
  n("storage", "storage", "Storage", "Storage", {
    content: saved ? "drawing" : undefined,
    status: saved
      ? w("cat.png saved", "cat.png хадгалагдсан")
      : w("No saved cat yet", "Муурыг хараахан хадгалаагүй"),
  });

const familyActions = [
  a("show-windows", "Windows", "Windows", "windows"),
  a("show-macos", "macOS", "macOS", "macos"),
  a("show-fedora", "Fedora", "Fedora", "fedora"),
];
const distroActions = [
  a(
    "show-overview",
    "The whole distribution",
    "Бүтэн distribution",
    "overview",
  ),
  a("show-linux", "Linux", "Linux", "linux"),
  a("show-gnome", "GNOME", "GNOME", "gnome"),
  a("show-apps", "Apps and tools", "Апп ба хэрэгслүүд", "apps"),
];
const distroNodes = (selected: string) => [
  n("linux", "software", "Linux: kernel", "Linux: kernel", {
    tone: selected === "linux" ? "active" : "normal",
    detail: w(
      "Helps manage CPU time, RAM, and device access.",
      "CPU-ийн цаг, RAM, төхөөрөмжид хандах эрхийг зохицуулна.",
    ),
  }),
  n("gnome", "desktop", "GNOME: desktop", "GNOME: desktop", {
    tone: selected === "gnome" ? "active" : "normal",
    detail: w(
      "Windows, menus, and desktop controls.",
      "Цонх, цэс, desktop-ийн удирдлага.",
    ),
  }),
  n("apps", "app", "Apps and tools", "Апп ба хэрэгслүүд", {
    tone: selected === "apps" ? "active" : "normal",
    content: "drawing",
    detail: w(
      "Software for drawing and other jobs.",
      "Зурах болон бусад ажил хийх программ.",
    ),
  }),
];
const permissionNodes = (choice: "pending" | "allowed" | "denied") => [
  drawingApp(),
  n("contacts", "contacts", "Contacts", "Contacts", {
    content: "contacts",
    tone:
      choice === "denied"
        ? "blocked"
        : choice === "allowed"
          ? "active"
          : "normal",
    status:
      choice === "pending"
        ? w("No decision yet", "Хараахан шийдээгүй")
        : choice === "allowed"
          ? w("App may read", "Апп уншиж болно")
          : w("Access refused", "Хандахыг зөвшөөрөөгүй"),
    detail: w(
      "Saved names and contact details",
      "Хадгалсан нэр, холбоо барих мэдээлэл",
    ),
  }),
  n("package", "package", "App package", "Аппын package", {
    detail: w(
      "Check who provides the app before installing.",
      "Суулгахаас өмнө аппыг хэн нийлүүлснийг шалга.",
    ),
  }),
];
const messageActions = [
  a("show-update", "Update check", "Шинэчлэлт шалгах", "update"),
  a("show-diagnostic", "Diagnostic report", "Diagnostic report", "diagnostic"),
  a("show-upload", "Chosen upload", "Сонгосон upload", "upload"),
];
const reportActions = [
  a("show-windows", "Windows", "Windows", "windows"),
  a("show-macos", "macOS", "macOS", "macos"),
  a("show-fedora", "Fedora", "Fedora", "fedora"),
];
const serviceReminder = () =>
  n("services", "app", "Apps and websites", "Апп ба вэбсайтууд", {
    detail: w(
      "Their own settings still apply.",
      "Өөрсдийн тохиргоо нь үйлчилсээр байна.",
    ),
  });
const windowsReports = (optional: boolean) => [
  n("system", "software", "Windows 11 home PC", "Windows 11 гэрийн PC"),
  n(
    "required",
    "software",
    "Required diagnostics",
    "Заавал илгээх diagnostics",
    {
      content: "text",
      status: w("Still sent", "Илгээгдсээр байна"),
      detail: w(
        "Device, settings, reliability",
        "Төхөөрөмж, тохиргоо, ажиллагаа",
      ),
    },
  ),
  n("optional", "software", "Optional diagnostics", "Сонголттой diagnostics", {
    content: optional ? "text" : undefined,
    tone: optional ? "active" : "muted",
    status: optional
      ? w("On in this example", "Энэ жишээнд асаалттай")
      : w("Off in this example", "Энэ жишээнд унтраалттай"),
    detail: w(
      "Can add app activity, browsing details, and richer crash reports.",
      "Аппын хэрэглээ, browsing, crash-ийн дэлгэрэнгүй мэдээлэл нэмж болно.",
    ),
  }),
  serviceReminder(),
];
const macReports = (enabled: boolean) => [
  n("system", "software", "macOS", "macOS"),
  n("analytics", "software", "Mac analytics", "Mac analytics", {
    content: enabled ? "text" : undefined,
    tone: enabled ? "active" : "muted",
    status: enabled
      ? w("Permission given in this example", "Энэ жишээнд зөвшөөрөл өгсөн")
      : w("Sharing off in this example", "Энэ жишээнд илгээхийг унтраасан"),
    detail: w(
      "Hardware, software, crashes, feature use",
      "Hardware, software, crash, ашигласан боломжууд",
    ),
  }),
  serviceReminder(),
];
const habitActions = [
  a("show-updates", "Updates", "Шинэчлэлт", "updates"),
  a("show-sources", "App sources", "Аппын эх сурвалж", "sources"),
  a("show-signins", "Sign-ins", "Нэвтрэх", "signins"),
  a("show-permissions", "Permissions", "Permission", "permissions"),
  a("show-backup", "Backup", "Backup", "backup"),
  a("show-help", "Ask for help", "Тусламж хүсэх", "help"),
];
const documentNames =
  "lesson-outline.md\nlesson-outline.mn.md\nnotes.mn.txt\nnotes.txt";
const noteExcerpt =
  "A note about the blue cat\n\nYou opened an app, drew a cat, and saved it.";
const updatePayload = w("system_version: example", "system_version: example");
const diagnosticPayload = w(
  "app: drawing\nevent: crash",
  "app: drawing\nevent: crash",
);
const note = () =>
  n("note", "text-file", "notes.txt", "notes.txt", {
    content: "text",
    ink: w(noteExcerpt, noteExcerpt),
    status: w("Excerpt of the file", "Файлаас авсан хэсэг"),
    detail: w(
      "/home/student/Documents/notes.txt",
      "/home/student/Documents/notes.txt",
    ),
  });
const terminalActions = [
  a("show-folder", "Files window", "Files-ийн цонх", "folder"),
  a("list-names", "List names with ls", "ls-ээр нэрсийг жагсаах", "names"),
  a("read-text", "Read text with cat", "cat-аар бичвэрийг унших", "text"),
];

/** Illustrations change only through the actions offered in each state. */
export const LESSON_SCENES: readonly LessonScene[] = [
  {
    chapter: 1,
    title: w("An app asks the OS for help", "Апп OS-оос тусламж хүснэ"),
    summary: w(
      "The app draws. The OS helps it use the computer's resources. Try saving the picture.",
      "Апп зураг зурна. OS компьютерийн нөөцийг ашиглахад нь тусална. Зургийг хадгалж үз.",
    ),
    initial: "drawing",
    states: [
      {
        id: "drawing",
        title: w(
          "The picture is open in the app",
          "Зураг апп дотор нээлттэй байна",
        ),
        description: w(
          "The blue cat is on the screen. This example has no saved copy yet.",
          "Цэнхэр муур дэлгэц дээр байна. Энэ жишээнд хадгалсан хуулбар хараахан алга.",
        ),
        nodes: [drawingApp(), os(), storedCat(false)],
        actions: [a("save", "Save the cat", "Муурыг хадгалах", "saved")],
      },
      {
        id: "saved",
        title: w("Now there is a saved file", "Одоо хадгалсан файл бий"),
        description: w(
          "The app asked the OS to save cat.png. The saved copy is in storage; the drawing stays open in the app.",
          "Апп OS-оос cat.png-ийг хадгалахыг хүссэн. Хуулбар storage-д хадгалагдсан. Зураг апп дотор нээлттэй хэвээр.",
        ),
        nodes: [drawingApp(), os(), storedCat(true)],
        relations: [
          {
            from: "drawing-app",
            to: "os",
            kind: "request",
            label: w("Asked to save", "Хадгалахыг хүссэн"),
          },
        ],
        actions: [reset("drawing")],
      },
    ],
  },
  {
    chapter: 2,
    title: w(
      "Working memory and saved files",
      "Ажлын memory ба хадгалсан файл",
    ),
    summary: w(
      "CPU follows instructions. Ordinary RAM needs power to keep its contents. Storage keeps saved files.",
      "CPU зааврыг биелүүлнэ. Энгийн RAM мэдээллээ хадгалахад тог хэрэгтэй. Storage хадгалсан файлыг үлдээнэ.",
    ),
    initial: "powered",
    states: [
      {
        id: "powered",
        title: w("The computer is on", "Компьютер асаалттай"),
        description: w(
          "An app has working data in RAM. A saved cat.png is already in storage. Each part has a different job.",
          "Аппын ажлын мэдээлэл RAM-д байна. Хадгалсан cat.png storage-д бий. Хэсэг бүр өөрийн ажилтай.",
        ),
        nodes: [
          n("cpu", "cpu", "CPU", "CPU", {
            tone: "active",
            status: w("Following instructions", "Зааврыг биелүүлж байна"),
          }),
          n("ram", "ram", "RAM", "RAM", {
            content: "work",
            status: w("Working data", "Ажлын мэдээлэл"),
          }),
          storedCat(true),
        ],
        actions: [a("power-off", "Turn power off", "Тогийг унтраах", "off")],
      },
      {
        id: "off",
        title: w("Power is off", "Тог унтарсан"),
        description: w(
          "CPU work stops. RAM loses its working data. The saved file stays in storage.",
          "CPU ажиллахаа зогсоно. RAM дахь ажлын мэдээлэл арилна. Хадгалсан файл storage-д үлдэнэ.",
        ),
        nodes: [
          n("cpu", "cpu", "CPU", "CPU", {
            tone: "muted",
            status: w("Stopped", "Зогссон"),
          }),
          n("ram", "ram", "RAM", "RAM", {
            tone: "muted",
            status: w("Previous work is gone", "Өмнөх ажил арилсан"),
          }),
          storedCat(true),
        ],
        actions: [
          a("power-on", "Turn power on", "Тогийг асаах", "restarted"),
          reset("powered"),
        ],
      },
      {
        id: "restarted",
        title: w(
          "Power does not restore the old RAM",
          "Тог асаахад өмнөх RAM буцаж ирэхгүй",
        ),
        description: w(
          "The computer can start fresh work. Its previous drawing-app work is gone from RAM; cat.png can be opened from storage again. Boot-time memory is omitted here.",
          "Компьютер шинэ ажил эхэлж чадна. Зургийн аппын өмнөх ажил RAM-д байхгүй. Storage дахь cat.png-ийг дахин нээж болно. Асаах үед ашиглах memory-г энд үзүүлээгүй.",
        ),
        nodes: [
          n("cpu", "cpu", "CPU", "CPU", {
            tone: "active",
            status: w("Powered on", "Асаалттай"),
          }),
          n("ram", "ram", "RAM", "RAM", {
            status: w("No previous drawing work", "Өмнөх зургийн ажил байхгүй"),
          }),
          storedCat(true),
        ],
        actions: [
          a(
            "reopen-file",
            "Open the saved picture",
            "Хадгалсан зургийг нээх",
            "powered",
          ),
          a("power-off", "Turn power off", "Тогийг унтраах", "off"),
        ],
      },
    ],
  },
  {
    chapter: 3,
    title: w(
      "Two running programs share a core",
      "Хоёр программ нэг core-ийг хуваалцана",
    ),
    summary: w(
      "A process is a running program. This slowed example shows one CPU core giving each process a turn; real scheduling is more varied.",
      "Process бол ажиллаж буй программ. Энэ удаашруулсан жишээнд нэг CPU core хоёр process-д ээлж өгнө. Бодит ээлжийн дараалал өөр байж болно.",
    ),
    initial: "drawing-turn",
    states: [
      {
        id: "drawing-turn",
        title: w(
          "The drawing process has this turn",
          "Энэ ээлж зургийн process-ийнх",
        ),
        description: w(
          "The drawing process is using the core. The music process is waiting for its turn. The OS helps them share processor time.",
          "Зургийн process core-ийг ашиглаж байна. Хөгжмийн process ээлжээ хүлээнэ. OS processor-ийн цагийг хуваарилахад тусална.",
        ),
        nodes: [
          n(
            "drawing-process",
            "process",
            "Drawing process",
            "Зургийн process",
            {
              content: "drawing",
              tone: "active",
              status: w("Running", "Ажиллаж байна"),
            },
          ),
          n("music-process", "process", "Music process", "Хөгжмийн process", {
            content: "music",
            tone: "muted",
            status: w("Waiting", "Хүлээж байна"),
          }),
          n("core", "cpu-core", "One CPU core", "Нэг CPU core", {
            tone: "active",
            status: w("Drawing instructions", "Зургийн зааврыг гүйцэтгэнэ"),
          }),
        ],
        relations: [
          {
            from: "drawing-process",
            to: "core",
            kind: "uses",
            label: w("Uses this turn", "Энэ ээлжийг ашиглана"),
          },
        ],
        actions: [a("next-turn", "Next turn", "Дараагийн ээлж", "music-turn")],
      },
      {
        id: "music-turn",
        title: w(
          "Now the music process has a turn",
          "Одоо хөгжмийн process-ийн ээлж",
        ),
        description: w(
          "The OS gives the music process a turn. Several CPU cores can work at once; we are looking at only one here.",
          "OS хөгжмийн process-д ээлж өглөө. Хэд хэдэн CPU core зэрэг ажиллаж чадна. Энд зөвхөн нэгийг харуулсан.",
        ),
        nodes: [
          n(
            "drawing-process",
            "process",
            "Drawing process",
            "Зургийн process",
            {
              content: "drawing",
              tone: "muted",
              status: w("Waiting", "Хүлээж байна"),
            },
          ),
          n("music-process", "process", "Music process", "Хөгжмийн process", {
            content: "music",
            tone: "active",
            status: w("Running", "Ажиллаж байна"),
          }),
          n("core", "cpu-core", "One CPU core", "Нэг CPU core", {
            tone: "active",
            status: w("Music instructions", "Хөгжмийн зааврыг гүйцэтгэнэ"),
          }),
        ],
        relations: [
          {
            from: "music-process",
            to: "core",
            kind: "uses",
            label: w("Uses this turn", "Энэ ээлжийг ашиглана"),
          },
        ],
        actions: [
          a("next-turn", "Next turn", "Дараагийн ээлж", "drawing-turn"),
        ],
      },
    ],
  },
  {
    chapter: 4,
    title: w("Save cat.png in Pictures", "cat.png-ийг Pictures дотор хадгалах"),
    summary: w(
      "Follow a simplified save request. The access check and driver are software work, not separate physical devices. Sync is off in this example.",
      "Хадгалах хүсэлтийг хялбарчилж харъя. Эрх шалгах болон driver-ийн ажил нь программын ажил. Энэ жишээнд sync унтраалттай.",
    ),
    initial: "ready",
    states: [
      {
        id: "ready",
        title: w(
          "Choose the file's name and folder",
          "Файлын нэр, хавтсыг сонго",
        ),
        description: w(
          "The drawing is open. Pictures/cat.png is the chosen location, but it has not been written yet.",
          "Зураг нээлттэй байна. Pictures/cat.png нь сонгосон байрлал. Файлыг хараахан бичээгүй.",
        ),
        nodes: [
          drawingApp(),
          n("os", "software", "OS: file access", "OS: файлд хандах", {
            status: w("Waiting for Save", "Save дарахыг хүлээнэ"),
          }),
          storedCat(false),
        ],
        actions: [
          a("save", "Request Save", "Хадгалах хүсэлт өгөх", "requested"),
        ],
      },
      {
        id: "requested",
        title: w(
          "The app asks to write the picture",
          "Апп зургийг бичихийг хүснэ",
        ),
        description: w(
          "The request names Pictures/cat.png. The OS must check whether this app may write there.",
          "Хүсэлт Pictures/cat.png гэсэн байршлыг заана. OS энэ апп тэнд бичих эрхтэй эсэхийг шалгана.",
        ),
        nodes: [
          drawingApp(),
          n("os", "software", "OS: file access", "OS: файлд хандах", {
            tone: "active",
            status: w(
              "Access not checked yet",
              "Хандах эрхийг хараахан шалгаагүй",
            ),
          }),
          storedCat(false),
        ],
        relations: [
          {
            from: "drawing-app",
            to: "os",
            kind: "request",
            label: w("Write Pictures/cat.png", "Pictures/cat.png-ийг бичих"),
          },
        ],
        actions: [
          a(
            "check-access",
            "Check an allowed location",
            "Зөвшөөрсөн байрлалыг шалгах",
            "checked",
          ),
          a(
            "deny-access",
            "Try a blocked location",
            "Хориглосон байрлалыг турших",
            "denied",
          ),
        ],
      },
      {
        id: "checked",
        title: w("This location allows the write", "Энэ байрлалд бичиж болно"),
        description: w(
          "The access check passed. The OS uses storage-driver software to work with the storage device. The next step shows the completed save.",
          "Эрхийн шалгалт амжилттай. OS storage төхөөрөмжтэй харилцахдаа driver программ ашиглана. Дараагийн алхамд хадгалж дууссан үр дүнг харуулна.",
        ),
        nodes: [
          drawingApp(),
          n(
            "os",
            "software",
            "OS: file access and driver",
            "OS: файлын эрх ба driver",
            {
              tone: "active",
              status: w("Write allowed", "Бичихийг зөвшөөрсөн"),
            },
          ),
          storedCat(false),
        ],
        actions: [
          a("write-file", "Complete the save", "Хадгалж дуусгах", "saved"),
        ],
      },
      {
        id: "saved",
        title: w(
          "The saved file is in storage",
          "Хадгалсан файл storage-д байна",
        ),
        description: w(
          "Pictures/cat.png is now saved. Pictures is a folder that organizes the file, not a separate hardware device.",
          "Pictures/cat.png хадгалагдлаа. Pictures бол файлыг зохион байгуулах хавтас. Тусдаа hardware төхөөрөмж биш.",
        ),
        nodes: [
          drawingApp(),
          n(
            "os",
            "software",
            "OS: file access and driver",
            "OS: файлын эрх ба driver",
            { status: w("Save completed", "Хадгалж дууссан") },
          ),
          {
            ...storedCat(true),
            detail: w("Pictures/cat.png", "Pictures/cat.png"),
          },
        ],
        actions: [reset("ready")],
      },
      {
        id: "denied",
        title: w("The file was not written", "Файлыг бичээгүй"),
        description: w(
          "This example location refuses the write. The drawing remains in the app; no saved cat was added to storage.",
          "Энэ жишээний байрлалд бичихийг хориглосон. Зураг апп дотор хэвээр. Storage-д хадгалсан муур нэмэгдээгүй.",
        ),
        nodes: [
          drawingApp(),
          n("os", "software", "OS: file access", "OS: файлд хандах", {
            tone: "blocked",
            status: w("Write denied", "Бичихийг хориглосон"),
          }),
          storedCat(false),
        ],
        actions: [
          a(
            "choose-location",
            "Choose another location",
            "Өөр байрлал сонгох",
            "ready",
          ),
        ],
      },
    ],
  },
  {
    chapter: 5,
    title: w("Interfaces are software too", "Interface ч бас программ"),
    summary: w(
      "A window and typed commands offer different ways to ask for work. The kernel manages resources underneath both.",
      "Цонх болон бичсэн command нь ажил хүсэх өөр өөр арга. Kernel хоёулангийнх нь цаана нөөцийг зохицуулна.",
    ),
    initial: "desktop",
    states: [
      {
        id: "desktop",
        title: w("Click to see a folder", "Хавтсыг дарж нээх"),
        description: w(
          "The Files app shows names in Documents. The desktop is part of the software you see, not the whole operating system.",
          "Files апп Documents доторх нэрсийг харуулна. Desktop нь чиний харж буй программын нэг хэсэг. Operating system бүхэлдээ биш.",
        ),
        nodes: [
          n("files", "app", "Files window", "Files-ийн цонх", {
            content: "names",
            ink: w(documentNames, documentNames),
            detail: w("Names in Documents", "Documents доторх нэрс"),
          }),
          n("shell", "terminal", "Terminal and shell", "Terminal ба shell", {
            tone: "muted",
            detail: w("Another way to ask", "Хүсэлт өгөх өөр арга"),
          }),
          n("kernel", "software", "Kernel", "Kernel", {
            detail: w("Helps manage resources", "Нөөцийг зохицуулна"),
          }),
        ],
        actions: [
          a("type-command", "Try a command", "Command турших", "terminal"),
          a(
            "show-kernel",
            "What does the kernel do?",
            "Kernel юу хийдэг вэ?",
            "kernel",
          ),
        ],
      },
      {
        id: "terminal",
        title: w(
          "Type to ask for the same names",
          "Ижил нэрсийг харахын тулд command бичих",
        ),
        description: w(
          "Terminal displays your text and results. The shell reads the command and starts the requested work. ls lists names; it does not read the note's text.",
          "Terminal бичсэн command болон үр дүнг харуулна. Shell command-ыг уншаад хүссэн ажлыг эхлүүлнэ. ls нэрсийг жагсаана. Тэмдэглэлийн бичвэрийг уншихгүй.",
        ),
        nodes: [
          n("files", "app", "Files window", "Files-ийн цонх", {
            content: "names",
            ink: w(documentNames, documentNames),
            detail: w("Names in Documents", "Documents доторх нэрс"),
          }),
          n("shell", "terminal", "Terminal and shell", "Terminal ба shell", {
            content: "names",
            tone: "active",
            ink: w(
              `$ ls /home/student/Documents\n${documentNames}`,
              `$ ls /home/student/Documents\n${documentNames}`,
            ),
            detail: w(
              "The command lists names in Documents.",
              "Command Documents доторх нэрсийг жагсаана.",
            ),
          }),
          n("kernel", "software", "Kernel", "Kernel", {
            detail: w("Helps manage resources", "Нөөцийг зохицуулна"),
          }),
        ],
        actions: [
          a("click-folder", "Use the window", "Цонхоор үзэх", "desktop"),
          a(
            "show-kernel",
            "What does the kernel do?",
            "Kernel юу хийдэг вэ?",
            "kernel",
          ),
        ],
      },
      {
        id: "kernel",
        title: w(
          "The kernel helps share resources",
          "Kernel нөөцийг хуваарилахад тусална",
        ),
        description: w(
          "CPU time, RAM, and access to devices are resources. The kernel is software; the CPU, RAM, and storage are physical parts.",
          "CPU-ийн цаг, RAM, төхөөрөмжид хандах боломж нь нөөц юм. Kernel бол программ. CPU, RAM, storage бол бодит эд анги.",
        ),
        nodes: [
          n("kernel", "software", "Kernel", "Kernel", {
            tone: "active",
            detail: w(
              "CPU time · memory · device access",
              "CPU-ийн цаг · memory · төхөөрөмжийн эрх",
            ),
          }),
          n("cpu", "cpu", "CPU", "CPU"),
          n("ram", "ram", "RAM", "RAM"),
          n("storage", "storage", "Storage", "Storage"),
        ],
        actions: [
          a("click-folder", "Use the window", "Цонхоор үзэх", "desktop"),
          a("type-command", "Try a command", "Command турших", "terminal"),
        ],
      },
    ],
  },
  {
    chapter: 6,
    title: w("Different systems, similar jobs", "Өөр өөр систем, төстэй ажил"),
    summary: w(
      "All three examples can help you run apps and save files. Fedora is our learning example, not a score for every computer.",
      "Эдгээр гурван систем апп ажиллуулж, файл хадгалахад тусална. Fedora бол хичээлийн жишээ. Бүх компьютерт өгөх үнэлгээ биш.",
    ),
    initial: "fedora",
    states: [
      {
        id: "windows",
        title: w("Windows is from Microsoft", "Windows-ийг Microsoft бүтээдэг"),
        description: w(
          "Windows is an operating system. Its controls and available apps can differ from the other examples.",
          "Windows бол operating system. Удирдлага, ашиглаж болох аппууд нь бусад жишээнээс өөр байж болно.",
        ),
        nodes: [
          n("system", "software", "Windows", "Windows", {
            tone: "active",
            detail: w(
              "Operating system · Microsoft",
              "Operating system · Microsoft",
            ),
          }),
          drawingApp(),
          storedCat(true),
        ],
        actions: choose(familyActions, "windows"),
      },
      {
        id: "macos",
        title: w(
          "macOS is for Mac computers",
          "macOS нь Mac компьютерт зориулагдсан",
        ),
        description: w(
          "Apple makes macOS. It is a separate operating system, not a Linux distribution.",
          "Apple macOS-ийг бүтээдэг. Энэ нь тусдаа operating system. Linux distribution биш.",
        ),
        nodes: [
          n("system", "software", "macOS", "macOS", {
            tone: "active",
            detail: w("Operating system · Apple", "Operating system · Apple"),
          }),
          drawingApp(),
          storedCat(true),
        ],
        actions: choose(familyActions, "macos"),
      },
      {
        id: "fedora",
        title: w(
          "Fedora is a Linux distribution",
          "Fedora бол Linux distribution",
        ),
        description: w(
          "Fedora brings the Linux kernel together with other software. Ubuntu is another Linux distribution. We use Fedora to explore this lesson.",
          "Fedora нь Linux kernel-ийг бусад программтай нэгтгэдэг. Ubuntu ч бас Linux distribution. Энэ хичээлд Fedora-г жишээ болгосон.",
        ),
        nodes: [
          n("system", "software", "Fedora", "Fedora", {
            tone: "active",
            detail: w(
              "Linux distribution · our example",
              "Linux distribution · бидний жишээ",
            ),
          }),
          drawingApp(),
          storedCat(true),
        ],
        actions: choose(familyActions, "fedora"),
      },
    ],
  },
  {
    chapter: 7,
    title: w(
      "Fedora includes these software parts",
      "Fedora эдгээр программыг нэгтгэнэ",
    ),
    summary: w(
      "The boundary means these pieces belong to the distribution. It is not a route for moving data.",
      "Хүрээ нь эдгээр хэсэг distribution-д багтахыг заана. Мэдээлэл дамжих зам биш.",
    ),
    initial: "overview",
    states: [
      {
        id: "overview",
        title: w(
          "Fedora Workstation is the collection",
          "Fedora Workstation бол нэгтгэсэн систем",
        ),
        description: w(
          "Linux is its kernel. GNOME is its desktop. Apps and tools do the jobs you need. These are software, not stacked hardware boards.",
          "Linux нь kernel. GNOME нь desktop. Апп, хэрэгслүүд чамд хэрэгтэй ажлыг хийнэ. Эдгээр нь программ болохоос давхарласан hardware хавтан биш.",
        ),
        container: w(
          "Fedora Workstation: software collection",
          "Fedora Workstation: нэгтгэсэн программ",
        ),
        nodes: distroNodes("overview"),
        actions: choose(distroActions, "overview"),
      },
      {
        id: "linux",
        title: w("Linux is the kernel", "Linux бол kernel"),
        description: w(
          "The kernel helps share CPU time, manage RAM, and control access to devices. Linux alone is not the whole Fedora desktop.",
          "Kernel CPU-ийн цагийг хуваарилж, RAM болон төхөөрөмжид хандах эрхийг удирдана. Linux дангаараа Fedora desktop бүхэлдээ биш.",
        ),
        container: w(
          "Fedora Workstation: software collection",
          "Fedora Workstation: нэгтгэсэн программ",
        ),
        nodes: distroNodes("linux"),
        actions: choose(distroActions, "linux"),
      },
      {
        id: "gnome",
        title: w(
          "GNOME is the desktop environment",
          "GNOME бол desktop environment",
        ),
        description: w(
          "GNOME provides the desktop's windows, menus, and controls. Fedora Workstation uses GNOME; other Fedora editions can use other desktops.",
          "GNOME desktop-ийн цонх, цэс, удирдлагыг өгнө. Fedora Workstation GNOME ашигладаг. Бусад Fedora хувилбар өөр desktop ашиглаж болно.",
        ),
        container: w(
          "Fedora Workstation: software collection",
          "Fedora Workstation: нэгтгэсэн программ",
        ),
        nodes: distroNodes("gnome"),
        actions: choose(distroActions, "gnome"),
      },
      {
        id: "apps",
        title: w(
          "Apps and tools do useful jobs",
          "Апп, хэрэгслүүд ажлыг гүйцэтгэнэ",
        ),
        description: w(
          "A drawing app helps make pictures. Other tools help manage files and the system. A distribution brings many pieces together.",
          "Зургийн апп зураг хийхэд тусална. Бусад хэрэгсэл файл, системийг удирдана. Distribution олон хэсгийг нэгтгэдэг.",
        ),
        container: w(
          "Fedora Workstation: software collection",
          "Fedora Workstation: нэгтгэсэн программ",
        ),
        nodes: distroNodes("apps"),
        actions: choose(distroActions, "apps"),
      },
    ],
  },
  {
    chapter: 8,
    title: w(
      "Read, change, and share source code",
      "Source code-ыг уншиж, өөрчилж, хуваалцах",
    ),
    summary: w(
      "A license sets the rules for using and sharing code. This is a made-up instruction example, not real drawing-app code.",
      "License code ашиглах, хуваалцах дүрмийг тогтооно. Энд зохиомол заавар үзүүлсэн. Жинхэнэ зургийн аппын code биш.",
    ),
    initial: "closed",
    states: [
      {
        id: "closed",
        title: w("You can see the result", "Чи үр дүнг харж байна"),
        description: w(
          "Seeing a picture does not tell you all the instructions that made it. Open the example source to look inside.",
          "Зургийг хараад түүнийг бүтээсэн бүх зааврыг мэдэхгүй. Жишээ source code-ыг нээгээд доторхыг хар.",
        ),
        nodes: [
          n("source", "code", "Example source code", "Жишээ source code", {
            status: w("Not opened yet", "Хараахан нээгээгүй"),
          }),
          n("result", "app", "Drawing result", "Зургийн үр дүн", {
            content: "drawing",
          }),
          n(
            "shared-source",
            "code",
            "Shared code copy",
            "Хуваалцсан code-ын хуулбар",
            {
              tone: "muted",
              status: w("No copy shared", "Хуулбар хуваалцаагүй"),
            },
          ),
        ],
        actions: [
          a("read-code", "Read the instructions", "Зааврыг унших", "read"),
        ],
      },
      {
        id: "read",
        title: w("The instructions are readable", "Зааврыг уншиж болно"),
        description: w(
          "Here the example says to draw a cat. Open-source licenses let people study code and allow changes and sharing under their terms.",
          "Энэ жишээний заавар муур зур гэж байна. Open-source license хүмүүсийг code судлах, нөхцөлийнх нь дагуу өөрчлөх, хуваалцахыг зөвшөөрдөг.",
        ),
        nodes: [
          n("source", "code", "Example source code", "Жишээ source code", {
            content: "code",
            tone: "active",
            ink: w("draw(cat)", "draw(cat)"),
            detail: w(
              "Example instruction: draw a cat.",
              "Жишээ заавар: муур зур.",
            ),
          }),
          n("result", "app", "Drawing result", "Зургийн үр дүн", {
            content: "drawing",
            status: w("A cat drawing", "Муурын зураг"),
          }),
          n(
            "shared-source",
            "code",
            "Shared code copy",
            "Хуваалцсан code-ын хуулбар",
            {
              tone: "muted",
              status: w("No copy shared", "Хуулбар хуваалцаагүй"),
            },
          ),
        ],
        actions: [
          a(
            "change-code",
            "Try a different instruction",
            "Өөр заавар турших",
            "changed",
          ),
          reset("closed"),
        ],
      },
      {
        id: "changed",
        title: w(
          "Changing the instruction changes the example",
          "Зааврыг өөрчлөхөд жишээний үр дүн өөрчлөгдөнө",
        ),
        description: w(
          "The new pretend instruction displays the word cat instead of drawing it. Real changes must be tested; open code can still have bugs.",
          "Шинэ зохиомол заавар муур зурахын оронд cat гэсэн үгийг харуулна. Жинхэнэ өөрчлөлтийг шалгах хэрэгтэй. Нээлттэй code ч алдаатай байж болно.",
        ),
        nodes: [
          n("source", "code", "Example source code", "Жишээ source code", {
            content: "code",
            tone: "active",
            ink: w('write("cat")', 'write("cat")'),
            detail: w(
              "Example instruction: display a word.",
              "Жишээ заавар: үг харуул.",
            ),
          }),
          n("result", "app", "Text result", "Бичвэрийн үр дүн", {
            content: "text",
            ink: w("cat", "cat"),
          }),
          n(
            "shared-source",
            "code",
            "Shared code copy",
            "Хуваалцсан code-ын хуулбар",
            {
              tone: "muted",
              status: w("No copy shared", "Хуулбар хуваалцаагүй"),
            },
          ),
        ],
        actions: [
          a(
            "share-code",
            "Share under the license",
            "License-ийн дагуу хуваалцах",
            "shared",
          ),
          reset("closed"),
        ],
      },
      {
        id: "shared",
        title: w(
          "A copy of the changed code is shared",
          "Өөрчилсөн code-ын хуулбарыг хуваалцлаа",
        ),
        description: w(
          "The original code stays here. Someone else can receive a copy under its license. This illustrates sharing; it sends nothing over the network.",
          "Эх code эндээ үлдэнэ. Өөр хүн license-ийн нөхцөлийн дагуу хуулбар авч болно. Энэ нь хуваалцахыг харуулсан жишээ. Network-оор юу ч илгээхгүй.",
        ),
        nodes: [
          n("source", "code", "Example source code", "Жишээ source code", {
            content: "code",
            ink: w('write("cat")', 'write("cat")'),
            detail: w(
              "Example instruction: display a word.",
              "Жишээ заавар: үг харуул.",
            ),
          }),
          n("result", "app", "Text result", "Бичвэрийн үр дүн", {
            content: "text",
            ink: w("cat", "cat"),
          }),
          n(
            "shared-source",
            "code",
            "Shared code copy",
            "Хуваалцсан code-ын хуулбар",
            {
              content: "code",
              tone: "active",
              ink: w('write("cat")', 'write("cat")'),
              detail: w(
                "License terms apply to the shared copy.",
                "Хуваалцсан хуулбарт license-ийн нөхцөл үйлчилнэ.",
              ),
            },
          ),
        ],
        relations: [
          {
            from: "source",
            to: "shared-source",
            kind: "copy",
            label: w(
              "Copy shared under the license",
              "License-ийн дагуу хуулбар хуваалцсан",
            ),
          },
        ],
        actions: [reset("closed")],
      },
    ],
  },
  {
    chapter: 9,
    title: w(
      "Why we chose Fedora for learning",
      "Суралцахдаа Fedora-г сонгосон шалтгаан",
    ),
    summary: w(
      "We like its desktop and open software. Protections help, but updates and compatibility checks still matter.",
      "Бид desktop болон нээлттэй программыг нь судлах дуртай. Хамгаалалт тусална. Шинэчлэлт, нийцлийг шалгах хэрэгтэй хэвээр.",
    ),
    initial: "desktop",
    states: [
      {
        id: "desktop",
        title: w("Start with familiar windows", "Танил цонхноос эхэл"),
        description: w(
          "Fedora Workstation has the GNOME desktop. You can explore folders with a mouse before learning commands. It is free to use and its desktop has no built-in ads.",
          "Fedora Workstation GNOME desktop-той. Command сурахаасаа өмнө хулганаар хавтас нээж болно. Үнэгүй ашиглаж болно. Desktop-д суурилуулсан зар байхгүй.",
        ),
        nodes: [
          n("desktop", "desktop", "GNOME desktop", "GNOME desktop", {
            content: "names",
            tone: "active",
          }),
          n("source", "code", "Open software", "Нээлттэй программ", {
            content: "code",
          }),
          n("rules", "shield", "SELinux rules", "SELinux дүрмүүд", {
            detail: w(
              "Limits for certain programs",
              "Зарим программд тавих хязгаар",
            ),
          }),
        ],
        actions: [
          a("show-open", "Study the software", "Программыг судлах", "open"),
          a(
            "show-rule",
            "See an example rule",
            "Дүрмийн жишээ харах",
            "selinux",
          ),
        ],
      },
      {
        id: "open",
        title: w("There is software to study", "Судалж болох программ бий"),
        description: w(
          "Open source lets people inspect and improve software under its license. Check that your games, school apps, and devices work before switching a real computer.",
          "Open source программыг license-ийн дагуу судалж, сайжруулж болно. Жинхэнэ компьютерээ солихоос өмнө тоглоом, сургуулийн апп, төхөөрөмжөө шалга.",
        ),
        nodes: [
          n("desktop", "desktop", "GNOME desktop", "GNOME desktop", {
            content: "names",
          }),
          n("source", "code", "Open software", "Нээлттэй программ", {
            content: "code",
            tone: "active",
          }),
          n("rules", "shield", "SELinux rules", "SELinux дүрмүүд", {
            detail: w(
              "Protection is not a guarantee",
              "Хамгаалалт нь баталгаа биш",
            ),
          }),
        ],
        actions: [
          a(
            "show-desktop",
            "Explore the desktop",
            "Desktop-ийг үзэх",
            "desktop",
          ),
          a(
            "show-rule",
            "See an example rule",
            "Дүрмийн жишээ харах",
            "selinux",
          ),
        ],
      },
      {
        id: "selinux",
        title: w(
          "An example program has limits",
          "Жишээ программд хязгаар бий",
        ),
        description: w(
          "In this made-up policy, a confined program can read its work folder but cannot read the other folder. SELinux rules depend on the program and policy; this is not every app's exact access.",
          "Энэ зохиомол policy-д хязгаарласан программ ажлын хавтсаа уншиж болно. Нөгөө хавтсыг уншиж болохгүй. SELinux-ийн дүрэм программ, policy-оос хамаарна. Апп бүр яг ийм эрхтэй гэсэн үг биш.",
        ),
        nodes: [
          n(
            "confined-program",
            "process",
            "Confined program",
            "Хязгаарласан программ",
            { tone: "active" },
          ),
          n("work-folder", "folder", "Work folder", "Ажлын хавтас", {
            content: "text",
            status: w("Read allowed", "Уншихыг зөвшөөрсөн"),
          }),
          n("other-folder", "folder", "Other folder", "Өөр хавтас", {
            content: "text",
            tone: "blocked",
            status: w("Read denied by rule", "Дүрмээр уншихыг хориглосон"),
          }),
        ],
        relations: [
          {
            from: "confined-program",
            to: "work-folder",
            kind: "access",
            label: w("May read", "Уншиж болно"),
          },
        ],
        actions: [
          a(
            "show-desktop",
            "Explore the desktop",
            "Desktop-ийг үзэх",
            "desktop",
          ),
          a("show-open", "Study the software", "Программыг судлах", "open"),
        ],
      },
    ],
  },
  {
    chapter: 10,
    title: w(
      "Does this app need your contacts?",
      "Энэ аппад contacts хэрэгтэй юу?",
    ),
    summary: w(
      "This is a pretend permission request. Some apps already have access without a new prompt, so check the app's source too.",
      "Энэ бол permission хүсэх жишээ. Зарим апп дахин асуухгүйгээр хандах эрхтэй байдаг. Аппын эх сурвалжийг бас шалга.",
    ),
    initial: "pending",
    states: [
      {
        id: "pending",
        title: w(
          "Pause before choosing Allow",
          "Allow дарахаасаа өмнө түр бод",
        ),
        description: w(
          "A drawing app asks to read your saved contacts. Drawing a cat usually does not need other people's names and details.",
          "Зургийн апп хадгалсан contacts-ыг чинь уншихыг хүсэв. Муур зурахад бусдын нэр, холбоо барих мэдээлэл ихэнхдээ хэрэггүй.",
        ),
        nodes: permissionNodes("pending"),
        actions: [
          a("allow", "Allow", "Зөвшөөрөх", "allowed"),
          a("deny", "Don't allow", "Зөвшөөрөхгүй", "denied"),
        ],
      },
      {
        id: "allowed",
        title: w(
          "The app now has access in this example",
          "Энэ жишээнд апп хандах эрхтэй боллоо",
        ),
        description: w(
          "Allow grants access to read the contacts. Permission is not itself an upload. Find out why the app needs this access before granting it on a real computer.",
          "Allow нь contacts-ыг унших эрх өгнө. Permission өгөх нь өөрөө upload хийх үйлдэл биш. Жинхэнэ компьютер дээр зөвшөөрөхөөс өмнө аппад яагаад энэ эрх хэрэгтэйг мэдэж ав.",
        ),
        nodes: permissionNodes("allowed"),
        relations: [
          {
            from: "drawing-app",
            to: "contacts",
            kind: "access",
            label: w("May read contacts", "Contacts-ыг уншиж болно"),
          },
        ],
        actions: [reset("pending")],
      },
      {
        id: "denied",
        title: w(
          "Contacts access was refused",
          "Contacts-д хандахыг зөвшөөрөөгүй",
        ),
        description: w(
          "The app did not receive contacts access in this example. The drawing and your contacts remain in place. Ask why it requested access, or choose another app.",
          "Энэ жишээнд апп contacts-д хандах эрх аваагүй. Зураг болон contacts хэвээрээ байна. Яагаад эрх хүссэнийг мэдэж ав, эсвэл өөр апп сонго.",
        ),
        nodes: permissionNodes("denied"),
        actions: [reset("pending")],
      },
    ],
  },
  {
    chapter: 11,
    title: w(
      "Ask about security and privacy",
      "Security болон privacy-г хоёуланг асуу",
    ),
    summary: w(
      "These are two questions about the same information. Protecting an account does not decide how a service uses its data.",
      "Эдгээр нь нэг мэдээллийн тухай хоёр асуулт. Бүртгэлийг хамгаалах нь үйлчилгээ мэдээллийг яаж ашиглахыг шийдэхгүй.",
    ),
    initial: "security",
    states: [
      {
        id: "security",
        title: w(
          "Can unwanted access or harm be prevented?",
          "Зөвшөөрөлгүй хандалт, гэмтлээс хамгаалж чадах уу?",
        ),
        description: w(
          "Security helps protect files, accounts, and the system. A protection symbol is not a promise that every download is safe.",
          "Security файл, бүртгэл, системийг хамгаалахад тусална. Хамгаалалтын тэмдэг нь татсан зүйл бүр аюулгүй гэсэн баталгаа биш.",
        ),
        nodes: [
          n("picture", "image-file", "cat.png", "cat.png", {
            content: "drawing",
          }),
          n(
            "protection",
            "shield",
            "Security question",
            "Security-ийн асуулт",
            {
              tone: "active",
              detail: w(
                "Unwanted access or changes?",
                "Зөвшөөрөлгүй хандах, өөрчлөх үү?",
              ),
            },
          ),
          n("recipient", "person", "Privacy question", "Privacy-ийн асуулт", {
            detail: w(
              "Who receives information, and how is it used?",
              "Мэдээллийг хэн авч, яаж ашиглах вэ?",
            ),
          }),
        ],
        actions: [
          a(
            "ask-privacy",
            "Ask the privacy question",
            "Privacy-ийн асуултыг харах",
            "privacy",
          ),
        ],
      },
      {
        id: "privacy",
        title: w(
          "Who gets information, and how is it used?",
          "Мэдээллийг хэн авч, яаж ашиглах вэ?",
        ),
        description: w(
          "A service could protect your password and still use activity to choose ads. Security and privacy both matter; choosing a recipient does not control everything they do later.",
          "Үйлчилгээ password-ыг чинь хамгаалсан ч үйлдлийг чинь ашиглан зар сонгож болно. Security, privacy хоёул чухал. Хүлээн авагчийг сонгосноор цаашдын бүх хэрэглээг нь хянахгүй.",
        ),
        nodes: [
          n("picture", "image-file", "cat.png", "cat.png", {
            content: "drawing",
          }),
          n(
            "protection",
            "shield",
            "Security question",
            "Security-ийн асуулт",
            {
              detail: w(
                "Unwanted access or changes?",
                "Зөвшөөрөлгүй хандах, өөрчлөх үү?",
              ),
            },
          ),
          n("recipient", "person", "Privacy question", "Privacy-ийн асуулт", {
            tone: "active",
            detail: w(
              "What is collected? Who gets it? What do they do with it?",
              "Юу цуглуулах вэ? Хэн авах вэ? Яаж ашиглах вэ?",
            ),
          }),
        ],
        actions: [
          a(
            "ask-security",
            "Ask the security question",
            "Security-ийн асуултыг харах",
            "security",
          ),
        ],
      },
    ],
  },
  {
    chapter: 12,
    title: w("Choose one example message", "Мэдээллийн нэг жишээг сонго"),
    summary: w(
      "These examples show different contents and recipients. They do not send real data or show what your computer is sending.",
      "Эдгээр жишээ өөр өөр агуулга, хүлээн авагчтай. Жинхэнэ мэдээлэл илгээхгүй. Чиний компьютер юу илгээж байгааг хэмжихгүй.",
    ),
    initial: "choose",
    states: [
      {
        id: "choose",
        title: w(
          "What might be sent, and why?",
          "Юу, ямар зорилгоор илгээгдэж болох вэ?",
        ),
        description: w(
          "Select an update check, a diagnostic report, or an upload. Compare what information is sent and who receives it.",
          "Шинэчлэлт шалгах, diagnostic report эсвэл upload-аас сонго. Ямар мэдээлэл илгээж, хэн хүлээн авахыг харьцуул.",
        ),
        nodes: [
          n(
            "update-checker",
            "software",
            "Update checker",
            "Шинэчлэлт шалгах программ",
          ),
          n(
            "crash-reporter",
            "software",
            "Crash reporter",
            "Crash report-ийн программ",
          ),
          n("browser", "app", "Browser", "Browser"),
        ],
        actions: messageActions,
      },
      {
        id: "update",
        title: w(
          "An update check can include a system version",
          "Шинэчлэлт шалгахад системийн хувилбар орж болно",
        ),
        description: w(
          "In this example, version details help an update server offer the right update. Ask what is sent, who receives it, and why.",
          "Энэ жишээнд хувилбарын мэдээлэл update server-т тохирох шинэчлэлт санал болгоход тусална. Юу, хэнд, яагаад илгээхийг асуу.",
        ),
        nodes: [
          n(
            "update-checker",
            "software",
            "Update checker",
            "Шинэчлэлт шалгах программ",
            {
              content: "text",
              ink: updatePayload,
              status: w("Example payload", "Жишээ мэдээлэл"),
              detail: w(
                "Example contents: system version",
                "Жишээ агуулга: системийн хувилбар",
              ),
            },
          ),
          n("update-server", "server", "Update server", "Шинэчлэлтийн server", {
            content: "text",
            ink: updatePayload,
            status: w("Example payload", "Жишээ мэдээлэл"),
            detail: w(
              "Purpose: find a suitable update",
              "Зорилго: тохирох шинэчлэлтийг олох",
            ),
          }),
        ],
        relations: [
          {
            from: "update-checker",
            to: "update-server",
            kind: "request",
            label: w("Example update request", "Шинэчлэлт хүсэх жишээ"),
          },
        ],
        actions: [...choose(messageActions, "update"), reset("choose")],
      },
      {
        id: "diagnostic",
        title: w(
          "A report can describe an error",
          "Тайлан алдааг тайлбарлаж болно",
        ),
        description: w(
          "This example shows error details shared with a report service. A crash does not always cause an upload. Reporting may be automatic or user-assisted depending on settings; reports can contain extra detail.",
          "Энэ жишээнд алдааны мэдээллийг тайлан хүлээн авах үйлчилгээнд өгсөн. Crash бүр upload үүсгэхгүй. Тохиргооноос хамаарч автоматаар эсвэл хэрэглэгчийн оролцоотой илгээнэ. Тайланд нэмэлт мэдээлэл орж болно.",
        ),
        nodes: [
          n(
            "crash-reporter",
            "software",
            "Crash reporter",
            "Crash report-ийн программ",
            {
              content: "text",
              ink: diagnosticPayload,
              status: w("Example payload", "Жишээ мэдээлэл"),
              detail: w(
                "Example contents: error details",
                "Жишээ агуулга: алдааны мэдээлэл",
              ),
            },
          ),
          n(
            "report-service",
            "server",
            "Report service",
            "Тайлан хүлээн авах үйлчилгээ",
            {
              content: "text",
              ink: diagnosticPayload,
              status: w("Example payload", "Жишээ мэдээлэл"),
              detail: w(
                "Purpose: investigate the problem",
                "Зорилго: асуудлыг судлах",
              ),
            },
          ),
        ],
        relations: [
          {
            from: "crash-reporter",
            to: "report-service",
            kind: "copy",
            label: w("Example of a shared report", "Илгээсэн тайлангийн жишээ"),
          },
        ],
        actions: [...choose(messageActions, "diagnostic"), reset("choose")],
      },
      {
        id: "upload",
        title: w(
          "A chosen upload gives a website a copy",
          "Сонгосон upload вэбсайтад хуулбар өгнө",
        ),
        description: w(
          "This example shows a picture someone chose to upload. The website receives the picture itself, not just a system version. Message size alone does not measure privacy.",
          "Энэ жишээнд хүн өөрөө upload хийхээр сонгосон зураг байна. Вэбсайт системийн хувилбар биш, зургийг өөрийг нь авна. Мэдээллийн хэмжээ дангаараа privacy-г хэмжихгүй.",
        ),
        nodes: [
          n(
            "local-picture",
            "image-file",
            "Local cat.png",
            "Компьютерт буй cat.png",
            { content: "drawing" },
          ),
          n("website", "server", "Class website", "Ангийн вэбсайт", {
            content: "drawing",
            status: w("Has the uploaded copy", "Upload хийсэн хуулбарыг авсан"),
          }),
        ],
        relations: [
          {
            from: "local-picture",
            to: "website",
            kind: "copy",
            label: w("Example chosen upload", "Өөрөө сонгосон upload-ын жишээ"),
          },
        ],
        actions: [...choose(messageActions, "upload"), reset("choose")],
      },
    ],
  },
  {
    chapter: 13,
    title: w("Reporting categories and choices", "Тайлангийн төрөл ба сонголт"),
    summary: w(
      "These are reporting examples, not data-volume or safety scores. The controls only change this illustration, not your device's settings.",
      "Эдгээр нь тайлангийн жишээ. Мэдээллийн хэмжээ, аюулгүй байдлын оноо биш. Товчнууд зөвхөн энэ жишээг өөрчилнө. Төхөөрөмжийн чинь тохиргоог өөрчлөхгүй.",
    ),
    initial: "fedora",
    states: [
      {
        id: "windows",
        title: w(
          "Windows: optional reports off",
          "Windows: optional report унтраалттай",
        ),
        description: w(
          "On an ordinary Windows 11 home PC, required diagnostics still include device, settings, and reliability details. Turning optional reports off does not stop every connected service.",
          "Энгийн Windows 11 гэрийн PC-д төхөөрөмж, тохиргоо, ажиллагааны required diagnostics илгээгдсээр байна. Optional report-ийг унтраахад холбогдсон үйлчилгээ бүр зогсохгүй.",
        ),
        nodes: windowsReports(false),
        actions: [
          a(
            "enable-optional",
            "Show optional reports on",
            "Optional report асаасныг үзэх",
            "windows-optional",
          ),
          ...choose(reportActions, "windows"),
        ],
      },
      {
        id: "windows-optional",
        title: w(
          "Windows: extra optional reports",
          "Windows: нэмэлт optional report",
        ),
        description: w(
          "Optional diagnostics can add app activity, browsing details, and richer crash reports. Crash memory may contain parts of a file. Required diagnostics remain included.",
          "Optional diagnostics нь аппын хэрэглээ, browsing, crash-ийн дэлгэрэнгүй мэдээлэл нэмж болно. Crash memory-д файлын хэсэг орж болно. Required diagnostics мөн багтана.",
        ),
        nodes: windowsReports(true),
        actions: [
          a(
            "disable-optional",
            "Show optional reports off",
            "Optional report унтраасныг үзэх",
            "windows",
          ),
          ...reportActions.filter((action) => action.to !== "windows"),
        ],
      },
      {
        id: "macos",
        title: w(
          "macOS: analytics sharing off",
          "macOS: analytics илгээхийг унтраасан",
        ),
        description: w(
          "Apple says Mac analytics are shared with permission. The example has sharing off. iCloud uploads and other online services have separate controls.",
          "Apple-ийн тайлбараар Mac analytics зөвшөөрлөөр илгээгдэнэ. Энэ жишээнд илгээхийг унтраасан. iCloud upload болон бусад цахим үйлчилгээ тусдаа тохиргоотой.",
        ),
        nodes: macReports(false),
        actions: [
          a(
            "enable-analytics",
            "Show analytics permission given",
            "Analytics-ийн зөвшөөрөл өгснийг үзэх",
            "macos-opted-in",
          ),
          ...choose(reportActions, "macos"),
        ],
      },
      {
        id: "macos-opted-in",
        title: w(
          "macOS: analytics permission given",
          "macOS: analytics-ийн зөвшөөрөл өгсөн",
        ),
        description: w(
          "With permission, analytics can describe hardware, software, crashes, and feature use. Review System Settings → Privacy & Security → Analytics & Improvements.",
          "Зөвшөөрлөөр analytics нь hardware, software, crash, ашигласан боломжуудыг тайлбарлаж болно. System Settings → Privacy & Security → Analytics & Improvements хэсгээс шалгана.",
        ),
        nodes: macReports(true),
        actions: [
          a(
            "disable-analytics",
            "Show analytics sharing off",
            "Analytics илгээхийг унтраасныг үзэх",
            "macos",
          ),
          ...reportActions.filter((action) => action.to !== "macos"),
        ],
      },
      {
        id: "fedora",
        title: w(
          "Fedora: countme and separate reporting",
          "Fedora: countme ба тусдаа тайлан",
        ),
        description: w(
          "When enabled, countme adds an age-bucket flag to a normal update-metadata request about once a week per repository. It helps count systems, not cat pictures or every opened app. Servers can log IP addresses and times; Fedora publishes combined counts.",
          "Асаалттай үед countme repository тус бүрийн ердийн update metadata хүсэлтэд ойролцоогоор долоо хоногт нэг удаа суулгасан хугацааны бүлгийн тэмдэг нэмнэ. Системийг тоолоход тусална. Муурын зураг, нээсэн апп бүрийг илгээхгүй. Server IP address, цагийг бүртгэж болно. Fedora нэгтгэсэн тоог нийтэлдэг.",
        ),
        nodes: [
          n("system", "software", "Fedora", "Fedora"),
          n(
            "countme",
            "software",
            "Update request with countme",
            "countme-тэй update хүсэлт",
            {
              content: "text",
              detail: w(
                "Version and approximate installation age; not a separate constant upload.",
                "Хувилбар, суулгасан ойролцоо хугацаа; тусдаа тасралтгүй upload биш.",
              ),
            },
          ),
          n(
            "crash-reports",
            "software",
            "Crash reports and apps",
            "Crash report ба аппууд",
            {
              detail: w(
                "Separate settings and report contents. Check what you share.",
                "Тохиргоо, тайлангийн агуулга нь тусдаа. Юу хуваалцахаа шалга.",
              ),
            },
          ),
        ],
        actions: choose(reportActions, "fedora"),
      },
    ],
  },
  {
    chapter: 14,
    title: w(
      "An upload makes a remote copy",
      "Upload өөр компьютерт хуулбар өгнө",
    ),
    summary: w(
      "This example uses a local folder with automatic sync off and a signed-in class website. No real picture is uploaded.",
      "Энэ жишээнд автомат sync унтраалттай local folder, нэвтэрсэн ангийн вэбсайт ашиглана. Жинхэнэ зураг upload хийхгүй.",
    ),
    initial: "local",
    states: [
      {
        id: "local",
        title: w(
          "The website has no picture yet",
          "Вэбсайт зургийг хараахан аваагүй",
        ),
        description: w(
          "cat.png is saved on the computer. Saving in this local folder alone did not give the class website a copy.",
          "cat.png компьютерт хадгалагдсан. Зөвхөн энэ local folder-т хадгалахад ангийн вэбсайт хуулбар авахгүй.",
        ),
        nodes: [
          n(
            "local-picture",
            "image-file",
            "Local cat.png",
            "Компьютерт буй cat.png",
            {
              content: "drawing",
              detail: w("Sync is off", "Sync унтраалттай"),
            },
          ),
          n("website", "server", "Class website", "Ангийн вэбсайт", {
            status: w("No picture received", "Зураг аваагүй"),
          }),
          n(
            "account",
            "person",
            "Your website account",
            "Вэбсайт дахь бүртгэл",
            {
              status: w("Signed in for this example", "Энэ жишээнд нэвтэрсэн"),
            },
          ),
        ],
        actions: [
          a(
            "upload-copy",
            "Upload a copy",
            "Хуулбарыг upload хийх",
            "uploaded",
          ),
        ],
      },
      {
        id: "uploaded",
        title: w("Now there are two copies", "Одоо хоёр хуулбар бий"),
        description: w(
          "The local picture remains. The website received a copy and can link the upload to the signed-in account, including when the computer runs Fedora.",
          "Компьютерт буй зураг хэвээр. Вэбсайт хуулбар авсан бөгөөд upload-ыг нэвтэрсэн бүртгэлтэй холбож чадна. Компьютер Fedora ажиллуулж байсан ч адил.",
        ),
        nodes: [
          n(
            "local-picture",
            "image-file",
            "Local cat.png",
            "Компьютерт буй cat.png",
            { content: "drawing", status: w("Still here", "Эндээ хэвээр") },
          ),
          n("website", "server", "Class website", "Ангийн вэбсайт", {
            content: "drawing",
            tone: "active",
            status: w("Has a copy", "Хуулбарыг авсан"),
          }),
          n(
            "account",
            "person",
            "Your website account",
            "Вэбсайт дахь бүртгэл",
            {
              detail: w(
                "The site can link this upload to the account.",
                "Вэбсайт upload-ыг энэ бүртгэлтэй холбож чадна.",
              ),
            },
          ),
        ],
        relations: [
          {
            from: "local-picture",
            to: "website",
            kind: "copy",
            label: w("Copy uploaded", "Хуулбарыг upload хийсэн"),
          },
        ],
        actions: [reset("local")],
      },
    ],
  },
  {
    chapter: 15,
    title: w("Choose a habit to practise", "Дадал болгох зүйлээ сонго"),
    summary: w(
      "These examples explain helpful habits. Selecting one does not install updates, change permissions, or back up your real files.",
      "Эдгээр жишээ хэрэгтэй дадлыг тайлбарлана. Сонгоход жинхэнэ шинэчлэлт суулгахгүй, permission өөрчлөхгүй, файлд чинь backup хийхгүй.",
    ),
    initial: "updates",
    states: [
      {
        id: "updates",
        title: w("Install updates", "Шинэчлэлт суулга"),
        description: w(
          "Updates often fix mistakes, including security problems. Ask for help if an update is unfamiliar.",
          "Шинэчлэлт алдаа, түүний дотор security-ийн асуудлыг засах нь олон. Шинэчлэлт танил биш байвал тусламж ав.",
        ),
        nodes: [
          n("computer", "computer", "Your computer", "Чиний компьютер"),
          n("update", "package", "Software update", "Программын шинэчлэлт", {
            detail: w(
              "Fixes for installed software",
              "Суулгасан программын засвар",
            ),
          }),
        ],
        actions: choose(habitActions, "updates"),
      },
      {
        id: "sources",
        title: w("Check who provides an app", "Аппыг хэн нийлүүлснийг шалга"),
        description: w(
          "Use sources you trust. Two apps in one store may have different providers. A frightening pop-up is a reason to stop and ask, not hurry to install.",
          "Итгэдэг эх сурвалжаа ашигла. Нэг дэлгүүрийн хоёр апп өөр нийлүүлэгчтэй байж болно. Айдас төрүүлсэн pop-up гарвал яаран суулгахын оронд түр зогсоод асуу.",
        ),
        nodes: [
          n("computer", "computer", "Your computer", "Чиний компьютер"),
          n("package", "package", "App package", "Аппын package", {
            detail: w(
              "Check the source before installing",
              "Суулгахаас өмнө эх сурвалжийг шалга",
            ),
          }),
        ],
        actions: choose(habitActions, "sources"),
      },
      {
        id: "signins",
        title: w("Protect each account", "Бүртгэл бүрээ хамгаал"),
        description: w(
          "Use a different long password for each account. A password manager and a second sign-in step can help; ask a trusted adult to set them up.",
          "Бүртгэл бүрд өөр урт password ашигла. Password manager болон нэвтрэх хоёр дахь алхам тусална. Итгэдэг том хүнээс тохируулахад тусламж ав.",
        ),
        nodes: [
          n("account", "person", "Your account", "Чиний бүртгэл"),
          n("password", "key", "A different long password", "Өөр урт password"),
          n(
            "second-step",
            "shield",
            "Second sign-in step",
            "Нэвтрэх хоёр дахь алхам",
          ),
        ],
        actions: choose(habitActions, "signins"),
      },
      {
        id: "permissions",
        title: w("Give only the access needed", "Зөвхөн хэрэгтэй эрхийг өг"),
        description: w(
          "A video call may need the camera. An app doing a different job may not. Ask why before allowing camera, microphone, location, or file access.",
          "Видео дуудлагад camera хэрэгтэй байж болно. Өөр ажил хийдэг аппад хэрэггүй байж болно. Camera, microphone, location, файлд хандахыг зөвшөөрөхөөс өмнө яагаад гэдгийг асуу.",
        ),
        nodes: [
          n("app", "app", "An app's job", "Аппын хийх ажил"),
          n("access", "shield", "Permission to check", "Шалгах permission", {
            detail: w(
              "Does the job need this access?",
              "Энэ ажилд ийм эрх хэрэгтэй юу?",
            ),
          }),
        ],
        actions: choose(habitActions, "permissions"),
      },
      {
        id: "backup",
        title: w(
          "Keep a copy somewhere separate",
          "Хуулбарыг тусдаа газар хадгал",
        ),
        description: w(
          "Here the original is on the computer and a backup is on a separate drive. If the original is lost, the backup may help recover it.",
          "Энд эх файл компьютерт, backup нь тусдаа drive-д байна. Эх файл алдагдвал backup сэргээхэд тусалж болно.",
        ),
        nodes: [
          n(
            "original",
            "storage",
            "Computer's storage",
            "Компьютерийн storage",
            { content: "drawing", detail: w("Original cat.png", "Эх cat.png") },
          ),
          n(
            "backup",
            "storage",
            "Separate backup drive",
            "Тусдаа backup drive",
            {
              content: "drawing",
              tone: "active",
              detail: w(
                "Another saved copy of cat.png",
                "cat.png-ийн өөр хадгалсан хуулбар",
              ),
            },
          ),
        ],
        relations: [
          {
            from: "original",
            to: "backup",
            kind: "copy",
            label: w(
              "Backup copy stored separately",
              "Backup хуулбарыг тусад нь хадгалсан",
            ),
          },
        ],
        actions: choose(habitActions, "backup"),
      },
      {
        id: "help",
        title: w("Ask when something feels wrong", "Сэжигтэй санагдвал асуу"),
        description: w(
          "Tell a trusted adult about an accidental click or an unfamiliar request. The next step is to understand what happened and fix what you can.",
          "Санамсаргүй дарсан зүйл, танихгүй хүсэлтийн тухай итгэдэг том хүнд хэл. Дараа нь юу болсныг ойлгож, засаж болох зүйлээ засна.",
        ),
        nodes: [
          n("computer", "computer", "Your computer", "Чиний компьютер"),
          n("helper", "person", "Someone you trust", "Чиний итгэдэг хүн"),
        ],
        actions: choose(habitActions, "help"),
      },
    ],
  },
  {
    chapter: 16,
    title: w(
      "One text file, two ways to explore it",
      "Нэг text файлыг хоёр аргаар үзэх",
    ),
    summary: w(
      "These are opitlcalOS simulation files. Both languages use the same notes.txt here; its saved English text does not change when the lesson language changes.",
      "Эдгээр нь opitlcalOS загварын файлууд. Энд хоёр хэл хоёулаа ижил notes.txt ашиглана. Хичээлийн хэл солигдоход файлын хадгалсан English бичвэр өөрчлөгдөхгүй.",
    ),
    initial: "folder",
    states: [
      {
        id: "folder",
        title: w(
          "Files shows a folder's contents",
          "Files хавтас доторх зүйлсийг харуулна",
        ),
        description: w(
          "Open Documents and find notes.txt. A path tells you where a file is in the folder hierarchy. This file contains words, not a cat image.",
          "Documents-ийг нээгээд notes.txt-ийг ол. Path нь хавтаснуудын дунд файл хаана байгааг заана. Энэ файл муурын зураг биш, бичвэр агуулна.",
        ),
        nodes: [
          n("files", "app", "Files: Documents", "Files: Documents", {
            content: "names",
            tone: "active",
            ink: w(documentNames, documentNames),
            detail: w(
              "Names in the Documents folder",
              "Documents хавтас доторх нэрс",
            ),
          }),
          note(),
          n("terminal", "terminal", "Terminal", "Terminal", {
            status: w("No command run yet", "Command хараахан ажиллуулаагүй"),
          }),
        ],
        actions: choose(terminalActions, "folder"),
      },
      {
        id: "names",
        title: w("ls lists names", "ls нэрсийг жагсаана"),
        description: w(
          "ls /home/student/Documents lists the entries below. It does not show the words inside notes.txt, and it does not move the file.",
          "ls /home/student/Documents нь доорх нэрсийг жагсаана. notes.txt доторх бичвэрийг харуулахгүй. Файлыг зөөхгүй.",
        ),
        nodes: [
          n("files", "app", "Files: Documents", "Files: Documents", {
            content: "names",
            ink: w(documentNames, documentNames),
          }),
          note(),
          n(
            "terminal",
            "terminal",
            "Terminal: ls",
            "Terminal: ls",
            {
              content: "names",
              tone: "active",
              ink: w(documentNames, documentNames),
              detail: w("Names returned by ls", "ls-ийн харуулсан нэрс"),
            },
          ),
        ],
        actions: choose(terminalActions, "names"),
      },
      {
        id: "text",
        title: w("cat reads the saved text", "cat хадгалсан бичвэрийг уншина"),
        description: w(
          "cat /home/student/Documents/notes.txt prints the file's words. The excerpt below is shortened; the file remains unchanged. notes.mn.txt is a separate Mongolian note you can also open.",
          "cat /home/student/Documents/notes.txt файлын бичвэрийг харуулна. Доорх хэсгийг товчилсон. Файл өөрчлөгдөхгүй. notes.mn.txt нь бас нээж болох тусдаа Монгол тэмдэглэл.",
        ),
        nodes: [
          n("files", "app", "Files: Documents", "Files: Documents", {
            content: "names",
            ink: w(documentNames, documentNames),
          }),
          note(),
          n(
            "terminal",
            "terminal",
            "Terminal: cat",
            "Terminal: cat",
            {
              content: "text",
              tone: "active",
              status: w("Excerpt of the file", "Файлаас авсан хэсэг"),
              ink: w(noteExcerpt, noteExcerpt),
              detail: w(
                "Unchanged text read from notes.txt",
                "notes.txt-ээс уншсан өөрчлөгдөөгүй бичвэр",
              ),
            },
          ),
        ],
        relations: [
          {
            from: "terminal",
            to: "note",
            kind: "access",
            label: w(
              "Reads without changing the file",
              "Файлыг өөрчлөхгүйгээр уншина",
            ),
          },
        ],
        actions: choose(terminalActions, "text"),
      },
    ],
  },
  {
    chapter: 17,
    title: w(
      "Draw, save, then choose whether to share",
      "Зур, хадгал, дараа нь хуваалцах эсэхээ сонго",
    ),
    summary: w(
      "Each part has a job. The OS helps coordinate their use. Sharing is a separate choice after saving in this local example.",
      "Хэсэг бүр өөрийн ажилтай. OS тэдгээрийг ашиглахыг зохицуулна. Энэ local жишээнд хадгалсны дараа хуваалцах эсэхээ тусад нь сонгоно.",
    ),
    initial: "drawing",
    states: [
      {
        id: "drawing",
        title: w(
          "The app is working on the picture",
          "Апп зураг дээр ажиллаж байна",
        ),
        description: w(
          "CPU follows instructions, RAM holds working data, and the OS helps the app use resources. Saving is how we keep the finished picture for later.",
          "CPU зааврыг биелүүлнэ. RAM ажлын мэдээллийг байлгана. OS аппад нөөц ашиглахад тусална. Дууссан зургийг хадгалбал дараа дахин ашиглаж болно.",
        ),
        nodes: [
          drawingApp(),
          n("cpu", "cpu", "CPU", "CPU", {
            tone: "active",
            status: w("Follows instructions", "Зааврыг биелүүлнэ"),
          }),
          n("ram", "ram", "RAM", "RAM", {
            content: "work",
            status: w("Working data", "Ажлын мэдээлэл"),
          }),
          os(),
        ],
        actions: [a("save", "Save locally", "Компьютерт хадгалах", "saved")],
      },
      {
        id: "saved",
        title: w("The file is saved locally", "Файл компьютерт хадгалагдсан"),
        description: w(
          "Storage keeps cat.png. In this example sync is off, so saving has not given the website a picture. Linux can be the kernel; Fedora brings it together with other software.",
          "Storage cat.png-ийг хадгална. Энэ жишээнд sync унтраалттай. Хадгалах үед вэбсайт зураг аваагүй. Linux нь kernel байж болно. Fedora түүнийг бусад программтай нэгтгэнэ.",
        ),
        nodes: [
          os(),
          storedCat(true),
          n("website", "server", "Class website", "Ангийн вэбсайт", {
            status: w("No picture received", "Зураг аваагүй"),
          }),
        ],
        actions: [
          a("upload-copy", "Share a copy", "Хуулбарыг хуваалцах", "shared"),
          reset("drawing"),
        ],
      },
      {
        id: "shared",
        title: w(
          "The website now has a copy too",
          "Одоо вэбсайт ч бас хуулбартай",
        ),
        description: w(
          "The local file remains. Security helps protect it; privacy asks who receives information and how it is used. Fedora does not hide a signed-in account from its website.",
          "Компьютерт буй файл хэвээр. Security түүнийг хамгаалахад тусална. Privacy нь мэдээллийг хэн авч, яаж ашиглахыг асууна. Fedora вэбсайтаас нэвтэрсэн бүртгэлийг чинь нуухгүй.",
        ),
        nodes: [
          os(),
          storedCat(true),
          n("website", "server", "Class website", "Ангийн вэбсайт", {
            content: "drawing",
            tone: "active",
            status: w("Has the shared copy", "Хуваалцсан хуулбарыг авсан"),
          }),
        ],
        relations: [
          {
            from: "storage",
            to: "website",
            kind: "copy",
            label: w(
              "You chose to share a copy",
              "Чи хуулбар хуваалцахыг сонгосон",
            ),
          },
        ],
        actions: [reset("drawing")],
      },
    ],
  },
];
