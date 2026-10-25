import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SCHOOL_SUBJECTS, GRADES } from '../../data/subjects';
import { generateWithAI } from '../../services/api';
import {
  Calculator,
  BookOpen,
  Atom,
  Copy,
  Check,
  AlertCircle,
  Lightbulb,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export const StudentAssistant: React.FC = () => {
  const { studentTab, setStudentTab } = useApp();

  const [subject, setSubject] = useState('Алгебра');
  const [grade, setGrade] = useState('Синфи 8');
  const [query, setQuery] = useState('Муодилаи x² - 5x + 6 = 0 -ро бо дискриминант ва теоремаи Виет қадам ба қадам ҳал кунед');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const tabsConfig = [
    { id: 'math-solver', label: 'Ҳалли математика', icon: <Calculator className="w-4 h-4" /> },
    { id: 'physics-chemistry', label: 'Физика ва Химия', icon: <Atom className="w-4 h-4" /> },
    { id: 'topic-explainer', label: 'Тавзеҳи содаи мавзӯъ', icon: <Lightbulb className="w-4 h-4" /> },
    { id: 'language-lit', label: 'Забон ва Адабиёт', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'exam-prep', label: 'Омодагӣ ба имтиҳон', icon: <GraduationCap className="w-4 h-4" /> },
  ] as const;

  const handleRun = async () => {
    if (!query.trim()) {
      setError('Савол ё масъалаи худро ворид кунед.');
      return;
    }

    setError('');
    setIsLoading(true);

    let specificInstructions = '';
    if (studentTab === 'math-solver') {
      specificInstructions = 'Ҳалли масъаларо қадам ба қадам бо формулаҳои равшан, шарҳи мантиқи ҳар як марҳила ва ҷавоби ниҳоӣ нишон диҳед.';
    } else if (studentTab === 'topic-explainer') {
      specificInstructions = 'Ин мавзӯъро бо забони сода ва мисолҳои ҳаётии рӯзмарра фаҳмонед.';
    } else if (studentTab === 'physics-chemistry') {
      specificInstructions = 'Қонунҳо, формулаҳо, воҳидҳои ченаки СИ ва татбиқи ин қонунро муфассал баён намоед.';
    } else if (studentTab === 'language-lit') {
      specificInstructions = 'Таҳлили адабӣ, қоидаҳои имло ва мазмуни ғоявии матнро шарҳ диҳед.';
    } else {
      specificInstructions = 'Нуктаҳои муҳимтарини имтиҳонӣ ва 3 саволи санҷишӣ бо ҷавобҳояш омода намоед.';
    }

    const prompt = `Шумо «Ёвари хонанда» ҳастед.
ФАН: ${subject}
СИНФ: ${grade}
САВОЛ/МАСЪАЛА: ${query}

ДАСТУР:
${specificInstructions}
Забони ҷавоб: тоҷикии фасеҳ ва фаҳмо.`;

    const res = await generateWithAI({
      prompt,
      systemInstruction: 'Шумо омӯзгори меҳрубони хонандагони Тоҷикистон ҳастед. Ҳалро қадам ба қадам ва дақиқ фаҳмонед.',
      temperature: 0.5,
    });

    setIsLoading(false);

    if (res.success && res.text) {
      setResult(res.text);
    } else {
      setError(res.error || 'Хатогӣ ҳангоми гирифтани ҷавоб.');
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-1 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span>Ёвари инфиродии хонанда</span>
          <span aria-hidden="true">·</span>
          <span>Омӯзиши озод ва мустақилона</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">
          Ёвари донишомӯзи рақамӣ
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Ҳалли қадам ба қадами масъалаҳои риёзӣ, тавзеҳи формулаҳо ва омодагӣ ба дарсҳо бо забони сода.
        </p>
      </div>

      {/* Segmented Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
        {tabsConfig.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setStudentTab(t.id as any);
              if (t.id === 'math-solver') {
                setSubject('Алгебра');
                setQuery('Муодилаи квадратиро ҳал кунед: x² - 5x + 6 = 0 бо усули дискриминант ва теоремаи Виет.');
              } else if (t.id === 'physics-chemistry') {
                setSubject('Физика');
                setQuery('Қонуни дуюми Нютонро шарҳ диҳед. Агар ҷисми массааш 4 кг бо шитоби 5 м/с² ҳаракат кунад, қувваро ҳисоб намоед.');
              } else if (t.id === 'topic-explainer') {
                setSubject('Биология');
                setQuery('Фотосинтез чист ва чаро растаниҳо ба нури офтоб эҳтиёҷ доранд?');
              } else if (t.id === 'language-lit') {
                setSubject('Забони тоҷикӣ');
                setQuery('Ҷумлаи мураккаби пайваст ва тобеъ чист? Бо мисол фарқи онҳоро нишон диҳед.');
              } else {
                setSubject('Информатика ва барномасозӣ');
                setQuery('Мафҳуми алгоритм ва намудҳои асосии он (хаттӣ, шохадор, даврӣ).');
              }
            }}
            className={`flex items-center gap-2 py-2 px-3.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              studentTab === t.id
                ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* 2-Zone Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form */}
        <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 p-6 shadow-xs space-y-4">
          <div className="space-y-1 pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-base text-slate-950 dark:text-white">
              Савол ё масъала
            </h3>
            <p className="text-xs text-slate-500">
              Масъаларо ворид кунед, то зеҳни сунъӣ қадам ба қадам фаҳмонад.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Фан
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
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
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Синф
              </label>
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
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

          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
              Матни масъала ё савол *
            </label>
            <textarea
              rows={4}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Савол ё масъалаи худро нависед..."
              className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleRun}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-lg font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Зеҳни сунъӣ дар ҳоли таҳлил ва шарҳ...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Шарҳ ва ҳалли қадам ба қадам</span>
              </>
            )}
          </button>
        </div>

        {/* Right Output */}
        <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 p-6 sm:p-8 shadow-xs flex flex-col min-h-[500px]">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="text-xs font-semibold text-slate-500">
              Тавзеҳоти қадам ба қадами зеҳни сунъӣ
            </div>

            {result && (
              <button
                onClick={handleCopy}
                className="px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1 border border-slate-200 dark:border-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Нусха шуд' : 'Нусхабардорӣ'}</span>
              </button>
            )}
          </div>

          <div className="mt-6 flex-1">
            {isLoading ? (
              <div className="h-full py-20 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-8 h-8 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                <p className="text-xs text-slate-500">Қадамҳои мантиқӣ ва формулаҳо ҷобаҷо шуда истодаанд...</p>
              </div>
            ) : result ? (
              <div className="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 font-sans">
                {result}
              </div>
            ) : (
              <div className="h-full py-24 flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
                <GraduationCap className="w-10 h-10 stroke-1 text-slate-300 dark:text-slate-700" />
                <p className="text-xs max-w-sm">
                  Савол ё масъалаи худро ворид кунед, то ёвари донишомӯз ҳалро муфассал шарҳ диҳад.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
