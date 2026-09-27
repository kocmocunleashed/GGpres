"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Component, type ReactNode, useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { CanvasTexture, CatmullRomCurve3, Group, LinearFilter, Mesh, OrthographicCamera, Shape, SRGBColorSpace, Vector3 } from "three";
import "./chapter-scene-3d.css";

type Language = "en" | "mn";
type Words = readonly [string, string];
type Point = [number, number, number];
type Kind = "computer" | "cpu" | "ram" | "storage" | "file" | "layer" | "terminal" | "code" | "person" | "gate" | "server" | "package" | "shield" | "key" | "update" | "folder" | "eye";
type Part = { kind: Kind; at: Point; label: Words; blue?: boolean; wide?: boolean };
type Route = { from: number; to: number; blocked?: boolean; turn?: number };
type Diagram = { title: Words; caption: Words; parts: Part[]; routes: Route[]; layers?: boolean };
type Props = { chapter: number; language: Language; paused: boolean; onUnavailable?: () => void };

const BLUE = "#2354f4";
const PAPER = "#f2f1e8";
const INK = "#171919";
const PALE = "#d7dff8";
const GREY = "#b7b9ae";
const AMBER = "#986622";
const words = (text: Words, language: Language) => text[language === "mn" ? 1 : 0];
const part = (kind: Kind, at: Point, en: string, mn = en, blue = false): Part => ({ kind, at, label: [en, mn], blue });
const route = (from: number, to: number, options: Omit<Route, "from" | "to"> = {}): Route => ({ from, to, ...options });

const DIAGRAMS: Diagram[] = [
  {
    title: ["A drawing needs a whole computer", "Зурахад компьютерийн хэсгүүд хамт ажиллана"],
    caption: ["The drawing app asks the OS for help. The OS helps it use the computer’s parts.", "Зургийн апп OS-оос тусламж хүснэ. OS компьютерийн эд ангиудыг ашиглахад нь тусална."],
    parts: [part("file", [-2.8, 0, 0], "Drawing app", "Зургийн апп"), { ...part("layer", [0, 0, 0], "Operating system", "Operating system", true), wide: false }, part("computer", [2.8, 0, 0], "Computer", "Компьютер")],
    routes: [route(0, 1), route(1, 2)],
  },
  {
    title: ["Work. Working space. Saved files.", "Ажил. Ажиллах зай. Хадгалсан файл."],
    caption: ["CPU follows instructions. RAM holds current work. Storage keeps a saved copy after power is off.", "CPU зааврыг биелүүлнэ. RAM одоо ашиглаж буй мэдээллийг байлгана. Storage хадгалсан файлыг компьютер унтарсан ч үлдээнэ."],
    parts: [part("cpu", [-2.8, 0, 0], "CPU · instructions", "CPU · заавар", true), part("ram", [0, 0, 0], "RAM · working space", "RAM · ажлын зай"), part("storage", [2.8, 0, 0], "Storage · saved files", "Storage · хадгалсан файл")],
    routes: [route(0, 1), route(1, 2)],
  },
  {
    title: ["Small turns, shared CPU", "Богино ээлж, нэг CPU"],
    caption: ["The OS gives programs turns on a CPU core. This diagram shows the turns slowly; real turns are much faster. Several cores can work at once.", "OS программуудад CPU core ашиглах ээлж өгнө. Загварт ээлжийг удаанаар харуулсан; бодит ээлжүүд хамаагүй хурдан. Хэд хэдэн core зэрэг ажиллаж чадна."],
    parts: [part("file", [-2.9, 0, -1.25], "Drawing process", "Зургийн process"), part("code", [-2.9, 0, .15], "Music process", "Хөгжмийн process"), part("folder", [-2.9, 0, 1.45], "Files process", "Файлын process"), part("cpu", [2.15, 0, .1], "One CPU core", "Нэг CPU core", true)],
    routes: [route(0, 3, { turn: 0 }), route(1, 3, { turn: 1 }), route(2, 3, { turn: 2 })],
  },
  {
    title: ["Follow cat.png into storage", "cat.png-ийг storage руу дагая"],
    caption: ["Pressing Save asks the OS to write a file. It checks access and uses a driver to work with storage, which keeps the file.", "Save дарахад апп OS-оос файл хадгалахыг хүснэ. OS зөвшөөрлийг шалгаж, driver ашиглан storage-тай харилцана. Storage файлыг хадгална."],
    parts: [part("file", [-3.35, 0, 0], "cat.png"), part("gate", [-1.15, 0, 0], "Access check", "Зөвшөөрөл шалгах"), { ...part("layer", [1.1, 0, 0], "Driver", "Driver", true), wide: false }, part("storage", [3.3, 0, 0], "Storage")],
    routes: [route(0, 1), route(1, 2), route(2, 3)],
  },
  {
    title: ["Different controls. The same system.", "Ашиглах арга өөр. Систем нь нэг."],
    caption: ["Clicking desktop buttons or typing commands sends requests. The kernel helps manage access to the computer’s hardware.", "Desktop-ийн товч дарах, command бичих хоёр нь хүсэлт өгөх арга. Kernel компьютерийн hardware-д хандах эрхийг зохицуулахад тусална."],
    parts: [part("computer", [-2.4, .65, -.4], "Desktop"), part("terminal", [2.4, .65, -.4], "Terminal + shell"), part("layer", [0, .1, 0], "Kernel", "Kernel", true), part("layer", [0, -.4, .9], "Hardware")],
    routes: [route(0, 2), route(1, 2), route(2, 3)],
    layers: true,
  },
  {
    title: ["Three families, familiar jobs", "Өөр өөр систем, төстэй ажил"],
    caption: ["Windows and macOS are operating systems. Fedora is one of the distributions built around the Linux kernel.", "Windows, macOS бол operating system. Fedora нь Linux kernel-д тулгуурласан distribution-уудын нэг."],
    parts: [part("computer", [-2.8, 0, 0], "Windows · Microsoft"), part("computer", [0, 0, 0], "macOS · Apple"), part("computer", [2.8, 0, 0], "Linux · Fedora, Ubuntu", "Linux · Fedora, Ubuntu", true)],
    routes: [],
  },
  {
    title: ["Fedora brings the layers together", "Fedora системийн хэсгүүдийг нэгтгэнэ"],
    caption: ["Fedora combines the Linux kernel, tools, and apps into a distribution. Fedora Workstation includes the GNOME desktop.", "Fedora нь Linux kernel, хэрэгсэл, аппуудыг нэгтгэсэн distribution юм. Fedora Workstation нь GNOME desktop-той ирдэг."],
    parts: [part("layer", [0, -.35, .8], "Linux · kernel", "Linux · kernel", true), part("layer", [0, .4, 0], "Tools + apps", "Хэрэгсэл + апп"), part("layer", [0, 1.15, -.8], "GNOME · desktop")],
    routes: [route(0, 1), route(1, 2)],
    layers: true,
  },
  {
    title: ["An open recipe can be improved", "Нээлттэй жорыг сайжруулж болно"],
    caption: ["People can study source code, make changes, and share under its license. Open code still needs people to find and fix bugs.", "Хүмүүс source code-ыг судалж, өөрчилж, license-ийн дагуу хуваалцаж чадна. Алдааг олох, засах хүн хэрэгтэй хэвээр."],
    parts: [part("person", [-3, 0, 0], "Study", "Судлах"), part("code", [0, 0, -.2], "Source code", "Source code", true), part("person", [3, 0, 0], "Improve + share", "Сайжруулах + хуваалцах")],
    routes: [route(1, 0), route(0, 1), route(1, 2), route(2, 1)],
  },
  {
    title: ["Why we picked Fedora", "Бид яагаад Fedora-г сонгосон бэ"],
    caption: ["A desktop to explore, open software to learn from, and SELinux rules for protection. Updates and compatibility checks still matter.", "Fedora дээр desktop, нээлттэй программыг судалж болно. SELinux хамгаалалтын дүрэм нэмнэ. Шинэчлэлт суулгаж, хэрэгтэй апп, төхөөрөмж ажиллах эсэхийг шалгана."],
    parts: [part("computer", [-2.8, 0, 0], "GNOME desktop", "GNOME desktop", true), part("code", [0, 0, 0], "Open software", "Нээлттэй программ"), part("shield", [2.8, 0, 0], "SELinux rules", "SELinux дүрмүүд")],
    routes: [],
  },
  {
    title: ["A request is a moment to choose", "Зөвшөөрөл өгөхөөсөө өмнө бод"],
    caption: ["A drawing app asks for contacts. The gate marks your choice: pause, check why it needs access, and refuse if it does not.", "Зургийн апп contacts-д хандахыг хүсэж байна. Хаалга нь зөвшөөрлийг илэрхийлнэ. Яагаад хэрэгтэйг шалгаад, шаардлагагүй бол татгалзаарай."],
    parts: [part("package", [-3, 0, 0], "Drawing app", "Зургийн апп"), part("gate", [0, 0, 0], "Your permission", "Чиний зөвшөөрөл", true), part("person", [3, 0, 0], "Contacts", "Contacts")],
    routes: [route(0, 1, { blocked: true })],
  },
  {
    title: ["Protect the file. Decide who sees it.", "Файлаа хамгаал. Хэн харахыг шийд."],
    caption: ["Security protects against unwanted access or harm. Privacy asks who gets information and how they use it. Ask about both.", "Security нь зөвшөөрөлгүй хандалт, гэмтлээс хамгаална. Privacy нь мэдээллийг хэн авч, яаж ашиглахтай холбоотой. Хоёуланг нь шалгаарай."],
    parts: [part("shield", [-2.8, 0, 0], "Security · protection", "Security · хамгаалалт"), part("file", [0, 0, 0], "Your picture", "Чиний зураг", true), part("eye", [2.8, 0, 0], "Privacy · who sees it", "Privacy · хэн харах вэ")],
    routes: [],
  },
  {
    title: ["Different messages, different reasons", "Өөр мэдээлэл, өөр шалтгаан"],
    caption: ["An update check, a diagnostic report, and an upload send different information. Ask what is sent, who receives it, why they need it, and whether you can choose.", "Шинэчлэлт шалгахад, diagnostic report илгээхэд, upload хийхэд өөр өөр мэдээлэл явна. Юу илгээх вэ? Хэн авах вэ? Юунд ашиглах вэ? Би сонгож болох уу?"],
    parts: [part("computer", [-2.8, 0, 0], "Your computer", "Чиний компьютер"), part("server", [2.4, 0, -1.4], "Update server", "Шинэчлэлтийн server"), part("server", [2.4, 0, .1], "Diagnostic service", "Тайлан хүлээн авах үйлчилгээ"), part("server", [2.4, 0, 1.6], "Website", "Вэбсайт")],
    routes: [route(0, 1), route(0, 2), route(0, 3)],
  },
  {
    title: ["Different reports. Different choices.", "Тайлан өөр. Сонголт ч өөр."],
    caption: ["Windows: required and optional diagnostics. macOS: analytics with permission. Fedora: countme, with crash reports and apps separate. These shapes do not measure data volume.", "Windows: required ба optional diagnostics. macOS: зөвшөөрөлтэй analytics. Fedora: countme; crash report, аппууд тусдаа. Дүрсийн хэмжээ нь илгээх мэдээллийн хэмжээг заахгүй."],
    parts: [part("computer", [-2.8, 0, .4], "Windows · diagnostics"), part("computer", [0, 0, .4], "macOS · analytics"), part("computer", [2.8, 0, .4], "Fedora · countme", "Fedora · countme", true)],
    routes: [],
  },
  {
    title: ["Upload sends a copy", "Upload хийхэд хуулбар илгээгдэнэ"],
    caption: ["A local file can stay on your computer. Uploading gives a website a copy. A signed-in website can connect that copy to your account, even on Fedora.", "Компьютерт хадгалсан файл тэндээ үлдэж болно. Upload хийхэд вэбсайт хуулбарыг авна. Нэвтэрсэн бол үүнийг бүртгэлтэй чинь холбож чадна. Fedora дээр ч адил."],
    parts: [part("folder", [-3, 0, 0], "Local file", "Компьютерт буй файл"), part("file", [0, 0, -.35], "A copy is sent", "Хуулбар илгээгдэнэ", true), part("server", [3, 0, 0], "Website + account", "Вэбсайт + бүртгэл")],
    routes: [route(0, 1), route(1, 2)],
  },
  {
    title: ["Six small habits add up", "Зургаан жижиг дадал тусална"],
    caption: ["Install updates, check app sources, protect your sign-ins, limit permissions, keep a separate backup, and ask for help.", "Шинэчлэлт суулга. Аппын эх сурвалжийг шалга. Бүртгэлээ хамгаал. Хэрэгтэй зөвшөөрлийг л өг. Тусдаа backup хий. Тусламж хүс."],
    parts: [part("update", [-3, 0, -.75], "Updates", "Шинэчлэлт"), part("package", [0, 0, -.75], "Trusted sources", "Найдвартай эх сурвалж"), part("key", [3, 0, -.75], "Protect sign-ins", "Бүртгэлээ хамгаал"), part("gate", [-3, 0, 1.35], "Permissions", "Permission"), part("storage", [0, 0, 1.35], "Separate backup", "Тусдаа backup", true), part("person", [3, 0, 1.35], "Ask for help", "Тусламж хүс")],
    routes: [],
  },
  {
    title: ["The same file, two ways to reach it", "Нэг файлд хүрэх хоёр арга"],
    caption: ["Files shows a folder in a window. Terminal uses ls to list and cat to read. Both reach the same pretend files in this teaching desktop.", "Files folder-ийг цонхоор харуулна. Terminal-д ls файлуудын нэрийг жагсааж, cat бичвэрийг нь харуулна. Хоёр арга энэ сургалтын desktop-ийн нэг файлд хандана."],
    parts: [part("folder", [-3, 0, 0], "Files · click", "Files · дарах"), part("file", [0, 0, -.5], "notes.txt", "notes.txt", true), part("terminal", [3, 0, 0], "Terminal · ls / cat")],
    routes: [route(0, 1), route(2, 1)],
  },
  {
    title: ["The cat’s whole journey", "Муурын зургийн туулсан зам"],
    caption: ["CPU followed instructions, RAM held working data, and storage kept your saved picture. The OS helped them work together. You choose what to share.", "CPU зааврыг биелүүлж, RAM хэрэгтэй мэдээллийг байлгасан. Storage зургийг хадгалсан. OS эдгээр ажлыг зохицуулахад тусалсан. Юу хуваалцахаа чи сонгоно."],
    parts: [part("cpu", [-3, 0, 0], "CPU"), part("ram", [-1, 0, 0], "RAM"), part("storage", [1.2, 0, 0], "Storage"), part("file", [3.3, 0, 0], "Your cat, your choice", "Чиний муур, чиний сонголт", true)],
    routes: [route(0, 1), route(1, 2), route(2, 3)],
  },
];

function Solid({ at = [0, 0, 0], size, color = PAPER }: { at?: Point; size: Point; color?: string }) {
  return <mesh position={at}><boxGeometry args={size} /><meshStandardMaterial color={color} roughness={.72} metalness={.02} /></mesh>;
}

function Cat({ small = false }: { small?: boolean }) {
  return <group scale={small ? .42 : .65}>
    <mesh scale={[1, .78, .15]}><sphereGeometry args={[.55, 20, 12]} /><meshStandardMaterial color={BLUE} roughness={.75} /></mesh>
    {[-1, 1].map(side => <group key={side}>
      <mesh position={[side * .36, .35, 0]} rotation={[0, 0, side * -.27]} scale={[1, 1, .25]}><coneGeometry args={[.23, .5, 3]} /><meshStandardMaterial color={BLUE} roughness={.75} /></mesh>
      <mesh position={[side * .21, .02, .085]} scale={[.5, 1, .25]}><sphereGeometry args={[.052, 8, 6]} /><meshBasicMaterial color={PAPER} /></mesh>
      <Solid at={[side * .58, -.15, .02]} size={[.3, .025, .03]} color={BLUE} />
    </group>)}
    <mesh position={[0, -.13, .095]} rotation={[0, 0, Math.PI]}><coneGeometry args={[.062, .08, 3]} /><meshBasicMaterial color={PAPER} /></mesh>
  </group>;
}

function Screen({ terminal = false, blue = false }: { terminal?: boolean; blue?: boolean }) {
  return <group>
    <Solid at={[0, .08, 0]} size={[.8, .12, .65]} color={GREY} />
    <Solid at={[0, .36, 0]} size={[.12, .6, .12]} color={INK} />
    <Solid at={[0, .9, 0]} size={[1.2, .87, .14]} color={blue ? BLUE : INK} />
    <Solid at={[0, .91, .081]} size={[1.05, .7, .025]} color={terminal ? INK : PAPER} />
    {terminal ? <group>{[0, 1, 2].map(i => <Solid key={i} at={[-.13 + i * .025, 1.1 - i * .15, .105]} size={[.54 - i * .08, .028, .014]} color={i ? PALE : BLUE} />)}</group> : <group position={[0, .92, .13]}><Cat small /></group>}
  </group>;
}

function Chip({ ram = false, color = BLUE }: { ram?: boolean; color?: string }) {
  return <group>
    <Solid at={[0, .22, 0]} size={ram ? [1.55, .12, .67] : [1.15, .13, 1.15]} color={color} />
    {ram ? <>
      {[-.52, -.17, .17, .52].map(x => <Solid key={x} at={[x, .34, 0]} size={[.24, .14, .35]} color={INK} />)}
      {[-.6, -.4, -.2, 0, .2, .4, .6].map(x => <Solid key={x} at={[x, .17, .39]} size={[.11, .05, .18]} color={GREY} />)}
    </> : <>
      <Solid at={[0, .34, 0]} size={[.75, .15, .75]} color={INK} />
      <Solid at={[0, .43, 0]} size={[.39, .022, .39]} color={PALE} />
      {[-.4, -.14, .14, .4].map(v => <group key={v}>{[-1, 1].map(side => <group key={side}><Solid at={[v, .2, side * .65]} size={[.11, .05, .2]} color={GREY} /><Solid at={[side * .65, .2, v]} size={[.2, .05, .11]} color={GREY} /></group>)}</group>)}
    </>}
  </group>;
}

function Shield({ color = BLUE }: { color?: string }) {
  const shape = useMemo(() => {
    const s = new Shape(); s.moveTo(-.48, .43); s.lineTo(0, .6); s.lineTo(.48, .43); s.lineTo(.38, -.22); s.lineTo(0, -.58); s.lineTo(-.38, -.22); s.closePath(); return s;
  }, []);
  return <group position={[0, .72, 0]}>
    <mesh><extrudeGeometry args={[shape, { depth: .13, bevelEnabled: false }]} /><meshStandardMaterial color={color} roughness={.72} /></mesh>
    <group position={[0, 0, .15]} rotation={[0, 0, -.6]}><Solid at={[-.12, -.04, 0]} size={[.08, .24, .045]} /><Solid at={[.03, .08, 0]} size={[.08, .43, .045]} /></group>
  </group>;
}

function ObjectModel({ kind, blue, wide }: { kind: Kind; blue?: boolean; wide?: boolean }) {
  const accent = blue ? BLUE : PALE;
  switch (kind) {
    case "computer": return <Screen blue={blue} />;
    case "terminal": return <Screen terminal blue />;
    case "cpu": return <Chip color={blue ? BLUE : GREY} />;
    case "ram": return <Chip ram color={BLUE} />;
    case "storage": return <group><Solid at={[0, .33, 0]} size={[1.25, .62, .94]} color={INK} /><Solid at={[0, .35, .48]} size={[1.11, .43, .035]} color={PAPER} /><Solid at={[0, .38, .51]} size={[.42, .04, .025]} color={BLUE} /><mesh position={[.42, .23, .513]}><sphereGeometry args={[.036, 8, 6]} /><meshBasicMaterial color={BLUE} /></mesh></group>;
    case "file": return <group rotation={[0, -.08, -.04]}><Solid at={[0, .65, 0]} size={[.94, 1.16, .1]} color={BLUE} /><Solid at={[0, .65, .061]} size={[.85, 1.07, .025]} color={PAPER} /><group position={[0, .78, .085]}><Cat small /></group><Solid at={[0, .3, .085]} size={[.46, .035, .012]} color={GREY} /></group>;
    case "layer": return <group><Solid at={[0, .14, 0]} size={[wide === false ? 1.75 : 3.2, .23, 1.24]} color={accent} /><Solid at={[0, .27, .02]} size={[wide === false ? 1.25 : 2.7, .025, .86]} color={blue ? BLUE : PAPER} /><Solid at={[wide === false ? -.45 : -1.1, .3, .03]} size={[.22, .035, .3]} color={blue ? PAPER : BLUE} /></group>;
    case "code": return <group><Solid at={[0, .67, 0]} size={[1.21, .96, .1]} color={INK} />{[0, 1, 2, 3].map(i => <Solid key={i} at={[-.06 + (i % 2) * .13, .96 - i * .18, .065]} size={[.7 - (i % 2) * .22, .035, .016]} color={i === 1 ? BLUE : PALE} />)}</group>;
    case "person": return <group><mesh position={[0, 1, 0]}><sphereGeometry args={[.25, 14, 10]} /><meshStandardMaterial color={BLUE} roughness={.7} /></mesh><mesh position={[0, .4, 0]}><cylinderGeometry args={[.16, .4, .62, 12]} /><meshStandardMaterial color={accent} roughness={.8} /></mesh></group>;
    case "gate": return <group><Solid at={[-.52, .62, 0]} size={[.12, 1.2, .18]} color={INK} /><Solid at={[.52, .62, 0]} size={[.12, 1.2, .18]} color={INK} /><Solid at={[0, 1.18, 0]} size={[1.16, .12, .18]} color={INK} /><Solid at={[0, .65, .02]} size={[.74, .6, .1]} color={blue ? BLUE : PALE} /><mesh position={[0, .83, .11]}><torusGeometry args={[.15, .035, 6, 16, Math.PI]} /><meshStandardMaterial color={PAPER} /></mesh><Solid at={[0, .62, .11]} size={[.3, .24, .045]} color={PAPER} /></group>;
    case "server": return <group><Solid at={[0, .59, 0]} size={[.94, 1.14, .75]} color={INK} />{[0, 1, 2].map(i => <group key={i}><Solid at={[0, .3 + i * .32, .39]} size={[.75, .22, .035]} color={PAPER} /><Solid at={[-.23, .3 + i * .32, .414]} size={[.09, .045, .025]} color={BLUE} /><Solid at={[.06, .3 + i * .32, .414]} size={[.28, .024, .025]} color={GREY} /></group>)}</group>;
    case "package": return <group><Solid at={[0, .43, 0]} size={[1, .84, .85]} color={accent} /><Solid at={[0, .86, 0]} size={[.2, .025, .88]} color={BLUE} /><Solid at={[0, .49, .44]} size={[.2, .71, .018]} color={BLUE} /><Solid at={[-.29, .43, .442]} size={[.24, .12, .024]} color={PAPER} /></group>;
    case "shield": return <Shield color={BLUE} />;
    case "key": return <group position={[-.1, .68, 0]} rotation={[0, 0, -.5]}><mesh position={[-.33, 0, 0]}><torusGeometry args={[.25, .07, 8, 20]} /><meshStandardMaterial color={BLUE} /></mesh><Solid at={[.2, 0, 0]} size={[.75, .13, .12]} color={BLUE} /><Solid at={[.49, -.13, 0]} size={[.12, .26, .12]} color={BLUE} /><Solid at={[.25, -.1, 0]} size={[.1, .2, .12]} color={BLUE} /></group>;
    case "update": return <group position={[0, .72, 0]}><mesh rotation={[0, 0, -.6]}><torusGeometry args={[.43, .065, 7, 28, Math.PI * 1.65]} /><meshStandardMaterial color={BLUE} /></mesh><mesh position={[.34, -.24, 0]} rotation={[0, 0, -.15]}><coneGeometry args={[.14, .3, 3]} /><meshStandardMaterial color={BLUE} /></mesh></group>;
    case "folder": return <group><Solid at={[0, .46, -.2]} size={[1.27, .82, .09]} color={INK} /><Solid at={[-.38, .9, -.2]} size={[.5, .19, .09]} color={INK} /><Solid at={[0, .35, .13]} size={[1.27, .61, .12]} color={BLUE} /><Solid at={[0, .5, .205]} size={[.46, .035, .025]} color={PAPER} /></group>;
    case "eye": return <group position={[0, .68, 0]}><mesh scale={[1.5, .8, 1]}><torusGeometry args={[.35, .05, 7, 28]} /><meshStandardMaterial color={BLUE} /></mesh><mesh><sphereGeometry args={[.16, 14, 10]} /><meshStandardMaterial color={INK} roughness={.75} /></mesh></group>;
  }
}

function NumberFlag({ number, layer = false }: { number: number; layer?: boolean }) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas"); canvas.width = 96; canvas.height = 96;
    const context = canvas.getContext("2d");
    if (context) {
      context.fillStyle = PAPER; context.fillRect(4, 4, 88, 88);
      context.strokeStyle = BLUE; context.lineWidth = 3; context.strokeRect(4, 4, 88, 88);
      context.font = "500 37px monospace"; context.fillStyle = BLUE; context.textAlign = "center"; context.textBaseline = "middle"; context.fillText(String(number).padStart(2, "0"), 48, 50);
    }
    const value = new CanvasTexture(canvas); value.colorSpace = SRGBColorSpace; value.minFilter = LinearFilter; return value;
  }, [number]);
  useEffect(() => () => texture.dispose(), [texture]);
  return <sprite position={layer ? [-1.8, .3, .65] : [0, 1.61, 0]} scale={[.35, .35, 1]}><spriteMaterial map={texture} transparent depthTest={false} /></sprite>;
}

function Connection({ data, parts, running, index }: { data: Route; parts: Part[]; running: boolean; index: number }) {
  const dot = useRef<Mesh>(null);
  const elapsed = useRef(data.turn === undefined ? .9 + index * 1.2 : .9);
  const curve = useMemo(() => {
    const a = new Vector3(...parts[data.from].at).add(new Vector3(0, .1, .64));
    const b = new Vector3(...parts[data.to].at).add(new Vector3(0, .1, .64));
    const middle = a.clone().lerp(b, .5).add(new Vector3(0, .18, .2));
    return new CatmullRomCurve3([a, middle, b]);
  }, [data, parts]);
  const position = useMemo(() => new Vector3(), []);
  const initialPosition = useMemo(() => curve.getPoint(.36), [curve]);
  useFrame((_, delta) => {
    if (!running || !dot.current) return;
    elapsed.current += Math.min(delta, .06);
    const t = elapsed.current;
    const progress = data.turn === undefined ? (t * .22) % 1 : (t % 2.1) / 2.1;
    dot.current.visible = data.turn === undefined || Math.floor(t / 2.1) % 3 === data.turn;
    curve.getPoint(data.blocked ? Math.min(progress, .7) : progress, position);
    dot.current.position.copy(position);
    dot.current.rotation.set(0, Math.PI / 4, 0);
  });
  return <group>
    <mesh><tubeGeometry args={[curve, 20, .014, 4, false]} /><meshBasicMaterial color={data.blocked ? AMBER : BLUE} transparent opacity={.43} /></mesh>
    <mesh ref={dot} position={initialPosition} visible={data.turn === undefined || data.turn === 0}><boxGeometry args={[.12, .12, .12]} /><meshStandardMaterial color={data.blocked ? AMBER : BLUE} roughness={.6} /></mesh>
  </group>;
}

function Stage({ diagram, running }: { diagram: Diagram; running: boolean }) {
  const { camera, size, invalidate } = useThree();
  const stage = useRef<Group>(null);
  useEffect(() => {
    if (!(camera instanceof OrthographicCamera)) return;
    camera.position.set(3.8, 5.8, 8.5);
    camera.lookAt(0, .33, .3);
    // Three owns this imperative camera; it is not immutable React state.
    // eslint-disable-next-line react-hooks/immutability
    camera.zoom = Math.min(size.width / 9.7, size.height / 4.6);
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, invalidate, size.width, size.height]);
  return <>
    <ambientLight intensity={1.7} />
    <directionalLight position={[-4, 8, 6]} intensity={2.5} />
    <group ref={stage} position={[0, -.25, 0]}>
      <Solid at={[0, -.2, .35]} size={[8.6, .12, 4.2]} color="#e4e4da" />
      {[-3, -1.5, 0, 1.5, 3].map(x => <Solid key={x} at={[x, -.134, .35]} size={[.01, .006, 3.95]} color="#c9cbbf" />)}
      {[-1, .35, 1.7].map(z => <Solid key={z} at={[0, -.134, z]} size={[8.35, .006, .01]} color="#c9cbbf" />)}
      {diagram.routes.map((data, index) => <Connection key={index} data={data} parts={diagram.parts} running={running} index={index} />)}
      {diagram.parts.map((item, index) => <group key={index} position={item.at}>
        {item.kind !== "layer" && <Solid at={[0, -.045, 0]} size={[1.57, .1, 1.35]} color={item.blue ? PALE : PAPER} />}
        <ObjectModel kind={item.kind} blue={item.blue} wide={item.wide} />
        <NumberFlag number={index + 1} layer={diagram.layers && item.kind === "layer"} />
      </group>)}
    </group>
  </>;
}

function subscribeVisibility(callback: () => void) { document.addEventListener("visibilitychange", callback); return () => document.removeEventListener("visibilitychange", callback); }
function visibleTab() { return document.visibilityState === "visible"; }
function subscribeReducedMotion(callback: () => void) { const media = window.matchMedia("(prefers-reduced-motion: reduce)"); media.addEventListener("change", callback); return () => media.removeEventListener("change", callback); }
function reducedMotion() { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
const falseSnapshot = () => false;

class CanvasBoundary extends Component<{ onFailure: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export default function ChapterScene3D({ chapter, language, paused, onUnavailable }: Props) {
  const diagram = DIAGRAMS[Math.min(17, Math.max(1, chapter)) - 1];
  const container = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const notified = useRef(false);
  const [inView, setInView] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const tabVisible = useSyncExternalStore(subscribeVisibility, visibleTab, falseSnapshot);
  const systemReduced = useSyncExternalStore(subscribeReducedMotion, reducedMotion, falseSnapshot);
  const running = diagram.routes.length > 0 && !paused && !systemReduced && inView && tabVisible;
  const fail = useCallback(() => setUnavailable(true), []);
  const contextLost = useCallback((event: Event) => { event.preventDefault(); setUnavailable(true); }, []);

  useEffect(() => {
    const element = container.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: .02 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [unavailable]);
  useEffect(() => () => { canvas.current?.removeEventListener("webglcontextlost", contextLost); }, [contextLost]);
  useEffect(() => {
    if (unavailable && !notified.current) { notified.current = true; onUnavailable?.(); }
  }, [unavailable, onUnavailable]);

  return <figure className="chapter-scene-3d" data-chapter={chapter} data-running={running && !unavailable}>
    <div className="cs3d-heading"><span>{words(diagram.title, language)}</span><small>{language === "mn" ? "3D загвар" : "3D model"}</small></div>
    {unavailable ? <div className="cs3d-fallback" role="status"><span aria-hidden="true">◇</span><p>{language === "mn" ? "Энэ төхөөрөмж дээр 3D харагдац ажиллахгүй байна. Доорх тайлбар болон бүлгийн дасгалаар үргэлжлүүлээрэй." : "The 3D view is unavailable on this device. Continue with the explanation and chapter exercise below."}</p></div> : <div ref={container} className="cs3d-stage" aria-hidden="true">
      <CanvasBoundary onFailure={fail}>
        <Canvas orthographic camera={{ position: [0, 5.8, 8.5], zoom: 40, near: .1, far: 50 }} dpr={[1, 1.25]} frameloop={running ? "always" : "demand"} gl={{ antialias: true, alpha: true, powerPreference: "low-power" }} fallback={<span>{language === "mn" ? "3D харагдац ажиллахгүй байна. Доорх тайлбарыг уншаарай." : "The 3D view is unavailable. Read the explanation below."}</span>} onCreated={({ gl }) => { gl.setClearColor(PAPER, 0); canvas.current = gl.domElement; gl.domElement.addEventListener("webglcontextlost", contextLost); }}>
          <Stage key={chapter} diagram={diagram} running={running} />
        </Canvas>
      </CanvasBoundary>
      {diagram.routes.length > 0 && <span className="cs3d-motion-key"><i />{language === "mn" ? "Хөдөлгөөнт шоо = мэдээлэл" : "Moving cube = information"}</span>}
    </div>}
    <ol className="cs3d-legend">{diagram.parts.map((item, index) => <li key={index}><span>{String(index + 1).padStart(2, "0")}</span>{words(item.label, language)}</li>)}</ol>
    <figcaption>{words(diagram.caption, language)}</figcaption>
  </figure>;
}
