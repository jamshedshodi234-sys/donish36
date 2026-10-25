import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SCHOOL_SUBJECTS, GRADES } from '../../data/subjects';
import { generateStructuredAI } from '../../services/api';
import { Quiz, QuizQuestion } from '../../types';
import {
  Sparkles,
  CheckCircle,
  XCircle,
  RotateCcw,
  Printer,
  Download,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

export const QuizGenerator: React.FC = () => {
  const { saveQuiz, savedQuizzes } = useApp();

  const [subject, setSubject] = useState('Алгебра');
  const [grade, setGrade] = useState('Синфи 8');
  const [topic, setTopic] = useState('Муодилаҳои квадратӣ ва теоремаи Виет');
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState<'осон' | 'миёна' | 'мураккаб'>('миёна');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);

  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      setError('Мавзӯи тестро ворид намоед.');
      return;
    }

    setError('');
    setIsLoading(true);
    setIsSubmitted(false);
    setUserAnswers({});
    setScore(null);

    const prompt = `Шумо бояд маҷмӯи саволҳои тестии 4-вариантаро барои мактабҳои Тоҷикистон таҳия намоед.

ФАН: ${subject}
СИНФ: ${grade}
МАВЗӮЪ: ${topic}
ШУМОРАИ САВОЛҲО: ${questionCount}
САТҲИ ДУШВОРӢ: ${difficulty}

ҲАР ЯК САВОЛ БОЯД ДОРОИ ЧОР ВАРИАНТ (А, Б, В, Г) БОШАД.
Ҳатман JSON-и зеринро баргардонед:
{
  "title": "Тести санҷишӣ аз рӯйи мавзӯъ",
  "questions": [
    {
      "id": 1,
      "question": "Матни савол бо забони тоҷикӣ",
      "options": ["Варианти А", "Варианти Б", "Варианти В", "Варианти Г"],
      "correctIndex": 0,
      "explanation": "Шарҳи илмӣ ва формулаи чаро ин вариант дуруст аст"
    }
  ]
}`;

    const res = await generateStructuredAI<{
      title: string;
      questions: QuizQuestion[];
    }>({
      prompt,
      systemInstruction: 'Шумо муаллифи тестҳои Маркази миллии тестии Тоҷикистон ҳастед. Ҷавоби дурустро бо index муайян карда, шарҳи пурраи илмӣ диҳед.',
    });

    setIsLoading(false);

    if (res.success && res.data && Array.isArray(res.data.questions) && res.data.questions.length > 0) {
      const newQuiz: Quiz = {
        id: `quiz-${Date.now()}`,
        title: res.data.title || `Тест аз фанни ${subject}: ${topic}`,
        subject,
        grade,
        questions: res.data.questions,
        createdAt: new Date().toLocaleDateString('tg-TJ'),
      };
      setCurrentQuiz(newQuiz);
      saveQuiz(newQuiz);
    } else {
      setError(res.error || 'Хатогӣ дар эҷоди тест.');
    }
  };

  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    if (isSubmitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  const handleSubmitQuiz = () => {
    if (!currentQuiz) return;
    let correctCount = 0;
    currentQuiz.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setIsSubmitted(true);
  };

  const handleResetQuiz = () => {
    setUserAnswers({});
    setIsSubmitted(false);
    setScore(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTxt = () => {
    if (!currentQuiz) return;
    let content = `САНҶИШИ ДОНИШ: ${currentQuiz.title}\nФан: ${currentQuiz.subject} | Синф: ${currentQuiz.grade}\nСана: ${currentQuiz.createdAt}\n\n`;

    currentQuiz.questions.forEach((q, i) => {
      content += `${i + 1}. ${q.question}\n`;
      q.options.forEach((opt, oi) => {
        const letter = ['А', 'Б', 'В', 'Г'][oi];
        content += `   ${letter}) ${opt}\n`;
      });
      content += `\n`;
    });

    content += `\n--- КАЛИДИ ҶАВОБҲО ВА ТАВЗЕҲОТ ---\n`;
    currentQuiz.questions.forEach((q, i) => {
      const correctLetter = ['А', 'Б', 'В', 'Г'][q.correctIndex];
      content += `${i + 1}. Ҷавоби дуруст: ${correctLetter} | Шарҳ: ${q.explanation}\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Тест_${currentQuiz.subject}_${currentQuiz.grade}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Deck */}
        <div className="lg:col-span-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 p-6 shadow-xs space-y-4">
          <div className="space-y-1 pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-base text-slate-950 dark:text-white">
              Танзимоти тест
            </h3>
            <p className="text-xs text-slate-500">
              Тестҳои 4-варианта мутобиқи қолаби Маркази миллии тестӣ
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
                Шумораи савол
              </label>
              <select
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              >
                <option value={3}>3 савол (намоиши зуд)</option>
                <option value={5}>5 савол (стандарт)</option>
                <option value={10}>10 савол</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
              Сатҳи душворӣ
            </label>
            <div className="grid grid-cols-3 gap-1.5 text-xs">
              {(['осон', 'миёна', 'мураккаб'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setDifficulty(lvl)}
                  className={`py-1.5 rounded-lg font-medium capitalize border transition-colors ${
                    difficulty === lvl
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white font-bold'
                      : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1 text-slate-700 dark:text-slate-300">
              Мавзӯи тест *
            </label>
            <textarea
              rows={2}
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Масалан: Муодилаҳои квадратӣ..."
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
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-lg font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Зеҳни сунъӣ тест сохта истодааст...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Сохтани тест бо AI</span>
              </>
            )}
          </button>
        </div>

        {/* Right Test Canvas */}
        <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 p-6 sm:p-8 shadow-xs min-h-[540px] flex flex-col">
          {isLoading ? (
            <div className="my-auto py-20 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-500">
                Саволҳо, вариантҳо ва калиди тавзеҳот таҳия мешаванд...
              </p>
            </div>
          ) : currentQuiz ? (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <span>{currentQuiz.subject}</span>
                    <span aria-hidden="true">·</span>
                    <span>{currentQuiz.grade}</span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-950 dark:text-white mt-0.5">
                    {currentQuiz.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 no-print">
                  <button
                    onClick={handleDownloadTxt}
                    className="px-2.5 py-1.5 rounded-md text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition flex items-center gap-1 border border-slate-200 dark:border-slate-700"
                  >
                    <Download className="w-3.5 h-3.5" /> TXT
                  </button>
                  <button
                    onClick={handlePrint}
                    className="px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition flex items-center gap-1"
                  >
                    <Printer className="w-3.5 h-3.5" /> Чоп
                  </button>
                </div>
              </div>

              {/* Score Strip */}
              {isSubmitted && score !== null && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <div className="font-bold text-sm text-slate-950 dark:text-white">
                      Натиҷа: {score} аз {currentQuiz.questions.length} дуруст ({Math.round((score / currentQuiz.questions.length) * 100)}%)
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Калидҳои дуруст ва тавзеҳоти зеҳни сунъӣ дар поён нишон дода шудаанд.
                    </p>
                  </div>

                  <button
                    onClick={handleResetQuiz}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-300 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Аз нав
                  </button>
                </div>
              )}

              {/* Question Items */}
              <div className="space-y-6">
                {currentQuiz.questions.map((q, qIndex) => {
                  const selected = userAnswers[qIndex];
                  const isCorrect = selected === q.correctIndex;

                  return (
                    <div
                      key={q.id || qIndex}
                      className="p-5 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="font-semibold text-sm text-slate-900 dark:text-white leading-snug">
                          <span className="font-bold text-blue-600 dark:text-blue-400 mr-1.5 tabular-nums">
                            {qIndex + 1}.
                          </span>
                          {q.question}
                        </h4>

                        {isSubmitted && (
                          <span className="text-xs font-semibold shrink-0">
                            {isCorrect ? (
                              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                <CheckCircle className="w-3.5 h-3.5" /> Дуруст
                              </span>
                            ) : (
                              <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                                <XCircle className="w-3.5 h-3.5" /> Хато
                              </span>
                            )}
                          </span>
                        )}
                      </div>

                      {/* Options */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.options.map((opt, optIndex) => {
                          const optionLetter = ['А', 'Б', 'В', 'Г'][optIndex];
                          const isThisSelected = selected === optIndex;
                          const isThisCorrect = optIndex === q.correctIndex;

                          let borderClass = 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-400';

                          if (isSubmitted) {
                            if (isThisCorrect) {
                              borderClass = 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-950 dark:text-emerald-200 font-bold';
                            } else if (isThisSelected && !isThisCorrect) {
                              borderClass = 'border-rose-400 bg-rose-50/50 dark:bg-rose-950/30 text-rose-950 dark:text-rose-200';
                            }
                          } else if (isThisSelected) {
                            borderClass = 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200 font-bold';
                          }

                          return (
                            <button
                              key={optIndex}
                              type="button"
                              disabled={isSubmitted}
                              onClick={() => handleSelectOption(qIndex, optIndex)}
                              className={`text-left p-3 rounded-lg border text-xs font-medium flex items-center gap-2.5 transition ${borderClass}`}
                            >
                              <span className="w-5 h-5 rounded flex items-center justify-center font-bold text-[11px] bg-slate-100 dark:bg-slate-700 shrink-0">
                                {optionLetter}
                              </span>
                              <span className="flex-1">{opt}</span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      {isSubmitted && q.explanation && (
                        <div className="mt-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300">
                          <strong className="block text-slate-900 dark:text-white mb-0.5">Шарҳи дурустӣ:</strong>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Action Bar */}
              {!isSubmitted ? (
                <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Интихобшуда: {Object.keys(userAnswers).length} аз {currentQuiz.questions.length}
                  </span>
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(userAnswers).length === 0}
                    className="py-2 px-5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-40"
                  >
                    Санҷиш ва баҳодиҳӣ
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="my-auto py-24 text-center text-slate-400 space-y-2">
              <HelpCircle className="w-10 h-10 stroke-1 text-slate-300 dark:text-slate-700 mx-auto" />
              <p className="text-xs max-w-sm mx-auto">
                Мавзӯъ ва миқдори саволҳоро интихоб намуда, тугмаи «Сохтани тест бо AI»-ро пахш кунед.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
