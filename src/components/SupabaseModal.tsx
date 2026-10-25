import React, { useState, useEffect } from 'react';
import { 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  X, 
  ExternalLink, 
  RefreshCw, 
  Key, 
  Globe, 
  ShieldCheck,
  TableProperties
} from 'lucide-react';
import { 
  DEFAULT_SUPABASE_ANON_KEY, 
  getSupabaseConfig, 
  setSupabaseConfig, 
  testSupabaseConnection 
} from '../services/supabaseClient';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SUPABASE_SQL_CODE = `-- ====================================================================
-- ЛОИҲАИ «ОМӮЗГОРИ ҲУШМАНД — AI ЁВАР»
-- Муаллиф: Ярахмадов Аличон (Синфи 11 «г», МТМУ №36, н. Шоҳмансур)
-- Озмуни ҷумҳуриявии «Идеяи ман — калиди фардо»
--
-- Скрипти комилан бехатар ва ислоҳшуда барои Supabase Database
-- Бо иловаи худкори сутунҳо (ALTER TABLE ADD COLUMN IF NOT EXISTS)
-- Калиди API: sb_publishable_i4hWnM0uIuB12-s1eKYdag_YVwhSl9t
-- ====================================================================

-- 1. Васеъшавии UUID ва pgcrypto
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Ҷадвали Профилҳо (Profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT
);

-- Таъмини ID-и худкор (ҳалли хатогии null value in column "id")
ALTER TABLE public.profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Иловаи сутунҳо агар ҷадвал қаблан сохта шуда бошад
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS login TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'teacher';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS school TEXT DEFAULT 'МТМУ №36 ш. Душанбе';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS grade TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS subject TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW());

-- 3. Ҷадвали Нақшаи дарсҳо (Lesson Plans)
CREATE TABLE IF NOT EXISTS public.lesson_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic TEXT,
    subject TEXT,
    grade TEXT
);

ALTER TABLE public.lesson_plans ADD COLUMN IF NOT EXISTS topic TEXT;
ALTER TABLE public.lesson_plans ADD COLUMN IF NOT EXISTS subject TEXT;
ALTER TABLE public.lesson_plans ADD COLUMN IF NOT EXISTS grade TEXT;
ALTER TABLE public.lesson_plans ADD COLUMN IF NOT EXISTS duration TEXT DEFAULT '45 дақиқа';
ALTER TABLE public.lesson_plans ADD COLUMN IF NOT EXISTS educational_goal TEXT;
ALTER TABLE public.lesson_plans ADD COLUMN IF NOT EXISTS upbringing_goal TEXT;
ALTER TABLE public.lesson_plans ADD COLUMN IF NOT EXISTS developmental_goal TEXT;
ALTER TABLE public.lesson_plans ADD COLUMN IF NOT EXISTS expected_results JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.lesson_plans ADD COLUMN IF NOT EXISTS required_materials JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.lesson_plans ADD COLUMN IF NOT EXISTS stages JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.lesson_plans ADD COLUMN IF NOT EXISTS raw_response TEXT;
ALTER TABLE public.lesson_plans ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW());

-- 4. Ҷадвали Санҷишҳои тестӣ (Quizzes)
CREATE TABLE IF NOT EXISTS public.quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT,
    subject TEXT,
    grade TEXT
);

ALTER TABLE public.quizzes ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.quizzes ADD COLUMN IF NOT EXISTS subject TEXT;
ALTER TABLE public.quizzes ADD COLUMN IF NOT EXISTS grade TEXT;
ALTER TABLE public.quizzes ADD COLUMN IF NOT EXISTS questions JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.quizzes ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW());

-- 5. Ҷадвали Натиҷаҳои тестҳо
CREATE TABLE IF NOT EXISTS public.quiz_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID,
    student_name TEXT,
    score INT,
    total_questions INT
);

ALTER TABLE public.quiz_submissions ADD COLUMN IF NOT EXISTS quiz_id UUID;
ALTER TABLE public.quiz_submissions ADD COLUMN IF NOT EXISTS student_name TEXT;
ALTER TABLE public.quiz_submissions ADD COLUMN IF NOT EXISTS score INT;
ALTER TABLE public.quiz_submissions ADD COLUMN IF NOT EXISTS total_questions INT;
ALTER TABLE public.quiz_submissions ADD COLUMN IF NOT EXISTS answers JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.quiz_submissions ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW());

-- 6. Ҷадвали Таърихи муколама бо AI
CREATE TABLE IF NOT EXISTS public.chat_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role TEXT,
    content TEXT
);

ALTER TABLE public.chat_history ADD COLUMN IF NOT EXISTS role TEXT;
ALTER TABLE public.chat_history ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE public.chat_history ADD COLUMN IF NOT EXISTS subject TEXT;
ALTER TABLE public.chat_history ADD COLUMN IF NOT EXISTS grade TEXT;
ALTER TABLE public.chat_history ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW());

-- 7. Ҷадвали Ҷадвали дарсҳои ҳафтаина
CREATE TABLE IF NOT EXISTS public.weekly_schedule (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    day_name TEXT,
    day_index INT,
    subject TEXT,
    grade TEXT
);

ALTER TABLE public.weekly_schedule ADD COLUMN IF NOT EXISTS day_name TEXT;
ALTER TABLE public.weekly_schedule ADD COLUMN IF NOT EXISTS day_index INT;
ALTER TABLE public.weekly_schedule ADD COLUMN IF NOT EXISTS subject TEXT;
ALTER TABLE public.weekly_schedule ADD COLUMN IF NOT EXISTS grade TEXT;
ALTER TABLE public.weekly_schedule ADD COLUMN IF NOT EXISTS room TEXT DEFAULT 'Синфи 204';
ALTER TABLE public.weekly_schedule ADD COLUMN IF NOT EXISTS start_time TEXT;
ALTER TABLE public.weekly_schedule ADD COLUMN IF NOT EXISTS end_time TEXT;
ALTER TABLE public.weekly_schedule ADD COLUMN IF NOT EXISTS teacher_name TEXT DEFAULT 'Ярахмадов Аличон';
ALTER TABLE public.weekly_schedule ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW());

-- 8. Ҷадвали Маводҳои методии иловагӣ
CREATE TABLE IF NOT EXISTS public.educational_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT,
    subject TEXT,
    grade TEXT
);

ALTER TABLE public.educational_materials ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.educational_materials ADD COLUMN IF NOT EXISTS subject TEXT;
ALTER TABLE public.educational_materials ADD COLUMN IF NOT EXISTS grade TEXT;
ALTER TABLE public.educational_materials ADD COLUMN IF NOT EXISTS material_type TEXT;
ALTER TABLE public.educational_materials ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE public.educational_materials ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW());

-- ====================================================================
-- СИЁСАТҲОИ АМНИЯТӢ (ROW LEVEL SECURITY - RLS)
-- ====================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.educational_materials ENABLE ROW LEVEL SECURITY;

-- Пешгирӣ аз хатогии такрори сиёсатҳо
DROP POLICY IF EXISTS "Дастрасии умумӣ ба profiles" ON public.profiles;
CREATE POLICY "Дастрасии умумӣ ба profiles" ON public.profiles FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Дастрасии умумӣ ба lesson_plans" ON public.lesson_plans;
CREATE POLICY "Дастрасии умумӣ ба lesson_plans" ON public.lesson_plans FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Дастрасии умумӣ ба quizzes" ON public.quizzes;
CREATE POLICY "Дастрасии умумӣ ба quizzes" ON public.quizzes FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Дастрасии умумӣ ба quiz_submissions" ON public.quiz_submissions;
CREATE POLICY "Дастрасии умумӣ ба quiz_submissions" ON public.quiz_submissions FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Дастрасии умумӣ ба chat_history" ON public.chat_history;
CREATE POLICY "Дастрасии умумӣ ба chat_history" ON public.chat_history FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Дастрасии умумӣ ба weekly_schedule" ON public.weekly_schedule;
CREATE POLICY "Дастрасии умумӣ ба weekly_schedule" ON public.weekly_schedule FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Дастрасии умумӣ ба educational_materials" ON public.educational_materials;
CREATE POLICY "Дастрасии умумӣ ба educational_materials" ON public.educational_materials FOR ALL TO anon, authenticated USING (true) WITH CHECK (true);

-- Маълумоти намунавӣ барои намоиши озмун (бо санҷиш ва тавлиди ID)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE full_name = 'Ярахмадов Аличон') THEN
    INSERT INTO public.profiles (id, full_name, phone, login, role, school, grade, subject)
    VALUES (
      gen_random_uuid(),
      'Ярахмадов Аличон',
      '+992 90 000 0001',
      'alijon_admin',
      'teacher',
      'МТМУ №36 ш. Душанбе',
      '11 «г»',
      'Информатика'
    );
  END IF;
EXCEPTION
  WHEN OTHERS THEN
    NULL;
END $$;
`;

export const SupabaseModal: React.FC<SupabaseModalProps> = ({ isOpen, onClose }) => {
  const [projectUrl, setProjectUrl] = useState('');
  const [anonKey, setAnonKey] = useState(DEFAULT_SUPABASE_ANON_KEY);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [activeTab, setActiveTab] = useState<'sql' | 'settings' | 'guide'>('sql');

  useEffect(() => {
    if (isOpen) {
      const config = getSupabaseConfig();
      setProjectUrl(config.url || '');
      setAnonKey(config.key || DEFAULT_SUPABASE_ANON_KEY);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveAndTest = async () => {
    setIsTesting(true);
    setTestResult(null);

    setSupabaseConfig(projectUrl.trim(), anonKey.trim());

    const res = await testSupabaseConnection();
    setTestResult(res);
    setIsTesting(false);
  };

  const copyToClipboard = (text: string, type: 'sql' | 'key') => {
    navigator.clipboard.writeText(text);
    if (type === 'sql') {
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2000);
    } else {
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">Supabase Cloud Database</span>
                <span>·</span>
                <span>PostgreSQL & RLS</span>
              </div>
              <h2 className="text-lg font-bold text-slate-950 dark:text-white">
                Пайвастшавӣ ва коди ҷадвалҳои Supabase
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('sql')}
            className={`flex items-center gap-2 py-2.5 px-4 text-xs font-bold border-b-2 transition ${
              activeTab === 'sql'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <TableProperties className="w-4 h-4" />
            Коди пурраи SQL (7 Ҷадвал)
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 py-2.5 px-4 text-xs font-bold border-b-2 transition ${
              activeTab === 'settings'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Key className="w-4 h-4" />
            Танзимот ва калиди API
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 py-2.5 px-4 text-xs font-bold border-b-2 transition ${
              activeTab === 'guide'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Дастури пайвастшавӣ
          </button>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'sql' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Ҷадвалҳои омодаи таълимӣ барои Supabase SQL Editor</span>
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Ин коди SQL-ро нусхабардорӣ намуда, дар панели <strong>SQL Editor</strong>-и Supabase иҷро (Run) намоед.
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(SUPABASE_SQL_CODE, 'sql')}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 transition shrink-0 shadow-xs"
                >
                  {copiedSql ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSql ? 'Нусха шуд!' : 'Нусхабардории коди SQL'}</span>
                </button>
              </div>

              {/* Code viewer */}
              <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-200 text-xs font-mono">
                <div className="flex items-center justify-between px-4 py-2 bg-slate-900/80 border-b border-slate-800 text-[11px] text-slate-400">
                  <span>supabase_schema.sql (PostgreSQL DDL + RLS Policies)</span>
                  <span className="text-emerald-400">7 Ҷадвал + 7 Сиёсати амниятӣ</span>
                </div>
                <pre className="p-4 overflow-x-auto max-h-[380px] leading-relaxed text-[11.5px]">
                  {SUPABASE_SQL_CODE}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              {/* API Key Status */}
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/80 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Калиди API ворид ва пайваст карда шуд:</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(anonKey, 'key')}
                    className="text-xs text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 font-semibold"
                  >
                    {copiedKey ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey ? 'Нусха шуд' : 'Нусхаи калид'}</span>
                  </button>
                </div>
                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-emerald-200 dark:border-emerald-900 font-mono text-xs text-slate-800 dark:text-slate-200 break-all select-all">
                  {anonKey}
                </div>
              </div>

              {/* Project URL Configuration */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    URL-и лоиҳаи Supabase (Project URL)
                  </label>
                  <p className="text-xs text-slate-500 mb-2">
                    Аз панели Supabase (Project Settings → API → Project URL) нусхабардорӣ кунед.
                  </p>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Globe className="w-4 h-4" />
                    </div>
                    <input
                      type="url"
                      value={projectUrl}
                      onChange={(e) => setProjectUrl(e.target.value)}
                      placeholder="https://xyzabcdefghijklmnop.supabase.co"
                      className="w-full pl-9 pr-3 py-2.5 text-xs font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                  <button
                    onClick={handleSaveAndTest}
                    disabled={isTesting}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-xs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                    <span>{isTesting ? 'Санҷида истодааст...' : 'Сабти URL ва Санҷиши пайвастшавӣ'}</span>
                  </button>
                  <a
                    href="https://supabase.com/dashboard"
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                  >
                    <span>Кушодани панели Supabase</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Test Result Message */}
                {testResult && (
                  <div
                    className={`p-3.5 rounded-xl border text-xs flex items-start gap-2.5 animate-in fade-in ${
                      testResult.success
                        ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                        : 'bg-amber-50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300'
                    }`}
                  >
                    {testResult.success ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                    )}
                    <span className="leading-relaxed">{testResult.message}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Қадамҳои пайваст намудани ҷадвалҳо ба пойгоҳи Supabase:
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                    1
                  </div>
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white">Воридшавӣ ба Supabase</h5>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Ба сомонаи <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-blue-600 underline">supabase.com</a> ворид шавед ва лоиҳаи худро интихоб кунед.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                    2
                  </div>
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white">Иҷрои коди SQL</h5>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Дар менюи чап ба <strong>SQL Editor</strong> гузаред, коди SQL-и ҷадвалҳоро часпонед (Paste) ва тугмаи сабзи <strong>RUN</strong>-ро пахш намоед.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-800/40 space-y-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                    3
                  </div>
                  <h5 className="font-bold text-xs text-slate-900 dark:text-white">Гирифтани URL</h5>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Аз <strong>Project Settings → API</strong> сатри <strong>Project URL</strong>-ро нусхабардорӣ карда, дар ин ҷо сабт намоед.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 px-6 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between text-xs text-slate-500">
          <span>Калиди фаъол: <code className="font-mono text-emerald-600 dark:text-emerald-400">sb_publishable_i4hWnM0u...</code></span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold transition"
          >
            Пӯшидан
          </button>
        </div>
      </div>
    </div>
  );
};
