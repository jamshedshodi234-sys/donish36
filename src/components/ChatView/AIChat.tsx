import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { SCHOOL_SUBJECTS, GRADES } from '../../data/subjects';
import { sendChatToAI } from '../../services/api';
import { ChatMessage } from '../../types';
import {
  Send,
  Sparkles,
  Trash2,
  Copy,
  Check,
  RotateCcw,
  Bot,
  User,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  MessageSquare,
} from 'lucide-react';

const LOCAL_STORAGE_CHAT_KEY = 'smart_teacher_chat_history_v1';

export const AIChat: React.FC = () => {
  const { language } = useApp();

  const [subject, setSubject] = useState('Умумӣ');
  const [grade, setGrade] = useState('Ҳамаи синфҳо');
  const [chatLanguage, setChatLanguage] = useState(language);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CHAT_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 'welcome',
        role: 'assistant',
        content: `Салом! Ман «Омӯзгори ҳушманд — AI Ёвар» ҳастам. 

Ман метавонам ба Шумо дар:
• Фаҳмонидани қоидаҳо ва мавзӯъҳои ҳамаи фанҳо
• Ҳалли қадам ба қадами масъалаҳои риёзӣ ва табиӣ
• Тарҷума ва омӯзиши забонҳо
• Омодагӣ ба олимпиадаҳо ва озмунҳо ёрӣ расонам.

Шумо метавонед саволи худро бипурсед ё мавзӯеро барои омӯзиш пешниҳод кунед!`,
        timestamp: new Date().toLocaleTimeString('tg-TJ', { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_CHAT_KEY, JSON.stringify(messages));
    } catch (e) {
      console.error(e);
    }
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    setError('');
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('tg-TJ', { hour: '2-digit', minute: '2-digit' }),
      subject,
      grade,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const historyForAI = [...messages, userMsg].map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    const res = await sendChatToAI({
      messages: historyForAI,
      subject,
      grade,
      language: chatLanguage,
      systemInstruction: 'Шумо ёвари маорифи Тоҷикистон ҳастед. Ҷавобҳоятон бояд боэҳтиром, дақиқ ва аз нигоҳи илмӣ бехато бошанд.',
    });

    setIsLoading(false);

    if (res.success && res.text) {
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: res.text,
        timestamp: new Date().toLocaleTimeString('tg-TJ', { hour: '2-digit', minute: '2-digit' }),
        subject,
        grade,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } else {
      setError(res.error || 'Хатогӣ ҳангоми гирифтани ҷавоб аз зеҳни сунъӣ.');
    }
  };

  const handleClear = () => {
    if (confirm('Оё мехоҳед таърихи суҳбатро пок намоед?')) {
      const freshWelcome: ChatMessage = {
        id: 'welcome-reset',
        role: 'assistant',
        content: 'Таърихи чат пок карда шуд. Саволи нави худро нависед!',
        timestamp: new Date().toLocaleTimeString('tg-TJ', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([freshWelcome]);
      localStorage.removeItem(LOCAL_STORAGE_CHAT_KEY);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRetryLast = () => {
    const lastUserMessage = [...messages].reverse().find((m) => m.role === 'user');
    if (lastUserMessage) {
      handleSend(lastUserMessage.content);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>Чати таълимии зеҳни сунъӣ</span>
            <span aria-hidden="true">·</span>
            <span>Gemini 3.8 Flash</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-950 dark:text-white tracking-tight mt-1">
            Муоширати мустақим бо AI
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Барои дарёфти тавзеҳи дақиқ фан ва синфро муайян карда метавонед.
          </p>
        </div>

        <button
          onClick={handleClear}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition border border-slate-200 dark:border-slate-700"
        >
          <Trash2 className="w-3.5 h-3.5" /> Пок кардани чат
        </button>
      </div>

      {/* Filter / Context Bar */}
      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800/90 shadow-xs flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Фан:</span>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="text-xs font-medium py-1.5 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
          >
            <option value="Умумӣ">Ҳамаи фанҳо (Умумӣ)</option>
            {SCHOOL_SUBJECTS.map((s) => (
              <option key={s.id} value={s.nameTg}>
                {s.nameTg}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Синф:</span>
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="text-xs font-medium py-1.5 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
          >
            <option value="Ҳамаи синфҳо">Ҳамаи синфҳо</option>
            {GRADES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500">Забон:</span>
          <select
            value={chatLanguage}
            onChange={(e) => setChatLanguage(e.target.value as any)}
            className="text-xs font-medium py-1.5 px-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
          >
            <option value="tg">Тоҷикӣ</option>
            <option value="ru">Русский</option>
            <option value="en">English</option>
          </select>
        </div>

        <div className="ml-auto hidden md:flex items-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Махфияти комил • Маълумот захира намешавад</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-6 min-h-[460px] max-h-[600px] overflow-y-auto space-y-4">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-xs text-sm leading-relaxed ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-tr-xs'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 rounded-tl-xs'
                }`}
              >
                {!isUser && m.subject && m.subject !== 'Умумӣ' && (
                  <div className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400 mb-1">
                    Фан: {m.subject} {m.grade && `• ${m.grade}`}
                  </div>
                )}

                <div className="whitespace-pre-wrap">{m.content}</div>

                <div className="flex items-center justify-between gap-4 mt-2 pt-2 border-t border-black/5 dark:border-white/5 text-[10px] opacity-75">
                  <span>{m.timestamp}</span>

                  {!isUser && (
                    <button
                      onClick={() => handleCopy(m.id, m.content)}
                      className="hover:underline flex items-center gap-1"
                    >
                      {copiedId === m.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span>Нусхабардорӣ шуд</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Нусха</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
              <span>Омӯзгори ҳушманд дар ҳоли таҳлил ва навиштани ҷавоб...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error notification */}
      {error && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={handleRetryLast}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-200 text-[11px] font-bold"
          >
            <RotateCcw className="w-3 h-3" /> Аз нав кӯшиш кардан
          </button>
        </div>
      )}

      {/* Input Form */}
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md p-2">
        <textarea
          rows={2}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Саволи худро бинависед... (Барои фиристодан Enter-ро пахш намоед)"
          className="w-full p-2.5 text-sm bg-transparent border-0 focus:outline-none resize-none font-medium placeholder:text-slate-400"
        />

        <div className="flex items-center justify-between pt-1 px-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <span>Мисолҳо:</span>
            <button
              onClick={() => handleSend('Қонуни Омро бо формула ва воҳидҳои ченак шарҳ деҳ.')}
              className="hover:text-blue-600 underline"
            >
              Қонуни Ом
            </button>
            <span>•</span>
            <button
              onClick={() => handleSend('Тафовути байни синоним ва омоним чист?')}
              className="hover:text-blue-600 underline"
            >
              Синоним ва омоним
            </button>
          </div>

          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition disabled:opacity-40 flex items-center justify-center shadow-md shadow-blue-500/20"
            aria-label="Фиристодан"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
