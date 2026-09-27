"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Info,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { motion, useIsPresent, useReducedMotion } from "motion/react";
import { useSystemStore } from "@/store/system";
import { useDialogFocus } from "@/lib/use-dialog-focus";
import { usePresentationLanguage } from "@/lib/presentation-language";
import { playTone } from "@/lib/audio";
import LanguageToggle from "@/components/lesson/LanguageToggle";
import WaveMark from "@/components/visual/WaveMark";

function AboutExperience({ onClose }: { onClose: () => void }) {
  const [language] = usePresentationLanguage();
  const mn = language === "mn";
  const ref = useRef<HTMLDivElement>(null);
  useDialogFocus(ref, onClose);

  return (
    <div className="entry-modal-backdrop" onClick={onClose}>
      <div
        className="entry-info-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="experience-title"
        ref={ref}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="entry-icon-button entry-info-close"
          aria-label={mn ? "Мэдээллийг хаах" : "Close information"}
          onClick={onClose}
        >
          <X size={20} />
        </button>
        <WaveMark />
        <h2 id="experience-title">
          {mn ? "Компьютерээ ойлгоё." : "Understand your computer."}
        </h2>
        <p>
          {mn
            ? "Үйлдлийн систем, Linux, Fedora, аюулгүй байдал, хувийн мэдээллийн тухай 17 бүлэгтэй хичээл. Илтгэлийг шууд эхлүүлэх эсвэл 3D өрөөнд орж, компьютерийн дэлгэцээр хичээлээ нээж болно."
            : "A 17-chapter lesson about operating systems, Linux, Fedora, security, and privacy. Start the presentation directly, or enter the 3D room and open it from the computer's desktop."}
        </p>
        <p>
          {mn
            ? "Хуудас бүрийн тайлбарыг өөрийн хурдаар уншаарай. Англи, монгол хэлийг хүссэн үедээ сольж болно. opitlcalOS бол сургалтад зориулсан загвар орчин. Эндхийн файл, ажиллаж буй програм, нөөцийн тоонуудыг таны хөтөч дотор дуурайлган үзүүлдэг."
            : "Read each page at your own pace and switch between English and Mongolian at any time. opitlcalOS is a fictional teaching environment. Its files, processes, and resource use are simulated in your browser."}
        </p>
        <div className="entry-info-keys">
          <span>
            <kbd>←</kbd> <kbd>→</kbd> {mn ? "Хуудсаа солих" : "Change page"}
          </span>
          <span>
            <kbd>Esc</kbd> {mn ? "Нээлттэй цонхыг хаах" : "Close an open panel"}
          </span>
        </div>
        <h3>{mn ? "Загвар ба эх сурвалж" : "Design & credits"}</h3>
        {mn ? (
          <p>
            3D компьютер, камерын хөдөлгөөн, дэлгэцийн хүрээ болон гаднах
            интерфейсийг{" "}
            <a
              href="https://github.com/henryjeff/portfolio-website"
              target="_blank"
              rel="noreferrer"
            >
              Henry Heffernan-ийн бүтээлийн сайтаас
            </a>{" "}
            MIT лицензийн дагуу ашиглан өөрчилсөн. Компьютерийн загвар: Mickael
            Boitte. Орчны загварууд: Sean Nicolas. Текстур: Henry Heffernan.
            Компьютерийн дэлгэцийн загварт{" "}
            <a
              href="https://developer.gnome.org/hig/"
              target="_blank"
              rel="noreferrer"
            >
              GNOME HIG
            </a>
            -ийг ашигласан. Өмнөх геометрийн хөдөлгөөний санааг Sonic Wave
            Infinity-ийн төгсгөлөөс авсан. Хичээлийн дүрслэлүүдийг шинээр
            бүтээсэн; Geometry Dash-ийн зураг, хөгжим ашиглаагүй.
          </p>
        ) : (
          <p>
            Workstation, camera choreography, screen framing, and outer
            interface adapted from{" "}
            <a
              href="https://github.com/henryjeff/portfolio-website"
              target="_blank"
              rel="noreferrer"
            >
              Henry Heffernan&apos;s portfolio
            </a>{" "}
            under the MIT license. Computer model by Mickael Boitte; environment
            models by Sean Nicolas; textures by Henry Heffernan. Desktop
            informed by the{" "}
            <a
              href="https://developer.gnome.org/hig/"
              target="_blank"
              rel="noreferrer"
            >
              GNOME HIG
            </a>
            . Earlier lesson geometry was inspired by Sonic Wave Infinity&apos;s
            ending sequence. Lesson artwork is original; no Geometry Dash assets
            or music are included.
          </p>
        )}
        <p className="entry-info-small">
          IBM Plex · Lucide ·{" "}
          <a href="/licenses.txt" target="_blank" rel="noreferrer">
            {mn ? "Лиценз ба талархал" : "Licenses & acknowledgments"}
          </a>
        </p>
      </div>
    </div>
  );
}

export default function StartGate({
  onStart,
  onSkip,
  ready = true,
}: {
  onStart: () => void;
  onSkip: () => void;
  ready?: boolean;
}) {
  const [language] = usePresentationLanguage();
  const mn = language === "mn";
  const muted = useSystemStore((state) => state.muted);
  const reducedMotion = useSystemStore((state) => state.reducedMotion);
  const motionPaused = useSystemStore((state) => state.motionPaused);
  const systemReducedMotion = useReducedMotion();
  const isPresent = useIsPresent();
  const reduce = reducedMotion || systemReducedMotion || motionPaused;
  const [info, setInfo] = useState(false);
  const closeInfo = useCallback(() => setInfo(false), []);
  const topics = mn
    ? [
        [
          "Үйлдлийн систем",
          "Програм, санах ой, файлууд хэрхэн хамт ажилладаг вэ?",
        ],
        [
          "Linux ба Fedora",
          "Компьютерээ өөрийнхөөрөө ашиглаж, доторхыг нь мэдье.",
        ],
        ["Аюулгүй байдал", "Шинэчлэлт, зөвшөөрөл, нууц үг яагаад хэрэгтэй вэ?"],
        [
          "Хувийн мэдээлэл",
          "Ямар мэдээлэл цуглуулдаг, юуг та сонгож болох вэ?",
        ],
      ]
    : [
        ["Operating systems", "How apps, memory, and files work together."],
        ["Linux & Fedora", "An open system you can explore and make your own."],
        ["Staying safe", "Why updates, permissions, and passwords matter."],
        ["Your information", "What gets collected, and what you can choose."],
      ];

  return (
    <motion.div
      className="entry-shell"
      initial={false}
      exit={{ opacity: 0 }}
      transition={{ duration: reduce ? 0 : 0.2 }}
      inert={!isPresent}
      aria-hidden={!isPresent}
    >
      <div className="entry-page" inert={info} aria-hidden={info || undefined}>
        <header className="entry-header">
          <div className="entry-brand">
            <WaveMark />
            <span>
              opitlcal<span className="entry-brand-os">OS</span>
              <small>{mn ? "Ойлгож суръя" : "Learn how it works"}</small>
            </span>
          </div>
          <LanguageToggle />
        </header>
        <div className="entry-center" aria-labelledby="entry-title">
          <section className="entry-intro">
            <p className="entry-eyebrow">
              {mn
                ? "17 бүлэг · Бие даан сурах хичээл"
                : "17 chapters · A self-study lesson"}
            </p>
            <h1 id="entry-title">
              {mn ? (
                <>
                  Компьютерээ
                  <br />
                  <span>ойлгоё.</span>
                </>
              ) : (
                <>
                  Understand
                  <br />
                  <span>your computer.</span>
                </>
              )}
            </h1>
            <p className="entry-description">
              {mn
                ? "Компьютерийн цаана юу ажилладаг вэ? Linux, Fedora-тай танилцаж, компьютер болон хувийн мэдээллээ хэрхэн хамгаалахаа суръя."
                : "What keeps a computer running? Meet Linux and Fedora, see how operating systems work, and learn to look after your information."}
            </p>
            <Link className="entry-start" href="/presentation">
              {mn ? "Илтгэл эхлүүлэх" : "Start presentation"}
              <ArrowRight size={22} aria-hidden="true" />
            </Link>
            <p className="entry-read-note">
              {mn
                ? "Тайлбарыг уншаад, дараагийн хуудас руу өөрийн хурдаар шилжээрэй."
                : "Read the explanation. Try the examples. Move on when you're ready."}
            </p>
            <div className="entry-secondary-actions">
              <button
                onClick={onStart}
                disabled={!ready}
                aria-describedby={
                  !ready ? "entry-workstation-status" : undefined
                }
              >
                {mn ? "3D өрөөнд орох" : "Enter the 3D room"}
                <ArrowUpRight size={16} aria-hidden="true" />
              </button>
              <button onClick={onSkip}>
                {mn ? "Компьютерийн дэлгэцийг нээх" : "Explore the desktop"}
                <ArrowUpRight size={16} aria-hidden="true" />
              </button>
            </div>
            {!ready && (
              <p
                id="entry-workstation-status"
                className="entry-status"
                role="status"
              >
                {mn
                  ? "3D өрөө ачаалж байна. Илтгэлийг шууд эхлүүлж болно."
                  : "The 3D room is loading. You can start the presentation now."}
              </p>
            )}
          </section>
          <aside className="entry-topics" aria-labelledby="entry-topics-title">
            <h2 id="entry-topics-title">
              {mn ? "Энэ хичээлээр" : "Inside the lesson"}
            </h2>
            <ol>
              {topics.map(([title, description], index) => (
                <li key={index}>
                  <span className="entry-topic-number" aria-hidden="true">
                    0{index + 1}
                  </span>
                  <div>
                    <h3>{title}</h3>
                    <p>{description}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="entry-topic-note">
              {mn
                ? "Өмнөх мэдлэг хэрэггүй. Эхнээс нь хамт үзье."
                : "No computer knowledge needed. We'll start at the beginning."}
            </p>
          </aside>
        </div>
        <footer className="entry-footer">
          <button onClick={() => setInfo(true)}>
            <Info size={16} aria-hidden="true" />
            {mn ? "Хичээлийн тухай" : "About this lesson"}
          </button>
          <div className="entry-preferences">
            <button
              className="entry-motion-control"
              onClick={() =>
                useSystemStore.getState().setReducedMotion(!reducedMotion)
              }
              aria-pressed={reducedMotion}
            >
              <span
                className={`entry-switch ${reducedMotion ? "is-on" : ""}`}
                aria-hidden="true"
              />
              {mn ? "Хөдөлгөөнийг багасгах" : "Reduce motion"}
            </button>
            <button
              className="entry-sound"
              aria-label={
                mn
                  ? muted
                    ? "Дууг асаах"
                    : "Дууг хаах"
                  : muted
                    ? "Enable sound"
                    : "Mute sound"
              }
              title={
                mn
                  ? muted
                    ? "Дуу хаалттай"
                    : "Дуу нээлттэй"
                  : muted
                    ? "Sound off"
                    : "Sound on"
              }
              onClick={() => {
                useSystemStore.getState().setMuted(!muted);
                if (muted) playTone();
              }}
            >
              {muted ? <VolumeX size={19} /> : <Volume2 size={19} />}
            </button>
          </div>
        </footer>
      </div>
      {info && <AboutExperience onClose={closeInfo} />}
    </motion.div>
  );
}
