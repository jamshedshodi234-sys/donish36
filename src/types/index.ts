export type UserRole = 'teacher' | 'student' | 'guest';

export interface User {
  id: string;
  fullName: string;
  phone: string; // +992 XX XXX XX XX
  login: string;
  role: UserRole;
  school?: string;
  grade?: string;
  subject?: string;
  createdAt: string;
}

export type AppLanguage = 'tg' | 'ru' | 'en';

export interface SubjectItem {
  id: string;
  nameTg: string;
  nameRu: string;
  nameEn: string;
  category: 'exact' | 'humanitarian' | 'natural' | 'special';
  icon: string;
}

export interface LessonPlan {
  id: string;
  topic: string;
  subject: string;
  grade: string;
  duration: string;
  educationalGoal: string;
  upbringingGoal: string;
  developmentalGoal: string;
  expectedResults: string[];
  requiredMaterials: string[];
  stages: {
    organizational: string;
    homeworkReview: string;
    newTopicExplanation: string;
    practicalExercises: string;
    consolidation: string;
    assessment: string;
    homeworkAssignment: string;
    conclusion: string;
  };
  additionalNotes?: string;
  createdAt: string;
  rawResponse?: string;
}

export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  grade: string;
  questions: QuizQuestion[];
  createdAt: string;
}

export interface OralQuestionGroup {
  level: 'easy' | 'medium' | 'hard';
  levelNameTg: string;
  questions: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  subject?: string;
  grade?: string;
}

export interface StudentEvaluation {
  id: string;
  subject: string;
  topic: string;
  question: string;
  studentAnswer: string;
  strengths: string[];
  mistakes: string[];
  recommendations: string[];
  suggestedGrade: string; // e.g., "5 (Аъло)", "4 (Хуб)", "3 (Қаноатбахш)"
  pedagogicalAdvice: string;
  createdAt: string;
}

export interface ScheduleItem {
  id: string;
  dayOfWeek: string; // Душанбе, Сешанбе, etc.
  lessonNumber: number;
  subject: string;
  grade: string;
  room?: string;
  time?: string;
}
