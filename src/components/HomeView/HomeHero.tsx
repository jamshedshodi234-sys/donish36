import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { SCHOOL_SUBJECTS, GRADES } from '../../data/subjects';
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  FileText,
  HelpCircle,
  PlayCircle,
  Clock,
  Sparkles,
  Layers,
  CheckCircle2,
  ChevronRight,
  Calculator,
  Shield,
  Award,
} from 'lucide-react';

interface HomeHeroProps {
  onOpenAuth: () => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({ onOpenAuth }) => {
  const {
    setActiveTab,
    setTeacherTab,
    setStudentTab,
    savedPlans,
    savedQuizzes,
    stats,
  } = useApp();
  const { user } = useAuth();

  const [interactiveSubject, setInteractiveSubject] = useState('Алгебра');
  const [interactiveGrade, setInteractiveGrade] = useState('Синфи 8');

  return (
    <div className="space-y-16">
      {/* Editorial Academic Hero */}
      <section className="relative pt-6 pb-12 lg:pt-10 lg:pb-16 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-4xl space-y-6">
          {/* Metadata Kicker (Zero-Pill, unboxed text with subtle separators) */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="text-blue-700 dark:text-blue-400 font-bold">Озмуни ҷумҳуриявӣ</span>
            <span aria-hidden="true">·</span>
            <span>«Идеяи ман — калиди фардо»</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-700 dark:text-slate-300">
              Муаллиф: Ярахмадов Аличон (Синфи 11 г МТМУ №36 ш. Душанбе)
            </span>
          </div>

          {/* Primary Headline with text-wrap: balance */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 dark:text-white tracking-tight leading-[1.12] [text-wrap:balance]">
            Зеҳни сунъӣ барои таҳаввули маорифи Тоҷикистон
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            Платформаи миллии рақамӣ дар заминаи Gemini API барои банақшагирии худкори дарсҳо мувофиқи 14 марҳилаи Вазорати маориф, тавлиди тестҳои 4-варианта ва ёрии инфиродӣ ба хонандагон.
          </p>

          {/* Primary Action Zone */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => {
                setActiveTab('teacher');
                setTeacherTab('lesson-plan');
              }}
              className="px-6 py-3 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center gap-2 shadow-xs"
            >
              <span>Оғози кор бо Ёвари омӯзгор</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveTab('demo')}
              className="px-6 py-3 rounded-xl font-bold text-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors flex items-center gap-2"
            >
              <PlayCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Намоиши озмун (Сенарияи зинда)</span>
            </button>

            {!user && (
              <button
                onClick={onOpenAuth}
                className="px-4 py-3 rounded-xl font-semibold text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
              >
                Воридшавӣ (+992)
              </button>
            )}
          </div>
        </div>

        {/* Full-Width 4-Column Metric Strip (Quiet, unboxed numbers with tabular figures) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 mt-12 border-t border-slate-200/80 dark:border-slate-800/80">
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white tabular-nums tracking-tight">
              14 марҳила
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Сохтори расмии нақшаи дарсӣ тибқи меъёри миллӣ
            </p>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white tabular-nums tracking-tight">
              20 фан
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Фарогирии пурраи фанҳои табиӣ, риёзӣ ва гуманитарӣ
            </p>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white tabular-nums tracking-tight">
              4 вариант
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Санҷиши худкори тест бо ҳисоби фаврии баҳо
            </p>
          </div>

          <div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-950 dark:text-white tabular-nums tracking-tight">
              100% маҳаллӣ
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Калиди API дар сервери дохилӣ бехатар аст
            </p>
          </div>
        </div>
      </section>

      {/* Two-Zone Architecture: Left Interactive Preview & Right Architectural Workspaces */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-950 dark:text-white tracking-tight">
              Фазои кории педагогӣ ва таълимӣ
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Ҳамаи абзорҳо воқеан фаъоланд ва бо истифодаи Gemini API дастрас мебошанд.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Zone: Live Sandbox Preview Card (5 cols) */}
          <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 p-6 shadow-xs space-y-5">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                Санҷиши фаврӣ
              </span>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Санҷиши хусусиятҳои AI дар 1 клик
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Фан ва синфро интихоб карда, ба модулҳои махсусгардонидашуда гузаред.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-300">
                  Фанни мактабӣ
                </label>
                <select
                  value={interactiveSubject}
                  onChange={(e) => setInteractiveSubject(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                >
                  {SCHOOL_SUBJECTS.map((s) => (
                    <option key={s.id} value={s.nameTg}>
                      {s.nameTg}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-300">
                  Синфи таҳсил
                </label>
                <select
                  value={interactiveGrade}
                  onChange={(e) => setInteractiveGrade(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                >
                  {GRADES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <button
                onClick={() => {
                  setActiveTab('teacher');
                  setTeacherTab('lesson-plan');
                }}
                className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center justify-between"
              >
                <span>Таҳияи нақшаи дарс барои {interactiveSubject}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setActiveTab('teacher');
                  setTeacherTab('quiz');
                }}
                className="w-full py-2.5 px-4 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center justify-between"
              >
                <span>Сохтани тести санҷишӣ (4 вариант)</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => {
                  setActiveTab('student');
                  setStudentTab('math-solver');
                }}
                className="w-full py-2.5 px-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold transition flex items-center justify-between"
              >
                <span>Ҳалли қадам ба қадами масъалаҳо</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Right Zone: 4 Curated Domain Service Panels (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Panel 1 */}
            <div
              onClick={() => {
                setActiveTab('teacher');
                setTeacherTab('lesson-plan');
              }}
              className="cursor-pointer p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 hover:border-blue-500/60 transition group space-y-3"
            >
              <div className="text-xs font-bold text-slate-400 group-hover:text-blue-600 transition">
                01. Банақшагирии дарс
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                План-конспекти расмӣ
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Таҳияи дақиқи мақсадҳои таълимӣ, тарбиявӣ, инкишофдиҳанда ва ҷараёни 45-дақиқа бо қолаби Вазорати маориф.
              </p>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 inline-flex items-center gap-1">
                Омодасозӣ <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
              </span>
            </div>

            {/* Panel 2 */}
            <div
              onClick={() => {
                setActiveTab('teacher');
                setTeacherTab('quiz');
              }}
              className="cursor-pointer p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 hover:border-blue-500/60 transition group space-y-3"
            >
              <div className="text-xs font-bold text-slate-400 group-hover:text-blue-600 transition">
                02. Санҷиши дониш
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                Тестҳои 4-варианта
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Супоридани тест бевосита дар барнома, ҳисоби автоматӣ ва шарҳи илмии хатогиҳо баъди ҷамъбаст.
              </p>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 inline-flex items-center gap-1">
                Супоридан <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
              </span>
            </div>

            {/* Panel 3 */}
            <div
              onClick={() => {
                setActiveTab('student');
                setStudentTab('math-solver');
              }}
              className="cursor-pointer p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 hover:border-blue-500/60 transition group space-y-3"
            >
              <div className="text-xs font-bold text-slate-400 group-hover:text-blue-600 transition">
                03. Ёрирасони риёзӣ
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                Ҳалли қадам ба қадам
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Формулаҳои математика, физика ва химия бо баёни сода, то хонанда мантиқи ҳалро дақиқ омӯзад.
              </p>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 inline-flex items-center gap-1">
                Шарҳ ва ҳал <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
              </span>
            </div>

            {/* Panel 4 */}
            <div
              onClick={() => {
                setActiveTab('teacher');
                setTeacherTab('student-evaluator');
              }}
              className="cursor-pointer p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 hover:border-blue-500/60 transition group space-y-3"
            >
              <div className="text-xs font-bold text-slate-400 group-hover:text-blue-600 transition">
                04. Арзёбии педагогӣ
              </div>
              <h4 className="font-bold text-base text-slate-900 dark:text-white">
                Таҳлили ҷавоби хонанда
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Муайян кардани ҷиҳатҳои қавӣ, хатоҳо ва тавсияи баҳо барои қабули қарори ниҳоии омӯзгор.
              </p>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 inline-flex items-center gap-1">
                Арзёбӣ <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 20 Subjects Taxonomy Strip */}
      <section className="p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Фанҳои барномаи мактабии Тоҷикистон (20 фан)
          </h3>
          <span className="text-xs text-slate-500">
            Интихоб кунед ва нақшаи дарс созед
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2">
          {SCHOOL_SUBJECTS.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                setActiveTab('teacher');
                setTeacherTab('lesson-plan');
              }}
              className="p-2.5 rounded-lg text-left bg-white dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700/70 hover:border-blue-500 hover:text-blue-600 transition text-xs font-medium text-slate-700 dark:text-slate-200 truncate"
            >
              {s.nameTg}
            </button>
          ))}
        </div>
      </section>

      {/* Official Contest Editorial Banner */}
      <section className="p-8 rounded-2xl bg-slate-900 dark:bg-slate-950 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2 max-w-xl">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-400">
            Озмуни ҷумҳуриявии «Идеяи ман — калиди фардо»
          </div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
            Муаллифи лоиҳа: Ярахмадов Аличон
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Хонандаи синфи 11 «г»-и МТМУ №36-и ноҳияи Шоҳмансури шаҳри Душанбе. Ҳамаи ҳуҷҷатҳои илмӣ, матни ҳимояи 5–7 дақиқаӣ ва 15 саволу ҷавоби ҳакамон омода мебошанд.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('docs')}
          className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-2 shrink-0"
        >
          <span>Ҳуҷҷатҳои расмӣ ва Ҳимоя</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
