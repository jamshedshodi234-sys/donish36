import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppLanguage, LessonPlan, Quiz, StudentEvaluation, ScheduleItem } from '../types';
import { checkServerHealth } from '../services/api';
import { 
  syncSaveLessonPlan, 
  syncSaveQuiz, 
  syncGetLessonPlans, 
  syncGetQuizzes, 
  getSupabaseConfig 
} from '../services/supabaseClient';

export type MainTab =
  | 'home'
  | 'teacher'
  | 'student'
  | 'chat'
  | 'demo'
  | 'schedule'
  | 'docs'
  | 'stats';

export type TeacherSubTab =
  | 'lesson-plan'
  | 'quiz'
  | 'oral-questions'
  | 'materials'
  | 'student-evaluator';

export type StudentSubTab =
  | 'topic-explainer'
  | 'math-solver'
  | 'physics-chemistry'
  | 'language-lit'
  | 'exam-prep';

interface AppContextType {
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
  teacherTab: TeacherSubTab;
  setTeacherTab: (tab: TeacherSubTab) => void;
  studentTab: StudentSubTab;
  setStudentTab: (tab: StudentSubTab) => void;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isServerConnected: boolean;
  hasGeminiKey: boolean;
  refreshServerStatus: () => Promise<void>;
  // Saved data
  savedPlans: LessonPlan[];
  saveLessonPlan: (plan: LessonPlan) => void;
  deleteLessonPlan: (id: string) => void;
  savedQuizzes: Quiz[];
  saveQuiz: (quiz: Quiz) => void;
  deleteQuiz: (id: string) => void;
  savedEvaluations: StudentEvaluation[];
  saveEvaluation: (evalItem: StudentEvaluation) => void;
  weeklySchedule: ScheduleItem[];
  setWeeklySchedule: React.Dispatch<React.SetStateAction<ScheduleItem[]>>;
  stats: {
    plansGenerated: number;
    quizzesCreated: number;
    aiQueriesSolved: number;
    materialsCreated: number;
  };
  incrementStat: (key: 'plansGenerated' | 'quizzesCreated' | 'aiQueriesSolved' | 'materialsCreated') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [teacherTab, setTeacherTab] = useState<TeacherSubTab>('lesson-plan');
  const [studentTab, setStudentTab] = useState<StudentSubTab>('topic-explainer');
  const [language, setLanguage] = useState<AppLanguage>('tg');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isServerConnected, setIsServerConnected] = useState<boolean>(true);
  const [hasGeminiKey, setHasGeminiKey] = useState<boolean>(true);

  const [savedPlans, setSavedPlans] = useState<LessonPlan[]>(() => {
    try {
      const data = localStorage.getItem('smart_teacher_plans');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });

  const [savedQuizzes, setSavedQuizzes] = useState<Quiz[]>(() => {
    try {
      const data = localStorage.getItem('smart_teacher_quizzes');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });

  const [savedEvaluations, setSavedEvaluations] = useState<StudentEvaluation[]>(() => {
    try {
      const data = localStorage.getItem('smart_teacher_evals');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  });

  const [weeklySchedule, setWeeklySchedule] = useState<ScheduleItem[]>(() => {
    try {
      const data = localStorage.getItem('smart_teacher_schedule');
      if (data) return JSON.parse(data);
      // default sample schedule for schools in Tajikistan
      return [
        { id: '1', dayOfWeek: 'Душанбе', lessonNumber: 1, subject: 'Алгебра', grade: 'Синфи 8', room: '204', time: '08:00 - 08:45' },
        { id: '2', dayOfWeek: 'Душанбе', lessonNumber: 2, subject: 'Физика', grade: 'Синфи 9', room: '108', time: '08:50 - 09:35' },
        { id: '3', dayOfWeek: 'Душанбе', lessonNumber: 3, subject: 'Забони тоҷикӣ', grade: 'Синфи 7', room: '312', time: '09:45 - 10:30' },
        { id: '4', dayOfWeek: 'Сешанбе', lessonNumber: 1, subject: 'Геометрия', grade: 'Синфи 8', room: '204', time: '08:00 - 08:45' },
        { id: '5', dayOfWeek: 'Сешанбе', lessonNumber: 2, subject: 'Информатика', grade: 'Синфи 10', room: 'Синфхонаи компютерӣ', time: '08:50 - 09:35' },
        { id: '6', dayOfWeek: 'Чоршанбе', lessonNumber: 1, subject: 'Химия', grade: 'Синфи 9', room: 'Лаборатория', time: '08:00 - 08:45' },
      ];
    } catch {
      return [];
    }
  });

  const [stats, setStats] = useState<{
    plansGenerated: number;
    quizzesCreated: number;
    aiQueriesSolved: number;
    materialsCreated: number;
  }>(() => {
    try {
      const data = localStorage.getItem('smart_teacher_stats');
      return data ? JSON.parse(data) : { plansGenerated: 14, quizzesCreated: 8, aiQueriesSolved: 42, materialsCreated: 19 };
    } catch {
      return { plansGenerated: 14, quizzesCreated: 8, aiQueriesSolved: 42, materialsCreated: 19 };
    }
  });

  const refreshServerStatus = async () => {
    const health = await checkServerHealth();
    setIsServerConnected(health.ok);
    setHasGeminiKey(health.hasGeminiKey);
  };

  useEffect(() => {
    refreshServerStatus();

    // Check if Supabase is configured and sync remote data
    const config = getSupabaseConfig();
    if (config.isConfigured) {
      syncGetLessonPlans().then((remotePlans) => {
        if (remotePlans && remotePlans.length > 0) {
          setSavedPlans((prev) => {
            const ids = new Set(prev.map((p) => p.id));
            const merged = [...prev];
            remotePlans.forEach((rp) => {
              if (!ids.has(rp.id)) merged.push(rp);
            });
            return merged;
          });
        }
      });

      syncGetQuizzes().then((remoteQuizzes) => {
        if (remoteQuizzes && remoteQuizzes.length > 0) {
          setSavedQuizzes((prev) => {
            const ids = new Set(prev.map((q) => q.id));
            const merged = [...prev];
            remoteQuizzes.forEach((rq) => {
              if (!ids.has(rq.id)) merged.push(rq);
            });
            return merged;
          });
        }
      });
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('smart_teacher_plans', JSON.stringify(savedPlans));
    } catch (e) {
      console.error(e);
    }
  }, [savedPlans]);

  useEffect(() => {
    try {
      localStorage.setItem('smart_teacher_quizzes', JSON.stringify(savedQuizzes));
    } catch (e) {
      console.error(e);
    }
  }, [savedQuizzes]);

  useEffect(() => {
    try {
      localStorage.setItem('smart_teacher_evals', JSON.stringify(savedEvaluations));
    } catch (e) {
      console.error(e);
    }
  }, [savedEvaluations]);

  useEffect(() => {
    try {
      localStorage.setItem('smart_teacher_schedule', JSON.stringify(weeklySchedule));
    } catch (e) {
      console.error(e);
    }
  }, [weeklySchedule]);

  useEffect(() => {
    try {
      localStorage.setItem('smart_teacher_stats', JSON.stringify(stats));
    } catch (e) {
      console.error(e);
    }
  }, [stats]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const saveLessonPlan = (plan: LessonPlan) => {
    setSavedPlans((prev) => [plan, ...prev.filter((p) => p.id !== plan.id)]);
    incrementStat('plansGenerated');
    syncSaveLessonPlan(plan);
  };

  const deleteLessonPlan = (id: string) => {
    setSavedPlans((prev) => prev.filter((p) => p.id !== id));
  };

  const saveQuiz = (quiz: Quiz) => {
    setSavedQuizzes((prev) => [quiz, ...prev.filter((q) => q.id !== quiz.id)]);
    incrementStat('quizzesCreated');
    syncSaveQuiz(quiz);
  };

  const deleteQuiz = (id: string) => {
    setSavedQuizzes((prev) => prev.filter((q) => q.id !== id));
  };

  const saveEvaluation = (evalItem: StudentEvaluation) => {
    setSavedEvaluations((prev) => [evalItem, ...prev]);
  };

  const incrementStat = (key: 'plansGenerated' | 'quizzesCreated' | 'aiQueriesSolved' | 'materialsCreated') => {
    setStats((prev) => ({
      ...prev,
      [key]: prev[key] + 1,
    }));
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        teacherTab,
        setTeacherTab,
        studentTab,
        setStudentTab,
        language,
        setLanguage,
        theme,
        toggleTheme,
        isServerConnected,
        hasGeminiKey,
        refreshServerStatus,
        savedPlans,
        saveLessonPlan,
        deleteLessonPlan,
        savedQuizzes,
        saveQuiz,
        deleteQuiz,
        savedEvaluations,
        saveEvaluation,
        weeklySchedule,
        setWeeklySchedule,
        stats,
        incrementStat,
      }}
    >
      <div className={theme === 'dark' ? 'dark bg-slate-950 text-slate-100 min-h-screen' : 'bg-slate-50 text-slate-800 min-h-screen'}>
        {children}
      </div>
    </AppContext.Provider>
  );
};

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
