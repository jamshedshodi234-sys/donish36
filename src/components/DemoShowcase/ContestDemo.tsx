import React, { useState } from 'react';
import { DEMO_SCENARIOS } from '../../data/subjects';
import { generateWithAI, generateStructuredAI } from '../../services/api';
import { QuizQuestion } from '../../types';
import {
  ArrowRight,
  RotateCcw,
  Check,
  X,
  FileText,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

export const ContestDemo: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState(DEMO_SCENARIOS[0]);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState('');
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [score, setScore] = useState<number | null>(null);
  const [isEvaluatingMistakes, setIsEvaluatingMistakes] = useState(false);
  const [aiFeedback, setAiFeedback] = useState('');

  const handleGeneratePlan = async () => {
    setIsGeneratingPlan(true);
    const prompt = `Шумо бояд нақшаи мукаммали дарсро барои озмуни ҷумҳуриявии «Идеяи ман — калиди фардо» аз фанни ${selectedScenario.subject} барои ${selectedScenario.grade} аз рӯйи мавзӯи «${selectedScenario.topic}» омода кунед.
Нақша дорои 14 марҳилаи расмии методӣ буда, бояд формулаҳо, мақсадҳо ва ҷараёни дарсро дарбар гирад.`;

    const res = await generateWithAI({
      prompt,
      systemInstruction: 'Шумо мутахассиси олии маорифи Тоҷикистон ҳастед.',
    });

    setIsGeneratingPlan(false);
    if (res.success && res.text) {
      setGeneratedPlan(res.text);
      setActiveStep(2);
    }
  };

  const handleGenerateQuiz = async () => {
    setIsGeneratingQuiz(true);
    const prompt = `Барои мавзӯи «${selectedScenario.topic}» (${selectedScenario.subject}, ${selectedScenario.grade}) 5 саволи тестии 4-варианта таҳия кунед.
Баргардонед JSON:
{
  "questions": [
    {
      "id": 1,
      "question": "Савол",
      "options": ["А", "Б", "В", "Г"],
      "correctIndex": 0,
      "explanation": "Шарҳи илмӣ"
    }
  ]
}`;

    const res = await generateStructuredAI<{ questions: QuizQuestion[] }>({
      prompt,
      systemInstruction: 'Тестҳои стандартии Маркази миллии тестии Тоҷикистон бо 4 вариант ва шарҳи пурра.',
    });

    setIsGeneratingQuiz(false);
    if (res.success && res.data?.questions) {
      setQuizQuestions(res.data.questions);
      setActiveStep(3);
    }
  };

  const handleSelectAnswer = (qIndex: number, optIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [qIndex]: optIndex,
    }));
  };

  const handleFinishQuiz = async () => {
    let s = 0;
    const mistakesDetails: string[] = [];

    quizQuestions.forEach((q, idx) => {
      const selected = userAnswers[idx];
      if (selected === q.correctIndex) {
        s++;
      } else {
        const userChoice = selected !== undefined ? q.options[selected] : 'Ҷавоб надодааст';
        const correctChoice = q.options[q.correctIndex];
        mistakesDetails.push(`Савол: "${q.question}" -> Хонанда: "${userChoice}", Дуруст: "${correctChoice}"`);
      }
    });

    setScore(s);
    setActiveStep(4);

    setIsEvaluatingMistakes(true);
    const feedbackPrompt = `Дар озмуни ҷумҳуриявӣ хонанда тестро аз рӯйи мавзӯи «${selectedScenario.topic}» супорид ва натиҷаи ${s} аз ${quizQuestions.length} гирифт.
Хатогиҳои хонанда:
${mistakesDetails.join('\n') || 'Ҳамаи ҷавобҳо дурустанд!'}

Шумо ҳамчун Омӯзгори ҳушманд бояд:
1. Ба хонанда табрик ё ташвиқи самимӣ расонед.
2. Сабаби хато шудани ҷавобҳоро бо қоидаву формулаҳо фаҳмонед.
3. Тавсияҳои омӯзишӣ диҳед.`;

    const feedbackRes = await generateWithAI({
      prompt: feedbackPrompt,
      systemInstruction: 'Шумо муаллими меҳрубони тоҷик ҳастед.',
    });

    setIsEvaluatingMistakes(false);
    if (feedbackRes.success && feedbackRes.text) {
      setAiFeedback(feedbackRes.text);
    }
  };

  const handleReset = () => {
    setActiveStep(1);
    setGeneratedPlan('');
    setQuizQuestions([]);
    setUserAnswers({});
    setScore(null);
    setAiFeedback('');
  };

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="space-y-1 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span className="text-blue-700 dark:text-blue-400 font-bold">Озмуни ҷумҳуриявӣ</span>
          <span aria-hidden="true">·</span>
          <span>Сенарияи намоиши 5-дақиқаӣ барои ҳайати ҳакамон</span>
          <span aria-hidden="true">·</span>
          <span>Муаллиф: Ярахмадов Аличон (Синфи 11 г МТМУ №36)</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">
          Намоиши амалии зеҳни сунъӣ
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Силсилаи амалиёти пайдарпайи омӯзгор ва хонанда дар заминаи модели Gemini 3.8 Flash.
        </p>
      </div>

      {/* Scenario Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {DEMO_SCENARIOS.map((sc) => {
          const isSelected = selectedScenario.id === sc.id;
          return (
            <button
              key={sc.id}
              onClick={() => {
                setSelectedScenario(sc);
                handleReset();
              }}
              className={`text-left p-4 rounded-xl border transition-colors ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30'
                  : 'border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 hover:border-slate-300'
              }`}
            >
              <div className="text-[11px] font-semibold text-slate-500 mb-0.5">
                {sc.subject} · {sc.grade}
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                {sc.topic}
              </h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                {sc.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Stage Progression Bar (Editorial indices 01, 02, 03, 04) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-2 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
        {[
          { step: 1, title: '01. Нақшаи дарс' },
          { step: 2, title: '02. Сохтани тест' },
          { step: 3, title: '03. Санҷиши хонанда' },
          { step: 4, title: '04. Таҳлил ва шарҳи AI' },
        ].map((item) => (
          <div
            key={item.step}
            className={`p-2.5 rounded-lg text-xs font-semibold transition-colors ${
              activeStep >= item.step
                ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-xs'
                : 'text-slate-500'
            }`}
          >
            {item.title}
          </div>
        ))}
      </div>

      {/* Main Workspace Stage */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 p-6 sm:p-8 shadow-xs">
        {activeStep === 1 && (
          <div className="space-y-6 text-center max-w-lg mx-auto py-12">
            <div className="space-y-2">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Марҳилаи аввал
              </span>
              <h3 className="text-2xl font-bold text-slate-950 dark:text-white">
                Тавлиди нақшаи расмии дарс
              </h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Фан: <strong>{selectedScenario.subject}</strong> · Синф: <strong>{selectedScenario.grade}</strong>
                <br />
                Мавзӯъ: «{selectedScenario.topic}»
              </p>
            </div>

            <button
              onClick={handleGeneratePlan}
              disabled={isGeneratingPlan}
              className="px-6 py-3 rounded-lg font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white transition flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
            >
              {isGeneratingPlan ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Gemini API дар ҳоли таҳия...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Оғози дархост ба Gemini API</span>
                </>
              )}
            </button>
          </div>
        )}

        {activeStep === 2 && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Нақшаи дарс бо Gemini таҳия шуд
                </div>
                <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                  {selectedScenario.subject}: {selectedScenario.topic}
                </h3>
              </div>

              <button
                onClick={handleGenerateQuiz}
                disabled={isGeneratingQuiz}
                className="px-5 py-2.5 rounded-lg font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white transition flex items-center gap-2"
              >
                {isGeneratingQuiz ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Тавлиди тест...</span>
                  </>
                ) : (
                  <>
                    <span>Гузариш ба сохтани 5 тести санҷишӣ</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs sm:text-sm whitespace-pre-wrap leading-relaxed max-h-[380px] overflow-y-auto font-sans">
              {generatedPlan}
            </div>
          </div>
        )}

        {activeStep === 3 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase">Марҳилаи саволҳо</span>
                <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                  Хонанда ба 5 саволи тестӣ ҷавоб медиҳад
                </h3>
              </div>
              <span className="text-xs text-slate-500">
                Ҷавобҳо: {Object.keys(userAnswers).length} аз {quizQuestions.length}
              </span>
            </div>

            <div className="space-y-4">
              {quizQuestions.map((q, qIndex) => {
                const selected = userAnswers[qIndex];
                return (
                  <div
                    key={q.id || qIndex}
                    className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-800/20 space-y-3"
                  >
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                      <span className="font-bold text-blue-600 mr-1.5 tabular-nums">{qIndex + 1}.</span>
                      {q.question}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, optIndex) => {
                        const letter = ['А', 'Б', 'В', 'Г'][optIndex];
                        const isChosen = selected === optIndex;
                        return (
                          <button
                            key={optIndex}
                            onClick={() => handleSelectAnswer(qIndex, optIndex)}
                            className={`p-2.5 rounded-lg border text-xs text-left flex items-center gap-2 transition ${
                              isChosen
                                ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 font-bold'
                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <span className="w-5 h-5 rounded flex items-center justify-center font-bold text-[10px] bg-slate-100 dark:bg-slate-700 shrink-0">
                              {letter}
                            </span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={handleFinishQuiz}
                disabled={Object.keys(userAnswers).length === 0}
                className="py-2.5 px-6 rounded-lg font-bold text-xs bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-40 flex items-center gap-2"
              >
                <span>Ҷамъбасти тест ва шарҳи хатогиҳо</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {activeStep === 4 && (
          <div className="space-y-6">
            <div className="p-5 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-xl font-bold tracking-tight">
                  Натиҷа: {score} аз {quizQuestions.length} дуруст ({Math.round(((score || 0) / quizQuestions.length) * 100)}%)
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Баҳои тавсиявӣ: {((score || 0) >= 4 ? '5 (Аъло)' : (score || 0) >= 3 ? '4 (Хуб)' : '3 (Қаноатбахш)')}
                </p>
              </div>

              <button
                onClick={handleReset}
                className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Такрори сенария
              </button>
            </div>

            {/* AI Mistake Breakdown */}
            <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Шарҳ ва тавсияи зеҳни сунъӣ (AI) барои хонанда:
              </div>

              {isEvaluatingMistakes ? (
                <div className="py-6 text-center space-y-2">
                  <div className="w-6 h-6 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-slate-500">Зеҳни сунъӣ хатогиҳоро шарҳ дода истодааст...</p>
                </div>
              ) : (
                <div className="text-xs sm:text-sm leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-sans">
                  {aiFeedback || 'Таҳлил бомуваффақият анҷом дода шуд.'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
