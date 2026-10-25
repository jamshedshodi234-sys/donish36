import React, { useState } from 'react';
import { SCHOOL_SUBJECTS } from '../../data/subjects';
import { generateStructuredAI } from '../../services/api';
import { useApp } from '../../context/AppContext';
import { StudentEvaluation } from '../../types';
import {
  CheckSquare,
  Sparkles,
  ThumbsUp,
  AlertTriangle,
  Lightbulb,
  Award,
  AlertCircle,
  Copy,
  Check,
  RotateCcw,
} from 'lucide-react';

export const StudentEvaluator: React.FC = () => {
  const { saveEvaluation, savedEvaluations } = useApp();

  const [subject, setSubject] = useState('Алгебра');
  const [topic, setTopic] = useState('Муодилаҳои квадратӣ');
  const [question, setQuestion] = useState('Муодилаи x² - 5x + 6 = 0 -ро ҳал намоед ва решаҳояшро шарҳ диҳед.');
  const [studentAnswer, setStudentAnswer] = useState('D = 25 - 4*1*6 = 25 - 24 = 1. x1 = (5 + 1)/2 = 3. x2 = (5 - 1)/2 = 2. Решаҳо 2 ва 3 мебошанд. Бо теоремаи Виет 2+3=5 ва 2*3=6.');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [evaluation, setEvaluation] = useState<StudentEvaluation | null>(null);

  const handleEvaluate = async () => {
    if (!question.trim() || !studentAnswer.trim()) {
      setError('Савол ва ҷавоби хонандаро ворид кунед.');
      return;
    }

    setError('');
    setIsLoading(true);

    const prompt = `Шумо ҳамчун коршиноси педагогика ва баҳодиҳии дониш бояд ҷавоби зерини хонандаро объективона таҳлил намоед.

ФАН: ${subject}
МАВЗӮЪ: ${topic}
САВОЛ: ${question}
ҶАВОБИ ХОНАНДА: ${studentAnswer}

Лутфан ҷавобро дар формати зерини қатъии JSON баргардонед:
{
  "strengths": ["Ҷиҳати қавии 1", "Ҷиҳати қавии 2"],
  "mistakes": ["Хатогӣ ё носаҳеҳии 1 (агар бошад)"],
  "recommendations": ["Тавсия барои беҳтар намудани ҷавоб"],
  "suggestedGrade": "5 (Аъло)", // Баҳо аз рӯйи низоми 5-холаи Тоҷикистон (5, 4, 3, ё 2)
  "pedagogicalAdvice": "Шарҳи методӣ барои омӯзгор оид ба кори минбаъда бо хонанда"
}`;

    const res = await generateStructuredAI<{
      strengths: string[];
      mistakes: string[];
      recommendations: string[];
      suggestedGrade: string;
      pedagogicalAdvice: string;
    }>({
      prompt,
      systemInstruction: 'Шумо муаллими касбии мактаб ҳастед. Ҷавобро муфассал ва бо оҳанги дастгирикунандаи педагогӣ арзёбӣ намоед.',
    });

    setIsLoading(false);

    if (res.success && res.data) {
      const evalObj: StudentEvaluation = {
        id: `eval-${Date.now()}`,
        subject,
        topic,
        question,
        studentAnswer,
        strengths: res.data.strengths || [],
        mistakes: res.data.mistakes || [],
        recommendations: res.data.recommendations || [],
        suggestedGrade: res.data.suggestedGrade || '5 (Аъло)',
        pedagogicalAdvice: res.data.pedagogicalAdvice || '',
        createdAt: new Date().toLocaleDateString('tg-TJ'),
      };
      setEvaluation(evalObj);
      saveEvaluation(evalObj);
    } else {
      setError(res.error || 'Хатогӣ дар арзёбии ҷавоб.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 p-6 shadow-xs space-y-4">
          <div className="space-y-1 pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-base text-slate-950 dark:text-white">
              Арзёбии ҷавоби хонанда
            </h3>
            <p className="text-xs text-slate-500">
              Таҳлили ҷиҳатҳои қавӣ, хатоҳо ва тавсияи баҳо
            </p>
          </div>
          <h3 className="font-bold text-base">Маълумот барои арзёбӣ</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-300">
                Фан
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
                Мавзӯъ
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-300">
              Саволи додашуда ба хонанда
            </label>
            <textarea
              rows={2}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-300">
              Ҷавоби додаи хонанда
            </label>
            <textarea
              rows={4}
              value={studentAnswer}
              onChange={(e) => setStudentAnswer(e.target.value)}
              placeholder="Ҷавоби хонандаро ба таври матнӣ ин ҷо гузоред..."
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
            onClick={handleEvaluate}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 to-teal-600 text-white hover:from-blue-700 hover:to-teal-700 transition shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Таҳлил бо AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Таҳлил ва арзёбии ҷавоб</span>
              </>
            )}
          </button>
        </div>

        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col min-h-[480px]">
          <h4 className="font-bold text-base pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span>Хулосаи таҳлили педагогӣ</span>
            {evaluation && (
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                Баҳои тавсиявӣ: {evaluation.suggestedGrade}
              </span>
            )}
          </h4>

          <div className="mt-4 flex-1">
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center py-16 text-center space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600">
                  <Sparkles className="w-5 h-5 animate-spin" />
                </div>
                <p className="text-xs text-slate-500">Ҷавоби хонанда таҳқиқ ва муқоиса мешавад...</p>
              </div>
            ) : evaluation ? (
              <div className="space-y-4">
                {/* Strengths */}
                <div className="p-4 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs uppercase mb-2">
                    <ThumbsUp className="w-4 h-4" /> Ҷиҳатҳои қавӣ ва дурусти ҷавоб:
                  </div>
                  <ul className="list-disc list-inside text-xs text-slate-700 dark:text-slate-300 space-y-1">
                    {evaluation.strengths.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Mistakes */}
                <div className="p-4 rounded-xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/50">
                  <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-xs uppercase mb-2">
                    <AlertTriangle className="w-4 h-4" /> Хатогиҳо ва носаҳеҳиҳо:
                  </div>
                  {evaluation.mistakes.length > 0 ? (
                    <ul className="list-disc list-inside text-xs text-slate-700 dark:text-slate-300 space-y-1">
                      {evaluation.mistakes.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-emerald-700 dark:text-emerald-300">
                      Хатогии ҷиддӣ ошкор нашуд, ҷавоб дақиқ аст.
                    </p>
                  )}
                </div>

                {/* Recommendations */}
                <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800/50">
                  <div className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-bold text-xs uppercase mb-2">
                    <Lightbulb className="w-4 h-4" /> Тавсияҳо барои хонанда:
                  </div>
                  <ul className="list-disc list-inside text-xs text-slate-700 dark:text-slate-300 space-y-1">
                    {evaluation.recommendations.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Pedagogical Note */}
                {evaluation.pedagogicalAdvice && (
                  <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300">
                    <strong className="block mb-1 text-slate-900 dark:text-white">
                      Маслиҳати методӣ ба омӯзгор:
                    </strong>
                    {evaluation.pedagogicalAdvice}
                  </div>
                )}

                <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 text-[11px]">
                  * Ёдоварӣ: Баҳои пешниҳодшуда хусусияти тавсиявӣ дорад ва қарори ниҳоиро худи омӯзгор қабул менамояд.
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-20 text-center text-slate-400 space-y-2">
                <CheckSquare className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                <p className="text-xs">Ҷавоби хонандаро ворид намоед ва тугмаи арзёбиро пахш кунед.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
