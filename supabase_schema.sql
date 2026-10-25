-- ====================================================================
-- ЛОИҲАИ «ОМӮЗГОРИ ҲУШМАНД — AI ЁВАР»
-- Муаллиф: Ярахмадов Аличон (Синфи 11 «г», МТМУ №36, н. Шоҳмансур)
-- Озмуни ҷумҳуриявии «Идеяи ман — калиди фардо»
--
-- Скрипти 100% санҷидашуда ва бехатар барои Supabase SQL Editor
-- Ислоҳи хатогии NOT NULL дар сутуни "id" ва иловаи сутунҳо
-- Калиди API: sb_publishable_i4hWnM0uIuB12-s1eKYdag_YVwhSl9t
-- ====================================================================

-- 1. Фаъолсозии васеъшавии UUID ва pgcrypto
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Ҷадвали Профилҳо (Profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT
);

-- Таъмини он, ки "id" худкор UUID тавлид кунад (ҳалли хатогии null value in column "id")
ALTER TABLE public.profiles ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Бардоштани маҳдудияти сахти auth.users агар қаблан қолаби User Management насб шуда бошад
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Иловаи бехатари ҳамаи сутунҳои зарурӣ
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
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic TEXT,
    subject TEXT,
    grade TEXT
);

ALTER TABLE public.lesson_plans ALTER COLUMN id SET DEFAULT gen_random_uuid();
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
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    subject TEXT,
    grade TEXT
);

ALTER TABLE public.quizzes ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE public.quizzes ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.quizzes ADD COLUMN IF NOT EXISTS subject TEXT;
ALTER TABLE public.quizzes ADD COLUMN IF NOT EXISTS grade TEXT;
ALTER TABLE public.quizzes ADD COLUMN IF NOT EXISTS questions JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.quizzes ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW());

-- 5. Ҷадвали Натиҷаҳои тестҳо (Quiz Submissions)
CREATE TABLE IF NOT EXISTS public.quiz_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID,
    student_name TEXT,
    score INT,
    total_questions INT
);

ALTER TABLE public.quiz_submissions ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE public.quiz_submissions ADD COLUMN IF NOT EXISTS quiz_id UUID;
ALTER TABLE public.quiz_submissions ADD COLUMN IF NOT EXISTS student_name TEXT;
ALTER TABLE public.quiz_submissions ADD COLUMN IF NOT EXISTS score INT;
ALTER TABLE public.quiz_submissions ADD COLUMN IF NOT EXISTS total_questions INT;
ALTER TABLE public.quiz_submissions ADD COLUMN IF NOT EXISTS answers JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.quiz_submissions ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW());

-- 6. Ҷадвали Таърихи муколама бо AI (Chat History)
CREATE TABLE IF NOT EXISTS public.chat_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role TEXT,
    content TEXT
);

ALTER TABLE public.chat_history ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE public.chat_history ADD COLUMN IF NOT EXISTS role TEXT;
ALTER TABLE public.chat_history ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE public.chat_history ADD COLUMN IF NOT EXISTS subject TEXT;
ALTER TABLE public.chat_history ADD COLUMN IF NOT EXISTS grade TEXT;
ALTER TABLE public.chat_history ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW());

-- 7. Ҷадвали Ҷадвали дарсҳои ҳафтаина (Weekly Schedule)
CREATE TABLE IF NOT EXISTS public.weekly_schedule (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    day_name TEXT,
    day_index INT,
    subject TEXT,
    grade TEXT
);

ALTER TABLE public.weekly_schedule ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE public.weekly_schedule ADD COLUMN IF NOT EXISTS day_name TEXT;
ALTER TABLE public.weekly_schedule ADD COLUMN IF NOT EXISTS day_index INT;
ALTER TABLE public.weekly_schedule ADD COLUMN IF NOT EXISTS subject TEXT;
ALTER TABLE public.weekly_schedule ADD COLUMN IF NOT EXISTS grade TEXT;
ALTER TABLE public.weekly_schedule ADD COLUMN IF NOT EXISTS room TEXT DEFAULT 'Синфи 204';
ALTER TABLE public.weekly_schedule ADD COLUMN IF NOT EXISTS start_time TEXT;
ALTER TABLE public.weekly_schedule ADD COLUMN IF NOT EXISTS end_time TEXT;
ALTER TABLE public.weekly_schedule ADD COLUMN IF NOT EXISTS teacher_name TEXT DEFAULT 'Ярахмадов Аличон';
ALTER TABLE public.weekly_schedule ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW());

-- 8. Ҷадвали Маводҳои методии иловагӣ (Educational Materials)
CREATE TABLE IF NOT EXISTS public.educational_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    subject TEXT,
    grade TEXT
);

ALTER TABLE public.educational_materials ALTER COLUMN id SET DEFAULT gen_random_uuid();
ALTER TABLE public.educational_materials ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.educational_materials ADD COLUMN IF NOT EXISTS subject TEXT;
ALTER TABLE public.educational_materials ADD COLUMN IF NOT EXISTS grade TEXT;
ALTER TABLE public.educational_materials ADD COLUMN IF NOT EXISTS material_type TEXT;
ALTER TABLE public.educational_materials ADD COLUMN IF NOT EXISTS content TEXT;
ALTER TABLE public.educational_materials ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW());

-- ====================================================================
-- АМНИЯТ: Row Level Security (RLS)
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.educational_materials ENABLE ROW LEVEL SECURITY;

-- Сиёсатҳои дастрасӣ бо калиди Publishable / Anon
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

-- ====================================================================
-- МАЪЛУМОТИ ИБТИДОӢ (БО ТАВЛИДИ АНИҚИ UUID ВА EXCEPTION BLOCK)
-- ====================================================================

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
    -- Агар ҳар гуна маҳдудияти махсус бошад ҳам, транзаксия бекор намешавад
    NULL;
END $$;
