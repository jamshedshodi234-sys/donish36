import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI SDK safely
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasGeminiKey: Boolean(apiKey),
    model: 'gemini-3.8-flash',
    appName: 'Омӯзгори ҳушманд — AI Ёвар',
    author: 'Ярахмадов Аличон, хонандаи синфи 11-и МТМУ №36, н. Шоҳмансур',
  });
});

// General generation endpoint
app.post('/api/gemini/generate', async (req: Request, res: Response) => {
  try {
    const { prompt, systemInstruction, temperature = 0.7, responseMimeType } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Мазмуни дархост (prompt) холи аст ё нодуруст ворид шудааст.',
      });
    }

    if (!ai) {
      return res.status(503).json({
        success: false,
        error: 'Калиди GEMINI_API_KEY дар муҳити сервер пайваст нашудааст. Лутфан калидро дар панели Secrets насб намоед.',
      });
    }

    const config: Record<string, any> = {
      temperature: Number(temperature) || 0.7,
    };

    if (systemInstruction) {
      config.systemInstruction = systemInstruction;
    }
    if (responseMimeType) {
      config.responseMimeType = responseMimeType;
    }

    const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
    let lastError: any = null;
    let successfulText = '';
    let usedModel = '';

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config,
        });
        successfulText = response.text || '';
        usedModel = modelName;
        break;
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} failed, trying next candidate if available...`);
      }
    }

    if (usedModel) {
      return res.json({
        success: true,
        text: successfulText,
        model: usedModel,
      });
    }

    console.error('All Gemini models failed:', lastError);
    let errorMessage = lastError?.message || 'Хатогии номаълум ҳангоми иртибот бо Gemini API.';
    if (errorMessage.includes('RESOURCE_EXHAUSTED') || errorMessage.includes('429')) {
      errorMessage = 'Квотаи ройгони дархостҳои ҳаррӯзаи Gemini Free Tier ба итмом расидааст. Лутфан баъдтар аз нав кӯшиш кунед ё калиди пулакии API (Paid Key)-ро дар Settings > Secrets пайваст намоед.';
    }

    return res.status(500).json({
      success: false,
      error: errorMessage,
    });
  } catch (error: any) {
    console.error('Gemini Generate Error:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Хатогӣ дар сервер.',
    });
  }
});

// Multi-turn chat endpoint
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  try {
    const { messages, systemInstruction, subject, grade, language = 'tg' } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Рӯйхати паёмҳо холӣ аст.',
      });
    }

    if (!ai) {
      return res.status(503).json({
        success: false,
        error: 'Калиди GEMINI_API_KEY дар сервер мавҷуд нест.',
      });
    }

    const baseSystemPrompt = `Шумо «Омӯзгори ҳушманд — AI Ёвар» ҳастед. Ёвари интеллектуалии маорифи Ҷумҳурии Тоҷикистон, ки аз ҷониби хонандаи синфи 11 Ярахмадов Аличон таҳия шудааст.
Шумо ба омӯзгорон ва хонандагони мактабҳои таҳсилоти умумӣ кӯмак мерасонед.
Фанни ҷорӣ: ${subject || 'Умумӣ'}.
Синф: ${grade || 'Умумӣ'}.
Забони муошират: ${language === 'ru' ? 'русӣ' : language === 'en' ? 'англисӣ' : 'тоҷикии адабӣ, фаҳмо ва боэҳтиром'}.
Ҳамеша тавзеҳи равшан, қадам ба қадам, методикаи дурусти омӯзгорӣ ва маслиҳатҳои дақиқ пешниҳод кунед. Агар масъалаи математикӣ, физикӣ ё химиявӣ бошад, формулаҳо ва қадамҳои ҳалро пурра нишон диҳед.`;

    const fullSystemInstruction = systemInstruction
      ? `${baseSystemPrompt}\n\nДастури иловагӣ: ${systemInstruction}`
      : baseSystemPrompt;

    // Convert messages to Gemini format (limit to last 12 messages for performance and safety)
    const recentMessages = messages.slice(-12).map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
    let lastError: any = null;
    let reply = '';
    let usedModel = '';

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: recentMessages,
          config: {
            systemInstruction: fullSystemInstruction,
            temperature: 0.7,
          },
        });
        reply = response.text || '';
        usedModel = modelName;
        break;
      } catch (err: any) {
        lastError = err;
      }
    }

    if (usedModel) {
      return res.json({
        success: true,
        text: reply,
        model: usedModel,
      });
    }

    let errorMsg = lastError?.message || 'Хатогӣ ҳангоми коркарди чат.';
    if (errorMsg.includes('RESOURCE_EXHAUSTED') || errorMsg.includes('429')) {
      errorMsg = 'Квотаи ройгони дархостҳои ҳаррӯзаи Gemini Free Tier ба итмом расидааст. Лутфан баъдтар аз нав кӯшиш кунед ё калиди пулакии API (Paid Key)-ро пайваст намоед.';
    }

    return res.status(500).json({
      success: false,
      error: errorMsg,
    });
  } catch (error: any) {
    console.error('Gemini Chat Error:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Хатогӣ ҳангоми коркарди чат.',
    });
  }
});

// Structured JSON generation endpoint (for Quizzes, Rubrics, Lesson Plans)
app.post('/api/gemini/structured', async (req: Request, res: Response) => {
  try {
    const { prompt, systemInstruction } = req.body;

    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Дархост холи аст' });
    }

    if (!ai) {
      return res.status(503).json({
        success: false,
        error: 'Калиди GEMINI_API_KEY дар сервер танзим нашудааст.',
      });
    }

    const candidateModels = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
    let rawText = '';
    let lastError: any = null;

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            systemInstruction: (systemInstruction || '') + '\nIMPORTANT: You must return strictly valid JSON with no markdown backticks, no markdown code fence, only the raw JSON string.',
            responseMimeType: 'application/json',
            temperature: 0.4,
          },
        });
        rawText = response.text || '{}';
        break;
      } catch (err: any) {
        lastError = err;
      }
    }

    if (!rawText) {
      let errorMsg = lastError?.message || 'Хатогии JSON аз Gemini API.';
      if (errorMsg.includes('RESOURCE_EXHAUSTED') || errorMsg.includes('429')) {
        errorMsg = 'Квотаи ройгони дархостҳои ҳаррӯзаи Gemini Free Tier ба итмом расидааст. Лутфан баъдтар аз нав кӯшиш кунед ё калиди пулакии API-ро пайваст намоед.';
      }
      return res.status(500).json({ success: false, error: errorMsg });
    }

    // Clean potential markdown if any
    rawText = rawText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();

    try {
      const parsed = JSON.parse(rawText);
      return res.json({ success: true, data: parsed, raw: rawText });
    } catch {
      return res.json({ success: true, data: null, raw: rawText });
    }
  } catch (error: any) {
    console.error('Gemini Structured Error:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Хатогии сохтори додаҳо.',
    });
  }
});

// Vite middleware in development or static serve in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://0.0.0.0:${PORT} [${isDev ? 'development' : 'production'}]`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
