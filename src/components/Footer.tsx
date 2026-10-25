import React from 'react';
import { useApp } from '../context/AppContext';
import { Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab } = useApp();

  return (
    <footer className="mt-20 border-t border-slate-200/80 dark:border-slate-800/80 bg-white/50 dark:bg-slate-950/50 transition-colors no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Contest */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="font-extrabold text-slate-950 dark:text-white text-base tracking-tight">
                Омӯзгори ҳушманд
              </span>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                AI Ёвар
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
              Платформаи миллии маорифи рақамӣ дар заминаи Gemini API барои омӯзгорон ва хонандагони муассисаҳои таҳсилоти умумии Ҷумҳурии Тоҷикистон.
            </p>
            <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
              Озмуни ҷумҳуриявии «Идеяи ман — калиди фардо»
            </div>
          </div>

          {/* Col 2: Author info */}
          <div className="space-y-1.5 text-xs">
            <div className="font-bold text-slate-900 dark:text-white text-[11px] uppercase tracking-wider">
              Муаллифи лоиҳа
            </div>
            <p className="text-slate-700 dark:text-slate-300 font-semibold">
              Ярахмадов Аличон
            </p>
            <p className="text-slate-500 dark:text-slate-400">
              Хонандаи синфи 11 «г»
            </p>
            <p className="text-slate-500 dark:text-slate-400">
              МТМУ №36-и ноҳияи Шоҳмансури шаҳри Душанбе
            </p>
          </div>

          {/* Col 3: Quick Navigation */}
          <div className="space-y-1.5 text-xs">
            <div className="font-bold text-slate-900 dark:text-white text-[11px] uppercase tracking-wider">
              Бахшҳои асосӣ
            </div>
            <ul className="space-y-1 text-slate-500 dark:text-slate-400">
              <li>
                <button onClick={() => setActiveTab('teacher')} className="hover:text-blue-600 transition-colors">
                  Бахши омӯзгор
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('student')} className="hover:text-blue-600 transition-colors">
                  Бахши хонанда
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('chat')} className="hover:text-blue-600 transition-colors">
                  Чат бо AI
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('docs')} className="hover:text-blue-600 transition-colors">
                  Ҳуҷҷатҳо ва Ҳимоя
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <p className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            <span>Маводҳо хусусияти ёрирасон ва тавсиявӣ дошта, аз ҷониби омӯзгор санҷида мешаванд.</span>
          </p>
          <p className="tabular-nums">
            © 2026 «Омӯзгори ҳушманд — AI Ёвар»
          </p>
        </div>
      </div>
    </footer>
  );
};
