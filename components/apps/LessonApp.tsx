'use client';

import { ArrowRight, BookOpen, RotateCcw } from 'lucide-react';
import { manuscript } from '@/lib/presentation-data';
import { usePresentationLanguage } from '@/lib/presentation-language';
import { useSystemStore } from '@/store/system';
import LanguageToggle from '@/components/lesson/LanguageToggle';
import Manuscript from '@/components/lesson/Manuscript';
import '@/components/lesson/presentation.css';

export default function LessonApp() {
  const [language] = usePresentationLanguage();
  const index = useSystemStore(s => s.lessonIndex);
  const complete = useSystemStore(s => s.lessonComplete);
  const mn = language === 'mn';
  const data = manuscript[language];
  function begin(next = index) {
    const state = useSystemStore.getState();
    state.setLessonIndex(next); state.setLessonComplete(false); state.setLessonPresenting(true);
  }
  return <div className="p-launch" lang={language}>
    <header className="p-launch-top"><span className="p-launch-mark">opitlcalOS / FIELD NOTES 001</span><LanguageToggle /></header>
    <div className="p-launch-hero"><div><h2>{mn ? 'Чиний компьютер.\nЧиний сонголт.' : 'Your computer.\nYour choices.'}</h2><p className="p-launch-intro">{mn ? 'Нэг цэнхэр муурын зургийг дагаж үйлдлийн систем, Linux, Fedora болон мэдээллийнхээ нууцлалыг ойлгоё.' : 'Follow one blue cat through operating systems, Linux, Fedora, and the information you share.'}</p><div className="p-launch-actions"><button className="p-solid-button" onClick={() => begin(complete ? 0 : index)}><BookOpen size={17} />{complete ? (mn ? 'Дахин эхлэх' : 'Start again') : index > 0 ? (mn ? 'Үргэлжлүүлэх' : 'Continue reading') : (mn ? 'Илтгэл эхлүүлэх' : 'Start presentation')}<ArrowRight size={18} /></button>{index > 0 && !complete && <button className="p-text-button" onClick={() => begin(0)}><RotateCcw size={16} />{mn ? 'Эхнээс нь' : 'From the start'}</button>}</div><div className="p-launch-counts"><span>{mn ? '17 ХЭСЭГ' : '17 CHAPTERS'}</span><span>{mn ? '8 АСУУЛТ' : '8 QUESTIONS'}</span><span>EN / МН</span></div>{index > 0 && !complete && <p className="p-launch-resume">{mn ? 'Үргэлжлүүлэх хуудас' : 'Your place'} · {index + 1} / 25</p>}</div><div className="p-launch-cat" aria-hidden="true"><svg viewBox="0 0 240 245" fill="none"><path d="M36 106V31l57 43a94 94 0 0 1 54 0l57-43v75c15 15 22 31 22 54 0 47-47 77-106 77S14 207 14 160c0-23 7-39 22-54Z" fill="currentColor"/><path d="M65 148h16m78 0h16m-68 24h26m-13 0v16m0 0-13 9m13-9 13 9" stroke="#f2f1e8" strokeWidth="7" strokeLinecap="round"/><path d="m12 162 40 8m-44 8 42 3m178-19-40 8m44 8-42 3" stroke="currentColor" strokeWidth="5"/></svg></div></div>
    <nav className="p-launch-outline" aria-label={mn ? 'Хичээлийн хэсгүүд' : 'Lesson chapters'}>{data.sections.map((section,i) => <button key={section.id} onClick={() => begin(i)}><span>{String(section.id).padStart(2,'0')}</span>{section.title}<ArrowRight size={14} /></button>)}<button onClick={() => begin(17)}><span>?</span>{mn ? 'Сурснаа шалгаарай' : 'Check what you learned'}<ArrowRight size={14} /></button></nav>
    <details className="p-launch-info"><summary>{mn ? 'Хэрхэн суралцах вэ?' : 'How to use this lesson'}</summary><Manuscript text={data.intro} /></details>
    <details className="p-launch-info"><summary>{mn ? 'Эх сурвалж ба тайлбар' : 'Sources & teaching notes'}</summary><Manuscript text={data.notes} /></details>
  </div>;
}
