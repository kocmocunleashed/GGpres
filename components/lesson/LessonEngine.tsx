'use client';

import { useSystemReducedMotion } from "@/lib/use-system-reduced-motion";
import dynamic from 'next/dynamic';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Check, Expand, List, Monitor, RotateCcw, X } from 'lucide-react';
import { manuscript, slideCopy } from '@/lib/presentation-data';
import { usePresentationLanguage } from '@/lib/presentation-language';
import { usePresentationGraphics } from '@/lib/presentation-graphics';
import { useSystemStore, type AppId } from '@/store/system';
import Manuscript from './Manuscript';
import GraphicsToggle from './GraphicsToggle';
import './presentation.css';

function SceneLoading() {
  const [language] = usePresentationLanguage();
  return <div className="p-scene-loading" role="status">{language === 'en' ? 'Loading example…' : 'Жишээ ачаалж байна…'}</div>;
}

const ChapterScene3D = dynamic(() => import('./ChapterScene3D'), { ssr: false, loading: SceneLoading });

const labels = {
  en: { lesson: 'How your computer works', chapters: 'Chapters', read: 'Read along', slides: 'Slides', back: 'Previous', next: 'Next chapter', nextQuestion: 'Next question', exit: 'Back to desktop', fullscreen: 'Toggle fullscreen', reset: 'Reset illustration', sources: 'Sources & teaching notes', chapter: 'Chapter', question: 'Question', think: 'Check your understanding', quiz: 'Explain it in your own words', show: 'Reveal answer', hide: 'Hide answer', finish: 'Finish lesson', done: 'You finished the lesson.', complete: 'Lesson complete', explore: 'Explore the desktop', again: 'Start again', answer: 'One way to explain it', checked: 'answers explored', key: '← → to move · R to read · Esc for desktop', contents: 'All chapters', contentsIntro: 'Start with drawing and saving a picture. Then explore Linux, Fedora, and who can see your information.', learn: 'Your computer, your choices', startQuiz: 'Check what you learned', note: 'Take a moment. Try explaining it in your own words before revealing the answer.', verified: 'Source notes · checked 27 September 2026', unavailable: 'Fullscreen is unavailable here. The presentation still fills this view.', important: 'Remember', reading: 'Full explanation', about: 'Before you begin' },
  mn: { lesson: 'Компьютерээ ойлгох хөтөч', chapters: 'Хэсгүүд', read: 'Уншиж дагах', slides: 'Слайд', back: 'Өмнөх', next: 'Дараах хэсэг', nextQuestion: 'Дараах асуулт', exit: 'Desktop руу буцах', fullscreen: 'Бүтэн дэлгэц', reset: 'Үзүүлэнг дахин эхлүүлэх', sources: 'Эх сурвалж ба багшийн тэмдэглэл', chapter: 'Хэсэг', question: 'Асуулт', think: 'Ойлгосноо шалгая', quiz: 'Өөрийн үгээр тайлбарлаарай', show: 'Хариуг харах', hide: 'Хариуг нуух', finish: 'Хичээл дуусгах', done: 'Чи хичээлээ дуусгалаа.', complete: 'Хичээл дууслаа', explore: 'Desktop-ийг судлах', again: 'Дахин эхлэх', answer: 'Ингэж тайлбарлаж болно', checked: 'хариултыг үзлээ', key: '← → шилжих · R унших · Esc desktop', contents: 'Бүх хэсэг', contentsIntro: 'Зураг зурж, хадгалахаас эхэлье. Дараа нь Linux, Fedora болон мэдээллийг чинь хэн харж болохыг үзнэ.', learn: 'Чиний компьютер, чиний сонголт', startQuiz: 'Сурснаа шалгаарай', note: 'Хариуг харахаасаа өмнө өөрийн үгээр тайлбарлаж үзээрэй.', verified: 'Эх сурвалж · 2026.09.27-нд шалгасан', unavailable: 'Бүтэн дэлгэцийн горим энд боломжгүй байна. Илтгэл энэ цонхыг дүүргэж харагдана.', important: 'Санаж үлдэх санаа', reading: 'Дэлгэрэнгүй тайлбар', about: 'Эхлэхийн өмнө' },
};

export default function LessonEngine() {
  const [language] = usePresentationLanguage();
  const [graphicsEnabled] = usePresentationGraphics();
  const t = labels[language];
  const data = manuscript[language];
  const index = useSystemStore(s => s.lessonIndex);
  const reducedMotion = useSystemStore(s => s.reducedMotion);
  const motionPaused = useSystemStore(s => s.motionPaused);
  const systemReduced = useSystemReducedMotion();
  const [reading, setReading] = useState(false);
  const [modal, setModal] = useState<'contents' | 'sources' | null>(null);
  const [reset, setReset] = useState(0);
  const [revealed, setRevealed] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [notice, setNotice] = useState('');
  const root = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const fullscreenToggle = useRef(false);
  const total = data.sections.length + data.quiz.length;
  const current = Math.max(0, Math.min(index, total - 1));
  const quizIndex = current - data.sections.length;
  const isQuiz = quizIndex >= 0;
  const copy = slideCopy[language][Math.min(current, data.sections.length - 1)];
  const section = data.sections[Math.min(current, data.sections.length - 1)];
  const question = isQuiz ? data.quiz[quizIndex] : null;

  const leave = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
    useSystemStore.getState().setLessonPresenting(false);
  }, []);
  const goTo = useCallback((next: number) => {
    useSystemStore.getState().setLessonIndex(Math.max(0, Math.min(total - 1, next)));
    setFinished(false);
    stage.current?.scrollTo({ top: 0 });
    requestAnimationFrame(() => stage.current?.focus({ preventScroll: true }));
  }, [total]);
  const finish = useCallback(() => {
    useSystemStore.getState().setLessonComplete(true);
    setFinished(true);
    stage.current?.scrollTo({ top: 0 });
  }, []);

  useEffect(() => {
    root.current?.focus();
    let ownedFullscreen = document.fullscreenElement === root.current;
    const onFullscreen = () => {
      const owns = document.fullscreenElement === root.current;
      if (ownedFullscreen && !owns && !fullscreenToggle.current) leave();
      ownedFullscreen = owns;
      fullscreenToggle.current = false;
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.defaultPrevented || dialog.current?.open) return;
      const target = event.target as HTMLElement;
      if (target.closest('input, textarea, select, [contenteditable="true"], [role="tablist"], [role="slider"]')) return;
      if (event.key === 'Escape') { event.preventDefault(); leave(); }
      else if (event.altKey || event.ctrlKey || event.metaKey) return;
      else if (event.key === 'ArrowRight' || (event.code === 'Space' && !target.closest('button, a, summary'))) {
        event.preventDefault();
        const position = useSystemStore.getState().lessonIndex;
        if (position < total - 1) goTo(position + 1); else finish();
      } else if (event.key === 'ArrowLeft') { event.preventDefault(); goTo(useSystemStore.getState().lessonIndex - 1); }
      else if (event.key.toLowerCase() === 'r') { event.preventDefault(); setReading(value => !value); }
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('fullscreenchange', onFullscreen);
    return () => { window.removeEventListener('keydown', onKey); document.removeEventListener('fullscreenchange', onFullscreen); };
  }, [finish, goTo, leave, total]);

  function openModal(value: 'contents' | 'sources') { setModal(value); dialog.current?.showModal(); }
  function closeModal() { dialog.current?.close(); setModal(null); }
  function jump(next: number) { closeModal(); goTo(next); }
  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) { fullscreenToggle.current = true; await document.exitFullscreen(); }
      else await root.current?.requestFullscreen();
    } catch { fullscreenToggle.current = false; setNotice(t.unavailable); }
  }
  function demo(app: AppId) { useSystemStore.getState().openApp(app); leave(); }
  function restart() {
    setRevealed([]); setReset(value => value + 1);
    useSystemStore.getState().setLessonComplete(false); goTo(0);
  }

  return <div ref={root} tabIndex={-1} lang={language} className="p-engine" data-reading={reading} data-reduced={!!systemReduced || reducedMotion || motionPaused} data-graphics={graphicsEnabled} data-chapter={isQuiz ? 'quiz' : current + 1} aria-label={t.learn}>
    <header className="p-header">
      <button className="p-brand" onClick={leave} aria-label={t.exit}><span className="p-brand-symbol" aria-hidden="true">o.</span><span>opitlcal<span className="p-brand-os">OS</span><small>{t.lesson}</small></span></button>
      <div className="p-header-right"><GraphicsToggle language={language} /><button className="p-icon-button" onClick={leave} aria-label={t.exit} title={t.exit}><X size={21} /></button></div>
    </header>
    <div className="p-toolbar">
      <button className="p-text-button" onClick={() => openModal('contents')}><List size={17} />{t.chapters}<span className="p-small-count">17</span></button>
      <div className="p-view-switch" role="group" aria-label={language === 'en' ? 'Reading view' : 'Харах горим'}><button aria-pressed={!reading} onClick={() => setReading(false)}><Monitor size={15} />{t.slides}</button><button aria-pressed={reading} onClick={() => setReading(true)}><BookOpen size={15} />{t.read}</button></div>
      <button className="p-icon-button p-fullscreen" onClick={toggleFullscreen} aria-label={t.fullscreen} title={t.fullscreen}><Expand size={17} /></button>
    </div>
    <div className="p-body" ref={stage} tabIndex={-1}>
      <div className="p-slide" key={reset}>
        {finished ? <section className="p-finished"><span className="p-kicker"><Check size={16} />{t.complete}</span><h1>{t.done}</h1><p>{t.learn}</p><div className="p-finish-meter">{revealed.length}<span>/ 8</span><small>{t.checked}</small></div><div className="p-finish-actions"><button className="p-solid-button" onClick={leave}>{t.explore}<ArrowRight size={19} /></button><button className="p-text-button" onClick={restart}><RotateCcw size={17} />{t.again}</button></div></section> : isQuiz && question ? <section className="p-quiz"><div className="p-quiz-marker"><span>{t.think}</span><strong>{String(quizIndex + 1).padStart(2, '0')}<small>/08</small></strong></div><div className="p-quiz-main"><span className="p-kicker">{t.quiz}</span><h1>{question.question}</h1><p className="p-quiz-instruction">{t.note}</p><button className="p-solid-button" aria-expanded={revealed.includes(quizIndex)} aria-controls="quiz-answer" onClick={() => setRevealed(values => values.includes(quizIndex) ? values.filter(i => i !== quizIndex) : [...values, quizIndex])}>{revealed.includes(quizIndex) ? t.hide : t.show}<ArrowRight size={18} /></button><div id="quiz-answer" className="p-quiz-answer" hidden={!revealed.includes(quizIndex)}><span className="p-kicker">{t.answer}</span><p>{question.answer}</p></div></div></section> : <>
          <section className={`p-composition p-composition-${current + 1}`}>
            <div className="p-slide-copy"><span className="p-kicker"><span className="p-chapter-number">{String(current + 1).padStart(2, '0')}</span>{copy.eyebrow}</span><h1>{copy.title}</h1><p className="p-summary">{copy.summary}</p><div className="p-takeaway"><span>{t.important}</span><p>{copy.takeaway}</p></div></div>
            <div className="p-illustration"><ChapterScene3D chapter={current + 1} language={language} enabled={graphicsEnabled} paused={!!systemReduced || reducedMotion || motionPaused || !!modal || reading} onDemo={demo} /></div>
          </section>
          <div className="p-slide-baseline"><span>{section.title}</span><button className="p-text-button" onClick={() => setReset(value => value + 1)}><RotateCcw size={13} />{t.reset}</button></div>
        </>}
      </div>
      {reading && !finished && <aside key={current} className="p-reading" aria-label={t.reading}>
        <div className="p-reading-heading"><BookOpen size={18} /><span>{t.reading}</span><small>{isQuiz ? t.question : t.chapter} {isQuiz ? quizIndex + 1 : current + 1}</small></div>
        {isQuiz && question ? <><h2>{question.question}</h2><details className="p-reading-check"><summary>{t.show}</summary><p>{question.answer}</p></details></> : <><h2>{section.title}</h2><Manuscript text={section.markdown} answerLabel={t.show} /></>}
      </aside>}
    </div>
    <footer className="p-footer"><div className="p-footer-meta"><button className="p-source-button" onClick={() => openModal('sources')}>{language === 'en' ? 'Sources & notes' : 'Эх сурвалж'}<span aria-hidden="true">↗</span></button><span className="p-key-hint">{t.key}</span></div><nav className="p-navigation" aria-label={language === 'en' ? 'Presentation navigation' : 'Илтгэлийн удирдлага'}><button className="p-back-button" disabled={current === 0 && !finished} aria-label={t.back} onClick={() => goTo(finished ? total - 1 : current - 1)}><ArrowLeft size={20} /></button><span className="p-page-count"><b>{String(current + 1).padStart(2, '0')}</b><span>/ {total}</span></span><button className="p-next-button" onClick={() => finished ? leave() : current === total - 1 ? finish() : goTo(current + 1)}>{finished ? t.explore : current === total - 1 ? t.finish : current === data.sections.length - 1 ? t.startQuiz : isQuiz ? t.nextQuestion : t.next}<ArrowRight size={19} /></button></nav></footer>
    <div className="p-progress" aria-hidden="true"><span style={{ width: `${finished ? 100 : ((current + 1) / total) * 100}%` }} /></div>
    {notice && <div className="p-notice" role="status">{notice}<button aria-label={language === 'en' ? 'Dismiss' : 'Хаах'} onClick={() => setNotice('')}><X size={16} /></button></div>}
    <p className="sr-only" aria-live="polite" aria-atomic="true">{isQuiz ? `${t.question} ${quizIndex + 1}: ${question?.question}` : `${t.chapter} ${current + 1}: ${section.title}`}</p>
    <dialog ref={dialog} className={`p-dialog p-dialog-${modal ?? 'contents'}`} onClose={() => setModal(null)} onClick={event => { if (event.target === event.currentTarget) closeModal(); }} aria-labelledby="presentation-dialog-title">
      <div className="p-dialog-inner"><header><span className="p-kicker">opitlcalOS / {modal === 'contents' ? '01—17' : 'REFERENCES'}</span><button className="p-icon-button" onClick={closeModal} aria-label={language === 'en' ? 'Close dialog' : 'Цонх хаах'}><X size={21} /></button></header><h2 id="presentation-dialog-title">{modal === 'contents' ? t.contents : t.sources}</h2>
        {modal === 'contents' ? <><p className="p-dialog-intro">{t.contentsIntro}</p><nav className="p-contents">{data.sections.map((item, i) => <button key={item.id} aria-current={current === i ? 'step' : undefined} onClick={() => jump(i)}><span>{String(item.id).padStart(2, '0')}</span><strong>{item.title}</strong><ArrowRight size={17} /></button>)}<button className="p-quiz-link" onClick={() => jump(data.sections.length)}><span>?</span><strong>{t.startQuiz}</strong><small>8</small></button></nav></> : <><p className="p-dialog-intro">{t.verified}</p><h3>{t.about}</h3><Manuscript text={data.intro} answerLabel={t.show} /><Manuscript text={data.notes} answerLabel={t.show} /></>}
      </div>
    </dialog>
  </div>;
}
