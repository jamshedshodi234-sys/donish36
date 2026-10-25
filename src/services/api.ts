export interface ApiResponse<T = any> {
  success: boolean;
  text?: string;
  data?: T;
  raw?: string;
  model?: string;
  error?: string;
}

// Support custom backend URL when deployed to static hosts like GitHub Pages
export function getApiBaseUrl(): string {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem('custom_backend_url');
    if (custom) return custom.replace(/\/+$/, '');
  }
  const envBackend = import.meta.env.VITE_BACKEND_URL || '';
  if (envBackend) return envBackend.replace(/\/+$/, '');
  return '';
}

export async function checkServerHealth(): Promise<{
  ok: boolean;
  hasGeminiKey: boolean;
  model: string;
  isGitHubPages?: boolean;
  error?: string;
}> {
  const isGhPages = typeof window !== 'undefined' && window.location.hostname.endsWith('github.io');

  try {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/api/health`);
    if (!res.ok) {
      return { 
        ok: false, 
        hasGeminiKey: false, 
        model: '', 
        isGitHubPages: isGhPages,
        error: isGhPages ? 'Дар GitHub Pages ҳолати статикӣ фаъол аст' : `HTTP ${res.status}` 
      };
    }
    const data = await res.json();
    return {
      ok: true,
      hasGeminiKey: Boolean(data.hasGeminiKey),
      model: data.model || 'gemini-3.8-flash',
      isGitHubPages: isGhPages,
    };
  } catch (err: any) {
    return {
      ok: false,
      hasGeminiKey: false,
      model: '',
      isGitHubPages: isGhPages,
      error: isGhPages 
        ? 'Дар GitHub Pages сервер мавҷуд нест (ҳолати автономӣ).' 
        : (err.message || 'Сервер дастрас нест'),
    };
  }
}

export async function generateWithAI(params: {
  prompt: string;
  systemInstruction?: string;
  temperature?: number;
  responseMimeType?: string;
}): Promise<ApiResponse> {
  const baseUrl = getApiBaseUrl();

  try {
    const res = await fetch(`${baseUrl}/api/gemini/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      if (res.status === 404 && typeof window !== 'undefined' && window.location.hostname.endsWith('github.io')) {
        return {
          success: false,
          error: 'Дар GitHub Pages сервери қафо (Node.js backend) кор намекунад. Шумо метавонед дар Танзимот суроғаи сервери худро (Backend URL) пайваст кунед ё дар компютер бо "npm run dev" оғоз кунед.',
        };
      }
      const data = await res.json().catch(() => ({}));
      return {
        success: false,
        error: data.error || `Хатогии сервер (Код: ${res.status})`,
      };
    }

    const data = await res.json();
    return {
      success: true,
      text: data.text,
      model: data.model,
    };
  } catch (err: any) {
    return {
      success: false,
      error: 'Хатогӣ дар пайвастшавӣ ба шабака. Лутфан пайвасти интернетро санҷед ва аз нав кӯшиш кунед.',
    };
  }
}

export async function sendChatToAI(params: {
  messages: Array<{ role: 'user' | 'assistant' | 'model'; content: string }>;
  subject?: string;
  grade?: string;
  language?: string;
  systemInstruction?: string;
}): Promise<ApiResponse> {
  const baseUrl = getApiBaseUrl();

  try {
    const res = await fetch(`${baseUrl}/api/gemini/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return {
        success: false,
        error: data.error || 'Хатогӣ ҳангоми қабули ҷавоб аз зеҳни сунъӣ.',
      };
    }

    const data = await res.json();
    return {
      success: true,
      text: data.text,
      model: data.model,
    };
  } catch (err: any) {
    return {
      success: false,
      error: 'Қатъ шудани пайвастшавӣ ба сервер.',
    };
  }
}

export async function generateStructuredAI<T = any>(params: {
  prompt: string;
  systemInstruction?: string;
}): Promise<ApiResponse<T>> {
  const baseUrl = getApiBaseUrl();

  try {
    const res = await fetch(`${baseUrl}/api/gemini/structured`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return {
        success: false,
        error: data.error || 'Хатогии сохтори додаҳо.',
      };
    }

    const data = await res.json();
    return {
      success: true,
      data: data.data,
      raw: data.raw,
    };
  } catch (err: any) {
    return {
      success: false,
      error: 'Хатогӣ дар интиқоли маълумот.',
    };
  }
}
