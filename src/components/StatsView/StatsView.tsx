import React from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3, Clock, Sparkles, BookOpen, Award, CheckCircle2, TrendingUp, Users } from 'lucide-react';

export const StatsView: React.FC = () => {
  const { stats, savedPlans, savedQuizzes, savedEvaluations } = useApp();

  const totalPlans = savedPlans.length > stats.plansGenerated ? savedPlans.length : stats.plansGenerated;
  const totalQuizzes = savedQuizzes.length > stats.quizzesCreated ? savedQuizzes.length : stats.quizzesCreated;
  const hoursSaved = Math.round(totalPlans * 1.5 + totalQuizzes * 0.8 + stats.materialsCreated * 0.5);

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="space-y-1 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span>Нишондиҳандаҳои таълимӣ</span>
          <span aria-hidden="true">·</span>
          <span>Самаранокии низом</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">
          Омори истифода ва сарфаи вақт
        </h1>
        <p className="text-xs text-slate-500">
          Таҳлили ҳаҷми маводи таҳияшуда ва сарфаи соатҳои кории омӯзгорону хонандагон.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-blue-600 dark:text-blue-400">
            <span className="text-xs font-bold uppercase tracking-wider">Нақшаҳои дарс</span>
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">
            {totalPlans}
          </div>
          <p className="text-[11px] text-slate-500">Мутобиқи 14 марҳилаи Вазорати маориф</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <span className="text-xs font-bold uppercase tracking-wider">Тестҳои санҷидашуда</span>
            <Award className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">
            {totalQuizzes}
          </div>
          <p className="text-[11px] text-slate-500">Бо 4 вариант ва ҳисоби фаврии баҳо</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400">
            <span className="text-xs font-bold uppercase tracking-wider">Дархостҳои Gemini AI</span>
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">
            {stats.aiQueriesSolved}
          </div>
          <p className="text-[11px] text-slate-500">Тавзеҳи формулаҳо ва посухи илмӣ</p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-amber-600 dark:text-amber-400">
            <span className="text-xs font-bold uppercase tracking-wider">Вақти сарфашуда</span>
            <Clock className="w-5 h-5" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">
            ~{hoursSaved} соат
          </div>
          <p className="text-[11px] text-slate-500">Аз корҳои такрории коғазӣ озод карда шуд</p>
        </div>
      </div>

      {/* Details Box */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-base flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-600" />
            Тақсимоти истифода аз рӯйи соҳаҳо
          </h3>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span>Илмҳои дақиқ (Алгебра, Геометрия, Математика)</span>
                <span className="font-bold">42%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '42%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span>Илмҳои табиатшиносӣ (Физика, Химия, Биология)</span>
                <span className="font-bold">31%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: '31%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span>Фанҳои гуманитарӣ (Забони тоҷикӣ, Адабиёт, Забонҳо)</span>
                <span className="font-bold">18%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: '18%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1">
                <span>Информатика ва технологияҳои иттилоотӣ</span>
                <span className="font-bold">9%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '9%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-base flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-600" />
            Самаранокии иҷтимоӣ ва педагогӣ
          </h3>

          <ul className="space-y-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Барои омӯзгорон:</strong> Имкон медиҳад, ки ба ҷойи навиштани якранги коғазҳо, вақти бештарро ба муоширати зинда ва тарбияи шогирдон равона созанд.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Барои хонандагон:</strong> Тарси масъалаҳои мураккабро коҳиш дода, ба омӯзиши мустақилонаи илмҳои дақиқ илҳом мебахшад.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Барои муассисаҳои таълимӣ:</strong> Қадами бузург дар самти татбиқи консепсияи маорифи рақамии Ҷумҳурии Тоҷикистон.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
