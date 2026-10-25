import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SCHOOL_SUBJECTS, GRADES } from '../../data/subjects';
import { generateWithAI } from '../../services/api';
import { LessonPlan } from '../../types';
import {
  Printer,
  Download,
  Copy,
  Check,
  Clock,
  Target,
  FileCheck,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const LessonPlanGenerator: React.FC = () => {
  const { saveLessonPlan, savedPlans } = useApp();

  const [subject, setSubject] = useState('Алгебра');
  const [customSubject, setCustomSubject] = useState('');
  const [grade, setGrade] = useState('Синфи 8');
  const [topic, setTopic] = useState('Муодилаҳои квадратӣ ва теоремаи Виет');
  const [duration, setDuration] = useState('45 дақиқа');
  const [extraGoals, setExtraGoals] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const activeSubjectName = subject === 'other' && customSubject ? customSubject : subject;

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Лутфан мавзӯи дарсро ворид кунед.');
      return;
    }

    setError('');
    setIsLoading(true);
    setCopied(false);

    const prompt = `Шумо бояд нақшаи расмӣ ва мукаммали яксоатаи дарсро мувофиқи стандартҳои Вазорати маориф ва илми Ҷумҳурии Тоҷикистон барои муассисаҳои таҳсилоти умумӣ омода намоед.

ФАН: ${activeSubjectName}
СИНФ: ${grade}
МАВЗӮЪ: ${topic}
ДАВОМНОКИИ ДАРС: ${duration}
МАЪЛУМОТИ ИЛОВАГӢ: ${extraGoals || 'Мувофиқи барномаи таълимӣ'}

Нақша бояд дорои ҳамаи ин қисмҳои ҳатмӣ бошад:
1. Мавзӯи дарс
2. Мақсади таълимӣ
3. Мақсади тарбиявӣ
4. Мақсади инкишофдиҳанда
5. Натиҷаҳои интизоршаванда (дониш, малака ва маҳорат)
6. Таҷҳизот, маводи таълимӣ ва аёният
7. Қисми ташкилии дарс (1-2 дақиқа)
8. Пурсиши вазифаи хонагӣ ва фаъолгардонии дониш (5-7 дақиқа)
9. Баёни мавзӯи нав (15-20 дақиқа) - бо қоидаҳо, формулаҳо ё далелҳои мушаххас
10. Машқҳои амалӣ ва кори гурӯҳӣ / инфиродӣ (8-10 дақиқа)
11. Мустаҳкамкунии мавзӯи нав (5 дақиқа)
12. Арзёбии дониши хонандагон ва шарҳи баҳоҳо (2 дақиқа)
13. Вазифаи хонагӣ ва дастур оид ба иҷрои он (2 дақиқа)
14. Хулосаи дарс ва рефлексия

Матн бояд бо забони адабии тоҷикӣ, услуби расмии омӯзгорӣ ва ба синну соли хонандагон мувофиқ бошад.`;

    const res = await generateWithAI({
      prompt,
      systemInstruction: 'Шумо мутахассиси варзидаи педагогика ва методикаи таълими Вазорати маориф ва илми Тоҷикистон ҳастед. Ҳамаи маводҳоро бо забони фасеҳ ва дақиқи тоҷикӣ таҳия кунед.',
      temperature: 0.5,
    });

    setIsLoading(false);

    if (res.success && res.text) {
      setGeneratedPlan(res.text);

      const newPlan: LessonPlan = {
        id: `plan-${Date.now()}`,
        topic,
        subject: activeSubjectName,
        grade,
        duration,
        educationalGoal: 'Дар матн шарҳ ёфтааст',
        upbringingGoal: 'Дар матн шарҳ ёфтааст',
        developmentalGoal: 'Дар матн шарҳ ёфтааст',
        expectedResults: ['Ташаккули дониш ва малака'],
        requiredMaterials: ['Китоби дарсӣ, дафтар, тахтаи синф'],
        stages: {
          organizational: 'Салом ва ҳозирбошӣ',
          homeworkReview: 'Санҷиши вазифаи хонагӣ',
          newTopicExplanation: 'Баёни мавзӯи нав',
          practicalExercises: 'Ҳалли машқҳо',
          consolidation: 'Мустаҳкамкунӣ',
          assessment: 'Баҳогузорӣ',
          homeworkAssignment: 'Вазифа барои хона',
          conclusion: 'Ҷамъбаст',
        },
        rawResponse: res.text,
        createdAt: new Date().toLocaleDateString('tg-TJ'),
      };
      saveLessonPlan(newPlan);
    } else {
      setError(res.error || 'Хатогӣ ҳангоми сохтани нақшаи дарс.');
    }
  };

  const handleCopy = () => {
    if (!generatedPlan) return;
    navigator.clipboard.writeText(generatedPlan);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTxt = () => {
    if (!generatedPlan) return;
    const blob = new Blob([generatedPlan], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Накшаи_дарс_${activeSubjectName}_${grade}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* 2-Zone Grid: Control Deck (5 cols) & Academic Canvas (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Deck */}
        <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 p-6 shadow-xs space-y-4">
          <div className="space-y-1 pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-base text-slate-950 dark:text-white">
              Мушаххасоти дарс
            </h3>
            <p className="text-xs text-slate-500">
              Маълумоти заруриро барои тавлиди нақша муайян намоед.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
              Фанни таълимӣ
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

          <div className="grid grid-cols-2 gap-3">
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

            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
                Давомнокӣ
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
              Мавзӯи дарс *
            </label>
            <textarea
              rows={2}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Масалан: Муодилаҳои квадратӣ..."
              className="w-full px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
              Талаботи иловагӣ ё методика (ихтиёрӣ)
            </label>
            <input
              type="text"
              value={extraGoals}
              onChange={(e) => setExtraGoals(e.target.value)}
              placeholder="Масалан: Истифодаи тахтаи интерактивӣ ва кори ҷуфтӣ"
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-lg font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Зеҳни сунъӣ таҳия карда истодааст...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Сохтани нақшаи дарс бо AI</span>
              </>
            )}
          </button>

          {/* Quick presets */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 block">
              Мавзӯъҳои омода:
            </span>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => {
                  setSubject('Алгебра');
                  setGrade('Синфи 8');
                  setTopic('Муодилаҳои квадратӣ ва теоремаи Виет');
                }}
                className="w-full text-left p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 flex justify-between"
              >
                <span>Алгебра: Муодилаҳои квадратӣ</span>
                <span className="text-slate-400">Синфи 8</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSubject('Физика');
                  setGrade('Синфи 9');
                  setTopic('Қонуни дуюми Нютон ва ҳаракати ҷисмҳо');
                }}
                className="w-full text-left p-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 flex justify-between"
              >
                <span>Физика: Қонуни дуюми Нютон</span>
                <span className="text-slate-400">Синфи 9</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Academic Document Canvas */}
        <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 p-6 sm:p-8 shadow-xs flex flex-col min-h-[540px]">
          {/* Document Actions Bar */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 no-print">
            <div className="text-xs font-semibold text-slate-500">
              Ҳуҷҷати расмии методӣ
            </div>

            {generatedPlan && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1 border border-slate-200 dark:border-slate-700"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Нусха шуд' : 'Нусха'}</span>
                </button>

                <button
                  onClick={handleDownloadTxt}
                  className="px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1 border border-slate-200 dark:border-slate-700"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>TXT</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Чоп</span>
                </button>
              </div>
            )}
          </div>

          {/* Document Sheet */}
          <div className="mt-6 flex-1">
            {isLoading ? (
              <div className="h-full py-20 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-8 h-8 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                <p className="text-xs text-slate-500">Зеҳни сунъии Gemini дар ҳоли таҳияи 14 марҳилаи дарс...</p>
              </div>
            ) : generatedPlan ? (
              <div className="space-y-6">
                {/* Official Letterhead */}
                <div className="text-center pb-4 border-b border-slate-200 dark:border-slate-800">
                  <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                    ВАЗОРАТИ МАОРИФ ВА ИЛМИ ҶУМҲУРИИ ТОҶИКИСТОН
                  </p>
                  <h2 className="text-lg font-extrabold text-slate-950 dark:text-white mt-1">
                    НАҚШАИ ЯКСОАТАИ ДАРСӢ (ПЛАН-КОНСПЕКТ)
                  </h2>
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-500 mt-1">
                    <span>Фан: {activeSubjectName}</span>
                    <span aria-hidden="true">·</span>
                    <span>{grade}</span>
                    <span aria-hidden="true">·</span>
                    <span>{duration}</span>
                  </div>
                </div>

                {/* Plan Content */}
                <div className="whitespace-pre-wrap text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 font-sans">
                  {generatedPlan}
                </div>
              </div>
            ) : (
              <div className="h-full py-24 flex flex-col items-center justify-center text-center text-slate-400 space-y-2">
                <FileCheck className="w-10 h-10 stroke-1 text-slate-300 dark:text-slate-700" />
                <p className="text-xs max-w-sm">
                  Мавзӯъ ва синфро интихоб карда, тугмаи «Сохтани нақшаи дарс бо AI»-ро пахш намоед.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
