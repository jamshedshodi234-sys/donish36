import React, { useState } from 'react';
import { useApp, MainTab } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { UI_STRINGS } from '../utils/translations';
import {
  Sun,
  Moon,
  User as UserIcon,
  Menu,
  X,
  ChevronDown,
  Database,
} from 'lucide-react';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenSupabase?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onOpenSupabase }) => {
  const {
    activeTab,
    setActiveTab,
    language,
    setLanguage,
    theme,
    toggleTheme,
    isServerConnected,
  } = useApp();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  const t = UI_STRINGS[language] || UI_STRINGS.tg;

  const primaryNavItems: { id: MainTab; label: string }[] = [
    { id: 'home', label: t.navHome },
    { id: 'teacher', label: t.navTeacher },
    { id: 'student', label: t.navStudent },
    { id: 'chat', label: t.navChat },
    { id: 'demo', label: t.navDemo },
  ];

  const secondaryNavItems: { id: MainTab; label: string }[] = [
    { id: 'schedule', label: t.navSchedule },
    { id: 'docs', label: t.navDocs },
    { id: 'stats', label: t.navStats },
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md transition-colors bg-white/95 dark:bg-slate-950/95 border-b border-slate-200/80 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-16">
          {/* Zone 1: Brand Wordmark (Single text element wordmark in display face) */}
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-2.5 text-left focus:outline-none group shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-blue-600 text-white flex items-center justify-center font-black text-sm tracking-tighter">
              ОҲ
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-extrabold text-slate-950 dark:text-white text-base tracking-tight whitespace-nowrap">
                Омӯзгори ҳушманд
              </span>
              <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider whitespace-nowrap hidden sm:inline">
                AI Ёвар
              </span>
            </div>
          </button>

          {/* Zone 2: 4-5 Concise Single-Line Navigation Links (No pill buttons, clean hover text) */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
            {primaryNavItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative py-1 transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-blue-700 dark:text-blue-400 font-bold'
                      : 'hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute -bottom-2.5 left-0 right-0 h-[2px] bg-blue-600 dark:bg-blue-400 rounded-full" />
                  )}
                </button>
              );
            })}

            {/* Extra Tools Dropdown */}
            <div className="relative">
              <button
                onClick={() => setMoreMenuOpen(!moreMenuOpen)}
                className={`flex items-center gap-1 py-1 transition-colors whitespace-nowrap shrink-0 ${
                  secondaryNavItems.some((n) => n.id === activeTab)
                    ? 'text-blue-700 dark:text-blue-400 font-bold'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>Иловагӣ</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </button>

              {moreMenuOpen && (
                <div
                  onMouseLeave={() => setMoreMenuOpen(false)}
                  className="absolute top-full left-0 mt-2 w-48 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-xs space-y-0.5 animate-fade-in"
                >
                  {secondaryNavItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMoreMenuOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 font-medium transition ${
                        activeTab === item.id
                          ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}

                  {onOpenSupabase && (
                    <div className="pt-1 mt-1 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => {
                          onOpenSupabase();
                          setMoreMenuOpen(false);
                        }}
                        className="w-full text-left px-3.5 py-2 font-medium text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 flex items-center gap-2"
                      >
                        <Database className="w-3.5 h-3.5" />
                        <span>Пойгоҳи Supabase</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </nav>

          {/* Zone 3: 1 Primary Action + Utility Controls (Language & Theme) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Supabase Button */}
            {onOpenSupabase && (
              <button
                onClick={onOpenSupabase}
                title="Пойгоҳи Supabase (SQL ва калиди API)"
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 text-slate-700 dark:text-slate-300 transition-colors"
              >
                <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Supabase</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </button>
            )}

            {/* Language Switcher */}
            <div className="hidden sm:flex items-center text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              {(['tg', 'ru', 'en'] as const).map((l, i) => (
                <React.Fragment key={l}>
                  {i > 0 && <span className="px-1 text-slate-300 dark:text-slate-700">/</span>}
                  <button
                    onClick={() => setLanguage(l)}
                    className={`uppercase transition-colors ${
                      language === l
                        ? 'text-slate-950 dark:text-white font-bold'
                        : 'hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    {l}
                  </button>
                </React.Fragment>
              ))}
            </div>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Ивази мавзуъ"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Zone 3 Primary Action */}
            <button
              onClick={onOpenAuth}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 shadow-xs"
            >
              <UserIcon className="w-3.5 h-3.5 opacity-80" />
              <span className="truncate max-w-[120px]">
                {user ? user.fullName.split(' ')[0] : t.loginBtn}
              </span>
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 lg:hidden rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Меню"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 space-y-2 animate-fade-in shadow-xl">
          {[...primaryNavItems, ...secondaryNavItems].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold transition ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          {onOpenSupabase && (
            <button
              onClick={() => {
                onOpenSupabase();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                <span>Пойгоҳи Supabase (SQL ва калид)</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
            </button>
          )}

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span>Забони барнома:</span>
            <div className="flex gap-2 font-semibold">
              {(['tg', 'ru', 'en'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLanguage(l)}
                  className={`uppercase ${language === l ? 'text-blue-600 font-bold' : ''}`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
