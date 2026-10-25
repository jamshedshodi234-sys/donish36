import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { LessonPlan, Quiz, ChatMessage } from '../types';

// The user-provided Supabase Publishable / Anon API Key
export const DEFAULT_SUPABASE_ANON_KEY = 'sb_publishable_i4hWnM0uIuB12-s1eKYdag_YVwhSl9t';

// Helper to get active Supabase credentials
export function getSupabaseConfig(): { url: string; key: string; isConfigured: boolean } {
  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('supabase_project_url') || '' : '';
  const url = storedUrl || (envUrl && !envUrl.includes('your-project') ? envUrl : '');

  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  const storedKey = typeof window !== 'undefined' ? localStorage.getItem('supabase_anon_key') || '' : '';
  const key = storedKey || envKey || DEFAULT_SUPABASE_ANON_KEY;

  const isValidUrl = Boolean(url && url.startsWith('http') && !url.includes('your-project'));

  return {
    url,
    key,
    isConfigured: isValidUrl && Boolean(key),
  };
}

// Save custom Supabase Project URL
export function setSupabaseConfig(url: string, key?: string) {
  if (typeof window !== 'undefined') {
    if (url) {
      localStorage.setItem('supabase_project_url', url.trim());
    } else {
      localStorage.removeItem('supabase_project_url');
    }
    if (key) {
      localStorage.setItem('supabase_anon_key', key.trim());
    }
    // Re-initialize client
    initSupabaseClient();
  }
}

let supabaseInstance: SupabaseClient | null = null;

export function initSupabaseClient(): SupabaseClient | null {
  const config = getSupabaseConfig();
  if (config.isConfigured) {
    try {
      supabaseInstance = createClient(config.url, config.key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
      return supabaseInstance;
    } catch (err) {
      console.warn('Supabase initialization failed:', err);
      supabaseInstance = null;
    }
  }
  return null;
}

// Initial initialization attempt
initSupabaseClient();

export function getSupabase(): SupabaseClient | null {
  if (!supabaseInstance) {
    initSupabaseClient();
  }
  return supabaseInstance;
}

// Real live connection tester
export async function testSupabaseConnection(): Promise<{
  success: boolean;
  message: string;
  details?: any;
}> {
  const config = getSupabaseConfig();
  if (!config.url || !config.url.startsWith('http')) {
    return {
      success: false,
      message: 'URL-и лоиҳаи Supabase ворид нашудааст (масалан: https://xxxx.supabase.co).',
    };
  }

  const client = getSupabase();
  if (!client) {
    return {
      success: false,
      message: 'Эҷоди пайвастшавии Supabase имконнопазир шуд. URL ва калидро санҷед.',
    };
  }

  try {
    // Attempt a light ping by querying profiles or checking auth health
    const { error } = await client.from('profiles').select('id').limit(1);
    if (error) {
      // If table doesn't exist yet, it means credentials are valid, but SQL tables must be created!
      if (error.code === '42P01' || error.message?.includes('relation "public.profiles" does not exist')) {
        return {
          success: true,
          message: 'Пайвастшавӣ бо Supabase фаъол аст! Лутфан коди SQL-и зеринро дар SQL Editor-и Supabase иҷро намоед, то ҷадвалҳо сохта шаванд.',
          details: { tableNeedsCreation: true },
        };
      }
      return {
        success: false,
        message: `Хатогӣ аз Supabase: ${error.message} (Код: ${error.code})`,
        details: error,
      };
    }
    return {
      success: true,
      message: 'Пайвастшавӣ комилан бомуваффақият аст! Ҷадвалҳо ва калиди API дуруст кор мекунанд.',
    };
  } catch (err: any) {
    return {
      success: false,
      message: err?.message || 'Хатогии шабака ҳангоми пайвастшавӣ ба Supabase.',
    };
  }
}

// ==========================================
// DATA SYNC SERVICES WITH LOCAL FALLBACK
// ==========================================

export async function syncSaveLessonPlan(plan: LessonPlan): Promise<boolean> {
  // Always keep in local storage
  try {
    const existing = JSON.parse(localStorage.getItem('smart_teacher_plans') || '[]');
    const updated = [plan, ...existing.filter((p: any) => p.id !== plan.id)];
    localStorage.setItem('smart_teacher_plans', JSON.stringify(updated));
  } catch (e) {
    console.error('LocalStorage error:', e);
  }

  const client = getSupabase();
  if (!client) return false;

  try {
    const { error } = await client.from('lesson_plans').upsert({
      id: plan.id,
      topic: plan.topic,
      subject: plan.subject,
      grade: plan.grade,
      duration: plan.duration,
      educational_goal: plan.educationalGoal,
      upbringing_goal: plan.upbringingGoal,
      developmental_goal: plan.developmentalGoal,
      expected_results: plan.expectedResults,
      required_materials: plan.requiredMaterials,
      stages: plan.stages,
      raw_response: plan.rawResponse,
      created_at: plan.createdAt,
    });
    if (error) {
      console.warn('Supabase sync lesson plan error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase save error:', err);
    return false;
  }
}

export async function syncGetLessonPlans(): Promise<LessonPlan[]> {
  const client = getSupabase();
  if (client) {
    try {
      const { data, error } = await client
        .from('lesson_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((d: any) => ({
          id: d.id,
          topic: d.topic,
          subject: d.subject,
          grade: d.grade,
          duration: d.duration || '45 дақиқа',
          educationalGoal: d.educational_goal || '',
          upbringingGoal: d.upbringing_goal || '',
          developmentalGoal: d.developmental_goal || '',
          expectedResults: d.expected_results || [],
          requiredMaterials: d.required_materials || [],
          stages: d.stages || {},
          rawResponse: d.raw_response,
          createdAt: d.created_at,
        }));
      }
    } catch (err) {
      console.warn('Supabase fetch lesson plans error:', err);
    }
  }

  // Fallback to localStorage
  try {
    return JSON.parse(localStorage.getItem('smart_teacher_plans') || '[]');
  } catch {
    return [];
  }
}

export async function syncSaveQuiz(quiz: Quiz): Promise<boolean> {
  try {
    const existing = JSON.parse(localStorage.getItem('smart_teacher_quizzes') || '[]');
    const updated = [quiz, ...existing.filter((q: any) => q.id !== quiz.id)];
    localStorage.setItem('smart_teacher_quizzes', JSON.stringify(updated));
  } catch (e) {
    console.error('LocalStorage error:', e);
  }

  const client = getSupabase();
  if (!client) return false;

  try {
    const { error } = await client.from('quizzes').upsert({
      id: quiz.id,
      title: quiz.title,
      subject: quiz.subject,
      grade: quiz.grade,
      questions: quiz.questions,
      created_at: quiz.createdAt,
    });
    return !error;
  } catch (err) {
    console.warn('Supabase save quiz error:', err);
    return false;
  }
}

export async function syncGetQuizzes(): Promise<Quiz[]> {
  const client = getSupabase();
  if (client) {
    try {
      const { data, error } = await client
        .from('quizzes')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((q: any) => ({
          id: q.id,
          title: q.title,
          subject: q.subject,
          grade: q.grade,
          questions: q.questions || [],
          createdAt: q.created_at,
        }));
      }
    } catch (err) {
      console.warn('Supabase fetch quizzes error:', err);
    }
  }

  try {
    return JSON.parse(localStorage.getItem('smart_teacher_quizzes') || '[]');
  } catch {
    return [];
  }
}

export async function syncSaveChatMessage(msg: ChatMessage): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    const { error } = await client.from('chat_history').insert({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      subject: msg.subject || null,
      grade: msg.grade || null,
      created_at: msg.timestamp,
    });
    return !error;
  } catch (err) {
    console.warn('Supabase save chat error:', err);
    return false;
  }
}
