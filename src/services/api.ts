export interface ApiResponse<T = any> {
  success: boolean;
  text?: string;
  data?: T;
  raw?: string;
  model?: string;
  error?: string;
}

export async function checkServerHealth(): Promise<{
  ok: boolean;
  hasGeminiKey: boolean;
  model: string;
  error?: string;
}> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) {
      return { ok: false, hasGeminiKey: false, model: '', error: `HTTP ${res.status}` };
    }
    const data = await res.json();
    return {
      ok: true,
      hasGeminiKey: Boolean(data.hasGeminiKey),
      model: data.model || 'gemini-3.8-flash',
    };
  } catch (err: any) {
    return {
      ok: false,
      hasGeminiKey: false,
      model: '',
      error: err.message || 'Сервер дастрас нест',
    };
  }
}

export async function generateWithAI(params: {
  prompt: string;
  systemInstruction?: string;
  temperature?: number;
  responseMimeType?: string;
}): Promise<ApiResponse> {
  try {
    const res = await fetch('/api/gemini/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return {
        success: false,
        error: data.error || `Хатогии сервер (Код: ${res.status})`,
      };
    }

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
  try {
    const res = await fetch('/api/gemini/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return {
        success: false,
        error: data.error || 'Хатогӣ ҳангоми қабули ҷавоб аз зеҳни сунъӣ.',
      };
    }

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
  try {
    const res = await fetch('/api/gemini/structured', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return {
        success: false,
        error: data.error || 'Хатогии сохтори додаҳо.',
      };
    }

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
