import React, { useState } from 'react';
import { SCHOOL_SUBJECTS, GRADES } from '../../data/subjects';
import { generateWithAI } from '../../services/api';
import { MessageCircleQuestion, Sparkles, Copy, Check, Printer, AlertCircle, Layers } from 'lucide-react';

export const OralQuestionsGenerator: React.FC = () => {
  const [subject, setSubject] = useState('Физика');
  const [grade, setGrade] = useState('Синфи 9');
  const [topic, setTopic] = useState('Қонуни дуюми Нютон ва робитаи қувва бо шитоб');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Мавзӯъро ворид кунед.');
      return;
    }

    setError('');
    setIsLoading(true);

    const prompt = `Барои пурсиши шифоҳии хонандагон аз рӯйи мавзӯи зерин саволҳои методии мураттаб омода намоед.

ФАН: ${subject}
СИНФ: ${grade}
МАВЗӮЪ: ${topic}

Саволҳоро ба се гурӯҳ тақсим намоед:
1. САТҲИ ОСОН (Репродуктивӣ - донистани таърифҳо, формулаҳо ва қоидаҳои асосӣ) - 3 савол бо ҷавобҳои кӯтоҳи намунавӣ
2. САТҲИ МИЁНА (Татбиқӣ - таҳлил, шарҳи ҳодисаҳо ва истифодаи дониш дар амал) - 3 савол бо ҷавобҳои намунавӣ
3. САТҲИ МУРАККАБ (Эҷодӣ ва мантиқӣ - саволҳои проблемавӣ, муқоиса ва хулосабарорӣ барои хонандагони фаъол) - 2 савол бо дастури омӯзгор

Ҳамчунин меъёрҳои тавсиявии баҳодиҳиро ба таври мухтасар пешниҳод кунед.
Забон: Тоҷикии адабӣ.`;

    const res = await generateWithAI({
      prompt,
      systemInstruction: 'Шумо мутахассиси методикаи таълими Тоҷикистон ҳастед.',
    });

    setIsLoading(false);
    if (res.success && res.text) {
      setResult(res.text);
    } else {
      setError(res.error || 'Хатогӣ ҳангоми сохтани саволҳо.');
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 p-6 shadow-xs space-y-4">
          <div className="space-y-1 pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-base text-slate-950 dark:text-white">
              Саволҳои шифоҳӣ
            </h3>
            <p className="text-xs text-slate-500">
              Таҳияи саволҳои сатҳбандишуда (осон, миёна ва мураккаб)
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-300">
              Фанни таълимӣ
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
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
              Синф
            </label>
            <select
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            >
              {GRADES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-300">
              Мавзӯи дарс
            </label>
            <textarea
              rows={3}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Омодасозӣ...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Омода кардани саволҳо бо AI</span>
              </>
            )}
          </button>
        </div>

        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col min-h-[450px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 no-print">
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">
              Саволҳои гурӯҳбандишуда
            </h4>
            {result && (
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="p-1.5 px-3 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-1 border border-slate-200 dark:border-slate-700"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Нусха шуд' : 'Нусха'}</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="p-1.5 px-3 rounded-lg text-xs font-semibold text-blue-600 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" /> Чоп
                </button>
              </div>
            )}
          </div>

          <div className="mt-4 flex-1">
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center py-16 text-center space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600">
                  <Sparkles className="w-5 h-5 animate-spin" />
                </div>
                <p className="text-xs text-slate-500">Зеҳни сунъӣ саволҳоро тартиб дода истодааст...</p>
              </div>
            ) : result ? (
              <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-800 dark:text-slate-200 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/40">
                {result}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-20 text-center text-slate-400 space-y-2">
                <MessageCircleQuestion className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                <p className="text-xs">Барои оғоз мавзӯъро интихоб ва тугмаи омодасозиро пахш намоед.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
