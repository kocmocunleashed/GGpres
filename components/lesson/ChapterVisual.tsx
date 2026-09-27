"use client";

import { useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  Check,
  CheckCheck,
  ChevronRight,
  Code2,
  Cpu,
  Eye,
  FileImage,
  FileText,
  Folder,
  Globe2,
  HardDrive,
  KeyRound,
  LockKeyhole,
  MemoryStick,
  Monitor,
  Music2,
  Paintbrush,
  Play,
  Power,
  RotateCcw,
  ShieldCheck,
  Terminal,
  Upload,
  Users,
  X,
} from "lucide-react";
import "./chapter-visuals.css";

type Copy = (en: string, mn: string) => string;
type DemoApp = "files" | "terminal" | "system-monitor";
type VisualProps = { t: Copy };

export function CatDrawing({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`cv-cat ${className}`}
      viewBox="0 0 260 230"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M73 100 65 37 109 67C129 60 148 63 161 69L203 34 193 109C204 135 197 161 182 171 167 183 91 182 75 170 52 153 51 122 73 100Z"
        fill="currentColor"
      />
      <path
        d="m78 52 23 21-20 11Zm112 0-21 24 18 11Z"
        fill="var(--p-paper, #f2f1e8)"
        opacity=".5"
      />
      <path
        d="M92 120v10m67-10v10"
        stroke="var(--p-paper, #f2f1e8)"
        strokeWidth="8"
        strokeLinecap="round"
      />
      <path
        d="m119 139 10 8 10-8m-10 9c0 12-13 15-18 8m18-8c0 12 13 15 18 8"
        stroke="var(--p-paper, #f2f1e8)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m82 145-41-9m41 20-45 8m138-19 40-9m-40 20 43 9"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M97 174c-11 11-15 27-13 38h91c2-16-5-32-14-39m15 29c25 10 50-3 48-23-1-11-14-12-17-4"
        stroke="currentColor"
        strokeWidth="11"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Caption({ children }: { children: React.ReactNode }) {
  return <p className="cv-caption">{children}</p>;
}

function DrawingWindow({
  t,
  small = false,
}: VisualProps & { small?: boolean }) {
  return (
    <div className={`cv-drawing-window ${small ? "cv-drawing-small" : ""}`}>
      <div className="cv-window-bar">
        <span className="cv-window-dots" aria-hidden="true">
          ● ● ●
        </span>
        <span>{t("Drawing app", "Зураг зурах апп")}</span>
        <span>cat.png</span>
      </div>
      <div className="cv-drawing-area">
        <div
          className="cv-brushes"
          aria-label={t("Blue brush selected", "Цэнхэр бийр сонгосон")}
        >
          <Paintbrush size={18} />
          <i />
          <i />
          <i />
          <i />
        </div>
        <CatDrawing />
        <span className="cv-drawing-signature">cat.png</span>
      </div>
    </div>
  );
}

function TheCat({ t }: VisualProps) {
  const [saved, setSaved] = useState(false);
  return (
    <div className="cv-intro">
      <div className="cv-intro-note">
        <span>01</span>
        {t(
          "One drawing. Lots of teamwork.",
          "Нэг зураг. Олон хэсгийн хамтын ажил.",
        )}
      </div>
      <DrawingWindow t={t} />
      <div className="cv-intro-under">
        <div className="cv-mini-route">
          <span>{t("App", "Апп")}</span>
          <ArrowRight />
          <strong>OS</strong>
          <ArrowRight />
          <span>{t("Computer", "Компьютер")}</span>
        </div>
        <button
          className="cv-button cv-button-blue"
          onClick={() => setSaved(!saved)}
        >
          {saved ? <Check size={17} /> : <FileImage size={17} />}
          {saved
            ? t("Saved!", "Хадгаллаа!")
            : t("Save the cat", "Муурыг хадгалах")}
        </button>
      </div>
      <p className="cv-feedback" aria-live="polite">
        {saved
          ? t(
              "The app asked the OS to save cat.png. Let’s find out what that means.",
              "Апп OS-оос cat.png-ийг хадгалахыг хүслээ. Энэ юу гэсэн үг болохыг мэдэж авъя.",
            )
          : t(
              "Click Save. Your app needs help from the operating system.",
              "Save дарж үз. Аппад operating system-ийн тусламж хэрэгтэй.",
            )}
      </p>
    </div>
  );
}

function Resources({ t }: VisualProps) {
  const [selected, setSelected] = useState(1);
  const [power, setPower] = useState(true);
  const resources = [
    {
      name: "CPU",
      icon: Cpu,
      role: t("Does the work", "Зааврыг гүйцэтгэнэ"),
      detail: t(
        "Follows the steps in a program. The processor does the calculating.",
        "Программын алхмуудыг дагана. Processor тооцооллыг хийдэг.",
      ),
    },
    {
      name: "RAM",
      icon: MemoryStick,
      role: t("Work in progress", "Одоо хийж буй ажил"),
      detail: t(
        "Working space for open apps. Ordinary RAM loses its contents when the power goes off.",
        "Нээлттэй аппуудын ажиллах зай. Тог унтрахад энгийн RAM доторх мэдээлэл арилна.",
      ),
    },
    {
      name: "Storage",
      icon: HardDrive,
      role: t("Keep it for later", "Дараа ашиглахаар хадгална"),
      detail: t(
        "A place for saved files. Your saved cat stays here when the power goes off.",
        "Хадгалсан файлын байр. Тог унтарсан ч хадгалсан муур чинь энд үлдэнэ.",
      ),
    },
  ];
  const resource = resources[selected];
  return (
    <div className="cv-resources">
      <div
        className="cv-resource-tabs"
        aria-label={t("Explore computer parts", "Компьютерийн хэсгүүдийг үзэх")}
      >
        {resources.map((r, i) => (
          <button
            key={r.name}
            aria-pressed={selected === i}
            onClick={() => setSelected(i)}
          >
            <r.icon size={24} />
            <strong>{r.name}</strong>
            <span>{r.role}</span>
          </button>
        ))}
      </div>
      <div className={`cv-resource-display ${power ? "is-powered" : ""}`}>
        <div className="cv-resource-picture" aria-hidden="true">
          {selected === 0 ? (
            <div className="cv-chip">
              <Cpu size={62} />
              <span>{power ? "1 + 1 = 2" : "—"}</span>
            </div>
          ) : selected === 1 ? (
            <div className="cv-ram-board">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i}>
                  {power &&
                    (i === 1 ? <Paintbrush /> : i === 2 ? <Music2 /> : <i />)}
                </div>
              ))}
              <span>RAM</span>
            </div>
          ) : (
            <div className="cv-storage-drawer">
              <Folder size={50} />
              <span>
                <FileImage size={24} />
                cat.png
              </span>
              <i />
            </div>
          )}
        </div>
        <div className="cv-resource-copy">
          <span className="cv-eyebrow">{resource.name}</span>
          <h3>{resource.role}</h3>
          <p>{resource.detail}</p>
        </div>
      </div>
      <div className="cv-power-row">
        <button
          className="cv-button"
          aria-pressed={!power}
          onClick={() => setPower(!power)}
        >
          <Power size={16} />
          {power
            ? t("Turn power off", "Тогийг унтраах")
            : t("Turn power on", "Тогийг асаах")}
        </button>
        <span aria-live="polite">
          {power
            ? t("Power is on.", "Тог асаалттай.")
            : selected === 2
              ? t(
                  "Off. The saved cat is still here.",
                  "Унтарлаа. Хадгалсан муур хэвээрээ.",
                )
              : selected === 1
                ? t(
                    "Off. RAM’s work is gone.",
                    "Унтарлаа. RAM дахь ажил ариллаа.",
                  )
                : t("Off. The CPU has stopped.", "Унтарлаа. CPU зогслоо.")}
        </span>
      </div>
    </div>
  );
}

function ProcessTurns({ t }: VisualProps) {
  const [turn, setTurn] = useState(0);
  const jobs = [
    { name: t("Draw", "Зурах"), icon: Paintbrush },
    { name: t("Music", "Хөгжим"), icon: Music2 },
    { name: t("Save", "Хадгалах"), icon: FileImage },
  ];
  return (
    <div className="cv-processes">
      <div className="cv-process-heading">
        <span className="cv-eyebrow">
          {t(
            "A very slow look at very fast turns",
            "Маш хурдан ээлжийг удаашруулж харъя",
          )}
        </span>
        <span>
          {t("Turn", "Ээлж")} {turn + 1}
        </span>
      </div>
      <div className="cv-process-stage">
        <div className="cv-job-list">
          {jobs.map((job, i) => (
            <div key={i} className={turn % 3 === i ? "is-current" : ""}>
              <job.icon size={22} />
              <strong>{job.name}</strong>
              <span>
                {turn % 3 === i
                  ? t("Working", "Ажиллаж байна")
                  : t("Waiting", "Хүлээж байна")}
              </span>
            </div>
          ))}
        </div>
        <ArrowRight className="cv-process-arrow" />
        <div className="cv-processor">
          <Cpu size={48} />
          <span>CPU</span>
          <strong aria-live="polite">{jobs[turn % 3].name}</strong>
        </div>
      </div>
      <div
        className="cv-turn-strip"
        aria-label={t("Example order of turns", "Ээлжийн жишээ дараалал")}
      >
        {Array.from({ length: 9 }, (_, i) => {
          const JobIcon = jobs[i % 3].icon;
          return (
            <span key={i} className={i === turn % 9 ? "is-current" : ""}>
              <JobIcon size={18} />
            </span>
          );
        })}
      </div>
      <div className="cv-controls">
        <p>
          {t(
            "One CPU core, simplified. Several cores can work at once.",
            "Нэг CPU core-ийг хялбарчилсан жишээ. Олон core зэрэг ажиллаж чадна.",
          )}
        </p>
        <button
          className="cv-button cv-button-blue"
          onClick={() => setTurn(turn + 1)}
        >
          {t("Next turn", "Дараагийн ээлж")}
          <Play size={15} />
        </button>
      </div>
    </div>
  );
}

function SaveRoute({ t }: VisualProps) {
  const [step, setStep] = useState(0);
  const steps = [
    t("Drawing app", "Зургийн апп"),
    t("OS checks access", "OS зөвшөөрөл шалгана"),
    "Driver",
    "Storage",
  ];
  const notes = [
    t(
      "The app asks: please save cat.png in Pictures.",
      "Апп хүсэлт гаргана: cat.png-ийг Pictures дотор хадгална уу.",
    ),
    t(
      "The OS checks: may this app write in this folder?",
      "OS шалгана: энэ апп энэ хавтас руу бичиж болох уу?",
    ),
    t(
      "The driver helps the system communicate with the storage device.",
      "Driver системийг storage төхөөрөмжтэй харилцахад тусална.",
    ),
    t(
      "Saved. Pictures/cat.png can stay after the power goes off.",
      "Хадгаллаа. Pictures/cat.png тог унтарсан ч үлдэнэ.",
    ),
  ];
  return (
    <div className="cv-save-route">
      <div className="cv-file-preview">
        <CatDrawing />
        <div>
          <span>{t("One file to keep", "Хадгалах нэг файл")}</span>
          <strong>cat.png</strong>
          <code>Pictures / cat.png</code>
        </div>
        <span className="cv-file-status">
          {step === 3 ? <CheckCheck /> : <FileImage />}
        </span>
      </div>
      <ol className="cv-save-steps">
        {steps.map((name, i) => (
          <li className={i <= step ? "is-reached" : ""} key={name}>
            <span>{i < step ? <Check size={16} /> : `0${i + 1}`}</span>
            <strong>{name}</strong>
            {i < 3 && <ArrowRight size={18} />}
          </li>
        ))}
      </ol>
      <p className="cv-save-explanation" aria-live="polite">
        {notes[step]}
      </p>
      <button
        className="cv-button cv-button-blue"
        onClick={() => setStep((step + 1) % 4)}
      >
        {step === 3 ? <RotateCcw size={16} /> : <ArrowRight size={16} />}
        {step === 3
          ? t("Follow it again", "Дахин дагаж үзэх")
          : t("Follow the file", "Файлыг дагаж үзэх")}
      </button>
      <Caption>
        {t(
          "A local folder in this example. Some folders also sync online.",
          "Энэ жишээнд зөвхөн компьютер дээрх хавтас. Зарим хавтас интернэтээр sync хийдэг.",
        )}
      </Caption>
    </div>
  );
}

function SystemStack({ t }: VisualProps) {
  const [layer, setLayer] = useState(1);
  const layers = [
    {
      name: t("Desktop + terminal", "Desktop + terminal"),
      subtitle: t("How you ask", "Чи хүсэлтээ өгнө"),
      icon: Monitor,
      text: t(
        "Click a window, or type a command. A shell reads typed commands.",
        "Цонх дээр дарж эсвэл command бичиж болно. Shell бичсэн command-ыг уншина.",
      ),
    },
    {
      name: "Kernel",
      subtitle: t("How resources are shared", "Нөөцийг хуваарилна"),
      icon: Cpu,
      text: t(
        "The kernel helps share CPU time, manage RAM, and control access to devices.",
        "Kernel CPU-ийн цагийг хуваарилж, RAM-ыг удирдаж, төхөөрөмжид хандах эрхийг зохицуулна.",
      ),
    },
    {
      name: t("Hardware", "Hardware"),
      subtitle: t("The physical parts", "Бодит эд ангиуд"),
      icon: HardDrive,
      text: t(
        "CPU, RAM, storage, screen, and other devices do the physical work.",
        "CPU, RAM, storage, дэлгэц болон бусад төхөөрөмж бодит ажлыг гүйцэтгэнэ.",
      ),
    },
  ];
  return (
    <div className="cv-system-stack">
      <span className="cv-eyebrow">
        {t("Select a layer", "Нэг давхаргыг сонгоорой")}
      </span>
      <div className="cv-stack-layers">
        {layers.map((item, i) => (
          <button
            key={item.name}
            aria-pressed={layer === i}
            onClick={() => setLayer(i)}
          >
            <item.icon size={25} />
            <span>
              <strong>{item.name}</strong>
              <small>{item.subtitle}</small>
            </span>
            <span className="cv-layer-number">0{i + 1}</span>
          </button>
        ))}
      </div>
      <p className="cv-layer-detail" aria-live="polite">
        {layers[layer].text}
      </p>
      <Caption>
        {t(
          "The desktop is one part of the system. The kernel keeps working underneath.",
          "Desktop бол системийн нэг хэсэг. Kernel түүний цаана ажилласаар байдаг.",
        )}
      </Caption>
    </div>
  );
}

function SystemFamilies({ t }: VisualProps) {
  const [selected, setSelected] = useState(2);
  const systems = [
    {
      title: "Windows",
      maker: "Microsoft",
      glyph: "⊞",
      detail: t(
        "An operating system from Microsoft. It runs apps and manages the computer’s parts.",
        "Microsoft-ийн operating system. Апп ажиллуулж, компьютерийн эд ангиудыг удирдана.",
      ),
    },
    {
      title: "macOS",
      maker: "Apple",
      glyph: "⌘",
      detail: t(
        "Apple’s operating system for Mac computers. macOS is not a Linux distribution.",
        "Apple-ийн Mac компьютерт зориулсан operating system. macOS нь Linux distribution биш.",
      ),
    },
    {
      title: "Linux",
      maker: t("Fedora, Ubuntu, and more", "Fedora, Ubuntu болон бусад"),
      glyph: "⌁",
      detail: t(
        "Linux is a kernel. Distributions such as Fedora add the tools and apps for a complete system.",
        "Linux бол kernel. Fedora зэрэг distribution нь хэрэгсэл, аппуудыг нэмж бүтэн систем болгодог.",
      ),
    },
  ];
  return (
    <div className="cv-families">
      <div className="cv-family-books">
        {systems.map((system, i) => (
          <button
            key={system.title}
            aria-pressed={selected === i}
            onClick={() => setSelected(i)}
          >
            <span className="cv-family-glyph" aria-hidden="true">
              {system.glyph}
            </span>
            <strong>{system.title}</strong>
            <small>{system.maker}</small>
            {i === 2 && (
              <span className="cv-family-pick">
                {t("Our route", "Бидний чиглэл")} ↗
              </span>
            )}
          </button>
        ))}
      </div>
      <p className="cv-family-detail" aria-live="polite">
        <span>0{selected + 1}</span>
        {systems[selected].detail}
      </p>
      <Caption>
        {t(
          "Different controls. The same basic job: help you use the computer.",
          "Удирдлага нь өөр. Гол ажил нь ижил: компьютер ашиглахад тусална.",
        )}
      </Caption>
    </div>
  );
}

function FedoraLayers({ t }: VisualProps) {
  const [selected, setSelected] = useState(0);
  const pieces = [
    {
      name: "GNOME",
      tag: t("Desktop environment", "Desktop environment"),
      text: t(
        "The windows, menus, and controls you see in Fedora Workstation.",
        "Fedora Workstation дээрх цонх, цэс, удирдлагын орчин.",
      ),
    },
    {
      name: t("Apps + tools", "Апп + хэрэгслүүд"),
      tag: t("Things you use", "Чиний ашиглах зүйлс"),
      text: t(
        "Drawing apps, system tools, and other software make the computer useful.",
        "Зургийн апп, системийн хэрэгсэл болон бусад программ компьютерийг ашигтай болгоно.",
      ),
    },
    {
      name: "Linux",
      tag: "Kernel",
      text: t(
        "The kernel helps the software use CPU, RAM, storage, and devices.",
        "Kernel программуудад CPU, RAM, storage, төхөөрөмжүүдийг ашиглахад тусална.",
      ),
    },
  ];
  return (
    <div className="cv-fedora-layers">
      <div className="cv-distro-label">
        <strong>Fedora</strong>
        <span>{t("The distribution", "Бүтэн distribution")}</span>
        <small>
          {t(
            "All these pieces, brought together.",
            "Эдгээр хэсгийг нэгтгэсэн систем.",
          )}
        </small>
      </div>
      <div className="cv-exploded">
        {pieces.map((piece, i) => (
          <button
            key={i}
            aria-pressed={selected === i}
            onClick={() => setSelected(i)}
          >
            <span className="cv-exploded-number">0{i + 1}</span>
            <strong>{piece.name}</strong>
            <small>{piece.tag}</small>
            <ChevronRight size={18} />
          </button>
        ))}
      </div>
      <p className="cv-layer-detail" aria-live="polite">
        {pieces[selected].text}
      </p>
      <Caption>
        {t(
          "This is Fedora Workstation. Other Fedora editions can use other desktops.",
          "Энэ бол Fedora Workstation. Бусад Fedora хувилбар өөр desktop ашиглаж болно.",
        )}
      </Caption>
    </div>
  );
}

function OpenRecipe({ t }: VisualProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`cv-recipe ${open ? "is-open" : ""}`}>
      <div className="cv-recipe-header">
        <Code2 size={28} />
        <span className="cv-eyebrow">Source code</span>
        <button
          className="cv-button"
          aria-pressed={open}
          onClick={() => setOpen(!open)}
        >
          <Eye size={16} />
          {open
            ? t("Close the recipe", "Жорыг хаах")
            : t("Open the recipe", "Жорыг нээх")}
        </button>
      </div>
      <div className="cv-recipe-body">
        <div className="cv-recipe-result">
          <CatDrawing />
          <span>{t("What you see", "Чиний харж буй зүйл")}</span>
        </div>
        <div className="cv-recipe-page">
          {open ? (
            <>
              <div className="cv-code-line">
                <span>01</span>
                <code>brush = blue</code>
              </div>
              <div className="cv-code-line">
                <span>02</span>
                <code>draw(cat)</code>
              </div>
              <div className="cv-code-line">
                <span>03</span>
                <code>save(&quot;cat.png&quot;)</code>
              </div>
              <small>
                {t(
                  "Pretend code, to show the idea.",
                  "Санааг тайлбарлах зохиомол code.",
                )}
              </small>
            </>
          ) : (
            <>
              <LockKeyhole size={38} />
              <p>
                {t(
                  "What instructions made it?",
                  "Үүнийг ямар заавраар бүтээсэн бол?",
                )}
              </p>
              <small>
                {t(
                  "Open the recipe to look inside.",
                  "Жорыг нээгээд доторхыг нь хар.",
                )}
              </small>
            </>
          )}
        </div>
      </div>
      <div className="cv-recipe-verbs">
        <span>{t("Study", "Судал")}</span>
        <span>{t("Change", "Өөрчил")}</span>
        <span>{t("Share", "Хуваалц")}</span>
      </div>
      <Caption>
        {t(
          "Open-source licenses set the rules. Open code can still contain bugs.",
          "Open-source license дүрмийг нь тогтооно. Нээлттэй code ч алдаатай байж болно.",
        )}
      </Caption>
    </div>
  );
}

function FedoraChoice({ t }: VisualProps) {
  return (
    <div className="cv-fedora-choice">
      <div className="cv-fedora-emblem" aria-hidden="true">
        <span>f</span>
        <i />
      </div>
      <div className="cv-choice-copy">
        <span className="cv-eyebrow">
          {t("Our pick for this lesson", "Энэ хичээлд бидний сонголт")}
        </span>
        <h3>
          Fedora
          <br />
          Workstation<span>↗</span>
        </h3>
        <ul>
          <li>
            <Check size={17} />
            {t("Free to explore", "Үнэгүй туршиж судална")}
          </li>
          <li>
            <Check size={17} />
            {t(
              "A desktop without built-in ads",
              "Desktop-д суурилуулсан заргүй",
            )}
          </li>
          <li>
            <ShieldCheck size={17} />
            {t(
              "SELinux protections on by default",
              "SELinux хамгаалалт анхнаасаа асаалттай",
            )}
          </li>
        </ul>
      </div>
      <p className="cv-choice-footnote">
        {t(
          "Still needs updates. Check your games, school apps, and devices before switching.",
          "Шинэчлэлт хэрэгтэй хэвээр. Шилжихээсээ өмнө тоглоом, сургуулийн апп, төхөөрөмжөө шалгаарай.",
        )}
      </p>
    </div>
  );
}

function PermissionChoice({ t }: VisualProps) {
  const [choice, setChoice] = useState<"allow" | "deny" | null>(null);
  return (
    <div className="cv-permissions">
      <div className="cv-source-line">
        <span>{t("Check the source", "Эх сурвалжийг шалга")}</span>
        <strong>Fedora / Flathub / …</strong>
        <ArrowDown size={19} />
      </div>
      <div className="cv-permission-dialog">
        <div className="cv-permission-icons">
          <Paintbrush size={29} />
          <span>?</span>
          <Users size={29} />
        </div>
        <span className="cv-eyebrow">
          {t("Pretend permission request", "Зөвшөөрөл хүсэх жишээ")}
        </span>
        <h3>
          {t(
            "May this drawing app see your contacts?",
            "Энэ зургийн апп contacts-ыг чинь харж болох уу?",
          )}
        </h3>
        <p>
          {t(
            "Does drawing a cat need other people’s names and details?",
            "Муур зурахад бусдын нэр, холбоо барих мэдээлэл хэрэгтэй юу?",
          )}
        </p>
        <div className="cv-permission-actions">
          <button
            className="cv-button"
            aria-pressed={choice === "allow"}
            onClick={() => setChoice("allow")}
          >
            {t("Allow", "Зөвшөөрөх")}
          </button>
          <button
            className="cv-button cv-button-blue"
            aria-pressed={choice === "deny"}
            onClick={() => setChoice("deny")}
          >
            {t("Don’t allow", "Зөвшөөрөхгүй")}
          </button>
        </div>
      </div>
      <p className="cv-feedback" aria-live="polite">
        {choice === null
          ? t(
              "You can pause before you answer.",
              "Хариулахаасаа өмнө түр бодож болно.",
            )
          : choice === "deny"
            ? t(
                "Good pause. Find out why it asks, or choose another app.",
                "Сайн бодлоо. Яагаад хүссэнийг нь мэдэж ав, эсвэл өөр апп сонго.",
              )
            : t(
                "That shares access. A drawing app usually doesn’t need your contacts. You can choose “Don’t allow” here.",
                "Ингэснээр хандах эрх өгнө. Зургийн аппад contacts ихэнхдээ хэрэггүй. Энд “Зөвшөөрөхгүй”-г сонгож болно.",
              )}
      </p>
      <Caption>
        {t(
          "Some apps already have access without a new prompt. The source still matters.",
          "Зарим апп дахин асуухгүйгээр хандах эрхтэй байдаг. Эх сурвалж нь бас чухал.",
        )}
      </Caption>
    </div>
  );
}

function SecurityPrivacy({ t }: VisualProps) {
  const [side, setSide] = useState(0);
  return (
    <div className="cv-security">
      <div className="cv-security-switch">
        <button aria-pressed={side === 0} onClick={() => setSide(0)}>
          <LockKeyhole size={21} />
          Security
        </button>
        <button aria-pressed={side === 1} onClick={() => setSide(1)}>
          <Eye size={21} />
          Privacy
        </button>
      </div>
      <div className={`cv-notebook-scene ${side === 1 ? "is-privacy" : ""}`}>
        <div className="cv-notebook">
          <div className="cv-notebook-rings" aria-hidden="true">
            ○<br />○<br />○<br />○
          </div>
          <CatDrawing />
          <span>cat.png</span>
        </div>
        <div className="cv-notebook-question">
          {side === 0 ? <LockKeyhole size={43} /> : <Users size={43} />}
          <h3>
            {side === 0
              ? t(
                  "Can someone break in?",
                  "Хэн нэгэн зөвшөөрөлгүй орж чадах уу?",
                )
              : t("Who gets to see it?", "Хэн үүнийг харж болох вэ?")}
          </h3>
          <p>
            {side === 0
              ? t(
                  "Protect files and accounts from unwanted access or harm.",
                  "Файл, бүртгэлийг зөвшөөрөлгүй хандалт, гэмтлээс хамгаална.",
                )
              : t(
                  "Ask what is collected, who receives it, and how it is used.",
                  "Юу цуглуулж, хэн авч, яаж ашиглаж байгааг асуу.",
                )}
          </p>
        </div>
      </div>
      <p className="cv-security-bottom">
        {t(
          "A strong lock does not decide who receives a copy.",
          "Сайн цоожтой байлаа ч хуулбарыг хэнд өгөхийг тэр шийдэхгүй.",
        )}
      </p>
    </div>
  );
}

function DataPaths({ t }: VisualProps) {
  const [selected, setSelected] = useState(0);
  const paths = [
    {
      label: t("Update check", "Шинэчлэлт шалгах"),
      example: t("System version", "Системийн хувилбар"),
      receiver: t("Update server", "Шинэчлэлтийн server"),
      reason: t("Find the right update.", "Тохирох шинэчлэлтийг олох."),
    },
    {
      label: t("Diagnostic report", "Diagnostic report"),
      example: t("An app crashed", "Апп гэнэт зогслоо"),
      receiver: t("Report service", "Тайлан хүлээн авах үйлчилгээ"),
      reason: t(
        "Help investigate a problem. Reports can contain extra detail.",
        "Асуудлыг шалгахад туслах. Тайланд нэмэлт мэдээлэл орж болно.",
      ),
    },
    {
      label: t("Online activity", "Интернэт дэх үйлдэл"),
      example: t("Search or uploaded file", "Хайлт эсвэл upload хийсэн файл"),
      receiver: t("Website or app", "Вэбсайт эсвэл апп"),
      reason: t(
        "Run the service. Its own data rules also apply.",
        "Үйлчилгээг ажиллуулах. Тэр үйлчилгээ өөрийн мэдээллийн дүрэмтэй.",
      ),
    },
  ];
  return (
    <div className="cv-data-paths">
      <span className="cv-eyebrow">
        {t("Follow one message", "Нэг зурвасыг дагая")}
      </span>
      <div className="cv-data-tabs">
        {paths.map((path, i) => (
          <button
            key={i}
            aria-pressed={selected === i}
            onClick={() => setSelected(i)}
          >
            {path.label}
          </button>
        ))}
      </div>
      <div className="cv-data-route">
        <div>
          <Monitor size={35} />
          <span>{t("Your computer", "Чиний компьютер")}</span>
        </div>
        <div className="cv-data-packet">
          <ArrowRight />
          <strong>{paths[selected].example}</strong>
          <ArrowRight />
        </div>
        <div>
          <Globe2 size={35} />
          <span>{paths[selected].receiver}</span>
        </div>
      </div>
      <p className="cv-data-purpose" aria-live="polite">
        <span>{t("Why?", "Яагаад?")}</span>
        {paths[selected].reason}
      </p>
      <div className="cv-data-questions">
        <span>{t("What?", "Юу?")}</span>
        <span>{t("To whom?", "Хэнд?")}</span>
        <span>{t("For what?", "Юунд?")}</span>
        <span>{t("My choice?", "Миний сонголт?")}</span>
      </div>
      <Caption>
        {t(
          "Size is not the whole story. A tiny message can reveal a lot.",
          "Зөвхөн хэмжээ чухал биш. Жижиг зурвас ч их зүйл хэлж болно.",
        )}
      </Caption>
    </div>
  );
}

function CollectionComparison({ t }: VisualProps) {
  const [selected, setSelected] = useState(2);
  const systems = [
    {
      name: "Windows",
      badge: t("Required + optional", "Заавал + сонголттой"),
      rows: [
        [
          t("System reports", "Системийн тайлан"),
          t(
            "Required diagnostics: device, settings, and reliability details on ordinary Windows 11 home PCs.",
            "Энгийн Windows 11 гэрийн PC-д төхөөрөмж, тохиргоо, ажиллагааны тухай diagnostics заавал илгээнэ.",
          ),
        ],
        [
          t("Your choice", "Чиний сонголт"),
          t(
            "Optional diagnostics can add app activity, browsing details, and richer crash data. You can turn them off.",
            "Сонголттой diagnostics нь аппын хэрэглээ, browsing, crash-ийн нэмэлт мэдээлэл агуулж болно. Үүнийг унтрааж болно.",
          ),
        ],
        [
          t("Also check", "Бас шалгах зүйл"),
          t(
            "Required reports and connected services can still send data. Apps have their own settings.",
            "Заавал илгээх тайлан, холбогдсон үйлчилгээ мэдээлэл илгээсээр байж болно. Аппууд тусдаа тохиргоотой.",
          ),
        ],
      ],
    },
    {
      name: "macOS",
      badge: t("Analytics with permission", "Зөвшөөрлөөр analytics илгээнэ"),
      rows: [
        [
          t("System reports", "Системийн тайлан"),
          t(
            "Apple says Mac analytics are shared with your permission: hardware, software, crashes, and feature use.",
            "Apple-ийн тайлбараар Mac analytics зөвшөөрлөөр илгээгдэнэ: hardware, software, crash, ашигласан боломжууд.",
          ),
        ],
        [
          t("Your choice", "Чиний сонголт"),
          t(
            "Review System Settings → Privacy & Security → Analytics & Improvements.",
            "System Settings → Privacy & Security → Analytics & Improvements хэсгээс шалгаарай.",
          ),
        ],
        [
          t("Also check", "Бас шалгах зүйл"),
          t(
            "iCloud and other online services are separate. Turning analytics off does not stop uploads.",
            "iCloud болон бусад цахим үйлчилгээ тусдаа. Analytics-ийг унтраахад upload зогсохгүй.",
          ),
        ],
      ],
    },
    {
      name: "Fedora",
      badge: t(
        "Update counting + separate reports",
        "Шинэчлэлтийн тооллого + тусдаа тайлан",
      ),
      rows: [
        [
          t("System reports", "Системийн тайлан"),
          t(
            "countme helps count update-checking systems by Fedora version and approximate installation age.",
            "countme шинэчлэлт шалгасан системүүдийг Fedora хувилбар, суулгаснаас хойших ойролцоо хугацаагаар тоолоход тусална.",
          ),
        ],
        [
          t("What that means", "Энэ юу гэсэн үг вэ"),
          t(
            "countme does not send your picture or every app you open. Servers can log IP addresses and times.",
            "countme зураг эсвэл нээсэн апп бүрийг илгээхгүй. Server IP address болон цагийг бүртгэж болно.",
          ),
        ],
        [
          t("Also check", "Бас шалгах зүйл"),
          t(
            "Crash reports and installed apps are separate. Check their settings and report contents.",
            "Crash report, суулгасан аппууд тусдаа. Тохиргоо болон тайлангийн агуулгыг шалгаарай.",
          ),
        ],
      ],
    },
  ];
  return (
    <div className="cv-comparison">
      <div className="cv-comparison-tabs">
        {systems.map((system, i) => (
          <button
            key={system.name}
            aria-pressed={selected === i}
            onClick={() => setSelected(i)}
          >
            {system.name}
            <span>{i === selected ? "↙" : "↗"}</span>
          </button>
        ))}
      </div>
      <div className="cv-comparison-sheet">
        <div className="cv-comparison-sheet-head">
          <span className="cv-eyebrow">
            {t(
              "What travels, and your choices",
              "Юу илгээгддэг, чи юуг сонгож болох вэ",
            )}
          </span>
          <strong>{systems[selected].badge}</strong>
        </div>
        <dl>
          {systems[selected].rows.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
      <Caption>
        {t(
          "No honest single “MB per day” number fits every computer. Settings, apps, and use change the answer.",
          "Бүх компьютерт таарах ганц “өдөрт хэдэн MB” тоо байхгүй. Тохиргоо, апп, хэрэглээнээс хамаарна.",
        )}
      </Caption>
    </div>
  );
}

function UploadChoice({ t }: VisualProps) {
  const [uploaded, setUploaded] = useState(false);
  return (
    <div className={`cv-upload ${uploaded ? "is-uploaded" : ""}`}>
      <div className="cv-upload-diagram">
        <div className="cv-upload-local">
          <Monitor size={27} />
          <CatDrawing />
          <strong>cat.png</strong>
          <span>{t("Your computer", "Чиний компьютер")}</span>
        </div>
        <div className="cv-upload-bridge">
          <div>{uploaded ? <ArrowRight size={32} /> : <X size={25} />}</div>
          <span>
            {uploaded
              ? t("A copy travels", "Хуулбар илгээгдэнэ")
              : t("No upload", "Upload хийгээгүй")}
          </span>
        </div>
        <div className="cv-upload-web">
          <Globe2 size={27} />
          {uploaded ? <CatDrawing /> : <div className="cv-no-cat">?</div>}
          <strong>{t("Class website", "Ангийн вэбсайт")}</strong>
          <span>
            {uploaded
              ? t("Has a copy", "Хуулбарыг авлаа")
              : t("Has no picture", "Зураг аваагүй")}
          </span>
        </div>
      </div>
      <button
        className="cv-button cv-button-blue"
        aria-pressed={uploaded}
        onClick={() => setUploaded(!uploaded)}
      >
        {uploaded ? <RotateCcw size={16} /> : <Upload size={16} />}
        {uploaded
          ? t("Reset this example", "Жишээг эхлүүлэх")
          : t("Upload a copy", "Хуулбарыг upload хийх")}
      </button>
      <p className="cv-feedback" aria-live="polite">
        {uploaded
          ? t(
              "The website now has the picture. If you are signed in, it can link this to your account—even on Fedora.",
              "Вэбсайт зургийг авлаа. Нэвтэрсэн бол үүнийг чиний бүртгэлтэй холбож чадна — Fedora дээр ч адил.",
            )
          : t(
              "Saved in a local folder with sync off. Saving here alone does not send the picture online.",
              "Sync унтраалттай, компьютер дээрх хавтсанд хадгалсан. Зөвхөн энд хадгалахад зураг интернэт рүү илгээгдэхгүй.",
            )}
      </p>
    </div>
  );
}

function Habits({ t }: VisualProps) {
  const [checked, setChecked] = useState<number[]>([]);
  const habits = [
    [
      t("Install updates", "Шинэчлэлт суулга"),
      t(
        "Fixes can close security gaps.",
        "Засварууд хамгаалалтын цоорхойг нөхнө.",
      ),
    ],
    [
      t("Check app sources", "Аппын эх сурвалжийг шалга"),
      t("Pause at surprising pop-ups.", "Сэжигтэй цонх гарвал түр зогс."),
    ],
    [
      t("Use different passwords", "Өөр өөр password ашигла"),
      t(
        "Ask for help with a password manager and a second sign-in check.",
        "Password manager болон нэвтрэх хоёр дахь шалгалт тохируулахад тусламж ав.",
      ),
    ],
    [
      t("Give only needed access", "Зөвхөн хэрэгтэй эрхийг өг"),
      t("Does the app need the camera?", "Энэ аппад camera хэрэгтэй юу?"),
    ],
    [
      t("Keep a separate backup", "Тусдаа backup хадгал"),
      t("A copy can rescue your work.", "Хуулбар ажлыг чинь аварч чадна."),
    ],
    [
      t("Ask for help", "Тусламж хүс"),
      t(
        "An accidental click is something we can fix.",
        "Санамсаргүй дарсан алдааг засаж болно.",
      ),
    ],
  ];
  return (
    <div className="cv-habits">
      <div className="cv-habits-heading">
        <span className="cv-eyebrow">
          {t(
            "A small checklist for real life",
            "Өдөр тутамд хэрэгтэй жижиг жагсаалт",
          )}
        </span>
        <strong>
          {checked.length}
          <span> / 6</span>
        </strong>
      </div>
      <div className="cv-habit-list">
        {habits.map(([title, detail], i) => (
          <button
            key={i}
            role="checkbox"
            aria-checked={checked.includes(i)}
            onClick={() =>
              setChecked(
                checked.includes(i)
                  ? checked.filter((n) => n !== i)
                  : [...checked, i],
              )
            }
          >
            <span className="cv-checkbox">
              {checked.includes(i) && <Check size={17} />}
            </span>
            <span>
              <strong>{title}</strong>
              <small>{detail}</small>
            </span>
          </button>
        ))}
      </div>
      <p className="cv-feedback" aria-live="polite">
        {checked.length === 6
          ? t(
              "Six habits, one good start. You can come back to this list.",
              "Зургаан дадал — сайхан эхлэл. Энэ жагсаалтаа дахин харж болно.",
            )
          : t(
              "Tick the habits you want to practise.",
              "Дадал болгохыг хүссэн зүйлсээ тэмдэглээрэй.",
            )}
      </p>
    </div>
  );
}

function TerminalDemo({
  t,
  onDemo,
}: VisualProps & { onDemo: (app: DemoApp) => void }) {
  const [command, setCommand] = useState(0);
  return (
    <div className="cv-terminal-demo">
      <div className="cv-demo-label">
        <span className="cv-eyebrow">
          {t("Two ways to see the same files", "Ижил файлыг үзэх хоёр арга")}
        </span>
        <span>{t("Learning simulation", "Сургалтын загвар")}</span>
      </div>
      <div className="cv-terminal">
        <div className="cv-terminal-top">
          <Terminal size={16} />
          <span>student@opitlcalOS</span>
        </div>
        <div className="cv-terminal-content">
          <code>
            <span>$ </span>
            {command === 0
              ? "ls /home/student/Documents"
              : t(
                  "cat /home/student/Documents/notes.txt",
                  "cat /home/student/Documents/notes.mn.txt",
                )}
          </code>
          <pre>
            {command === 0
              ? "lesson-outline.md\nlesson-outline.mn.md\nnotes.mn.txt\nnotes.txt"
              : t(
                  "A note about the blue cat\n\nYou opened an app, drew a cat, and saved it.\n…",
                  "Цэнхэр муурын тухай тэмдэглэл\n\nЧи апп нээж, муур зураад хадгалсан.\n…",
                )}
          </pre>
          <span className="cv-terminal-prompt">
            $ <i />
          </span>
        </div>
      </div>
      <div className="cv-terminal-actions">
        <button
          className="cv-button"
          aria-pressed={command === 0}
          onClick={() => setCommand(0)}
        >
          <Folder size={16} />
          {t("List names", "Нэрсийг жагсаах")}
        </button>
        <button
          className="cv-button"
          aria-pressed={command === 1}
          onClick={() => setCommand(1)}
        >
          <FileText size={16} />
          {t("Read text", "Бичвэрийг унших")}
        </button>
      </div>
      <div className="cv-demo-launch">
        <p>{t("Try the working desktop:", "Ажилладаг desktop дээр турш:")}</p>
        <button
          className="cv-button cv-button-blue"
          onClick={() => onDemo("files")}
        >
          <Folder size={17} />
          Files
          <ArrowRight size={15} />
        </button>
        <button className="cv-button" onClick={() => onDemo("terminal")}>
          <Terminal size={17} />
          Terminal
          <ArrowRight size={15} />
        </button>
      </div>
      <Caption>
        {t(
          "A preview of the simulated files; the note is shortened here. This is not an installed Fedora system. These commands only list and read.",
          "Дуураймал файлуудын урьдчилсан харагдац; тэмдэглэлийг товчилсон. Энэ бол суулгасан Fedora биш. Эдгээр command зөвхөн жагсааж, уншина.",
        )}
      </Caption>
    </div>
  );
}

function Recap({ t }: VisualProps) {
  return (
    <div className="cv-recap">
      <div className="cv-recap-cat">
        <CatDrawing />
        <span>cat.png</span>
      </div>
      <div className="cv-recap-facts">
        <div>
          <Cpu size={23} />
          <strong>CPU</strong>
          <span>{t("does the work", "зааврыг гүйцэтгэнэ")}</span>
        </div>
        <div>
          <MemoryStick size={23} />
          <strong>RAM</strong>
          <span>
            {t("holds work in progress", "одоо хийж буй ажлыг барина")}
          </span>
        </div>
        <div>
          <HardDrive size={23} />
          <strong>Storage</strong>
          <span>{t("keeps the saved file", "хадгалсан файлыг үлдээнэ")}</span>
        </div>
        <div>
          <KeyRound size={23} />
          <strong>{t("You", "Чи")}</strong>
          <span>{t("choose what to share", "юугаа хуваалцахаа сонгоно")}</span>
        </div>
      </div>
      <p className="cv-recap-end">
        {t("Your computer.", "Чиний компьютер.")}
        <br />
        <span>{t("Your choices.", "Чиний сонголт.")}</span>
      </p>
    </div>
  );
}

export default function ChapterVisual({
  chapter,
  language,
  onDemo,
}: {
  chapter: number;
  language: "en" | "mn";
  onDemo: (app: DemoApp) => void;
}) {
  const t: Copy = (en, mn) => (language === "mn" ? mn : en);
  const visuals = [
    <TheCat key="cat" t={t} />,
    <Resources key="resources" t={t} />,
    <ProcessTurns key="processes" t={t} />,
    <SaveRoute key="save" t={t} />,
    <SystemStack key="stack" t={t} />,
    <SystemFamilies key="families" t={t} />,
    <FedoraLayers key="layers" t={t} />,
    <OpenRecipe key="recipe" t={t} />,
    <FedoraChoice key="fedora" t={t} />,
    <PermissionChoice key="permission" t={t} />,
    <SecurityPrivacy key="security" t={t} />,
    <DataPaths key="data" t={t} />,
    <CollectionComparison key="comparison" t={t} />,
    <UploadChoice key="upload" t={t} />,
    <Habits key="habits" t={t} />,
    <TerminalDemo key="terminal" t={t} onDemo={onDemo} />,
    <Recap key="recap" t={t} />,
  ];
  return (
    <div className="chapter-visual" data-chapter={chapter}>
      {visuals[chapter - 1] ?? visuals[0]}
    </div>
  );
}
