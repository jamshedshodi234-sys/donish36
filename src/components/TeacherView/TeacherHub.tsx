import React from 'react';
import { useApp } from '../../context/AppContext';
import { LessonPlanGenerator } from './LessonPlanGenerator';
import { QuizGenerator } from './QuizGenerator';
import { OralQuestionsGenerator } from './OralQuestionsGenerator';
import { MaterialsGenerator } from './MaterialsGenerator';
import { StudentEvaluator } from './StudentEvaluator';
import {
  FileText,
  HelpCircle,
  MessageCircleQuestion,
  FileStack,
  CheckSquare,
} from 'lucide-react';

export const TeacherHub: React.FC = () => {
  const { teacherTab, setTeacherTab } = useApp();

  const subTabs = [
    { id: 'lesson-plan', label: 'Нақшаи дарс', icon: <FileText className="w-4 h-4" /> },
    { id: 'quiz', label: 'Сохтани тест', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'oral-questions', label: 'Саволҳои шифоҳӣ', icon: <MessageCircleQuestion className="w-4 h-4" /> },
    { id: 'materials', label: 'Таҳияи маводи таълимӣ', icon: <FileStack className="w-4 h-4" /> },
    { id: 'student-evaluator', label: 'Арзёбии ҷавоби хонанда', icon: <CheckSquare className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="space-y-1 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span>Бахши касбии омӯзгор</span>
          <span aria-hidden="true">·</span>
          <span>Методикаи Вазорати маориф ва илми ҶТ</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">
          Ёвари методии омӯзгор
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Абзорҳои худкор барои таҳияи нақшаи дарс, тестҳои 4-варианта, саволҳои шифоҳӣ ва маводи дидактикӣ.
        </p>
      </div>

      {/* Segmented Filter Control (No pills, clean button state) */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200/60 dark:border-slate-800/60 no-print">
        {subTabs.map((tab) => {
          const isActive = teacherTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setTeacherTab(tab.id as any)}
              className={`flex items-center gap-2 py-2 px-3.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-white dark:bg-slate-800 text-blue-700 dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Sub-module */}
      <div>
        {teacherTab === 'lesson-plan' && <LessonPlanGenerator />}
        {teacherTab === 'quiz' && <QuizGenerator />}
        {teacherTab === 'oral-questions' && <OralQuestionsGenerator />}
        {teacherTab === 'materials' && <MaterialsGenerator />}
        {teacherTab === 'student-evaluator' && <StudentEvaluator />}
      </div>
    </div>
  );
};
