import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { X, User as UserIcon, Lock, Phone, School, BookOpen, GraduationCap, CheckCircle2, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { user, login, register, logout, loginAsDemo } = useAuth();
  const { theme } = useApp();
  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Form states
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  // Register states
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+992 ');
  const [regLogin, setRegLogin] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [role, setRole] = useState<UserRole>('teacher');
  const [school, setSchool] = useState('МТМУ №36 н. Шоҳмансур');
  const [specialization, setSpecialization] = useState('Алгебра ва Геометрия');
  const [grade, setGrade] = useState('Синфи 11');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    const res = await login(loginInput, passwordInput);
    setIsLoading(false);

    if (res.success) {
      setSuccessMsg('Шумо бомуваффақият ворид шудед!');
      setTimeout(() => {
        onClose();
        setSuccessMsg('');
      }, 700);
    } else {
      setErrorMsg(res.message || 'Хатогӣ дар воридшавӣ.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setIsLoading(true);

    const res = await register({
      fullName,
      phone,
      login: regLogin,
      password: regPassword,
      role,
      school,
      grade: role === 'student' ? grade : undefined,
      subject: role === 'teacher' ? specialization : undefined,
    });

    setIsLoading(false);

    if (res.success) {
      setSuccessMsg('Сабти номи Шумо бомуваффақият анҷом ёфт!');
      setTimeout(() => {
        onClose();
        setSuccessMsg('');
      }, 700);
    } else {
      setErrorMsg(res.message || 'Хатогӣ дар бақайдгирӣ.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className={`relative w-full max-w-md rounded-2xl shadow-2xl p-6 sm:p-7 border ${
          theme === 'dark'
            ? 'bg-slate-900 border-slate-700 text-slate-100'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          aria-label="Пӯшидан"
        >
          <X className="w-5 h-5" />
        </button>

        {user ? (
          // Logged in state view
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center font-bold text-xl">
                {user.fullName.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-lg">{user.fullName}</h3>
                <p className="text-xs text-blue-600 font-medium">
                  {user.role === 'teacher' ? '👨‍🏫 Омӯзгор' : '👨‍🎓 Хонанда'} • {user.school}
                </p>
              </div>
            </div>

            <div className="text-sm space-y-2 py-2">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Рақами телефон:</span>
                <span className="font-mono font-medium">{user.phone}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Логин:</span>
                <span className="font-mono font-medium">{user.login}</span>
              </div>
              {user.subject && (
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Фан:</span>
                  <span className="font-medium">{user.subject}</span>
                </div>
              )}
              {user.grade && (
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Синф:</span>
                  <span className="font-medium">{user.grade}</span>
                </div>
              )}
            </div>

            <div className="pt-2 flex gap-3">
              <button
                onClick={logout}
                className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-rose-600 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 transition"
              >
                Баромад аз уток
              </button>
              <button
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                Давом додан
              </button>
            </div>
          </div>
        ) : (
          // Tabs: Login or Register
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg mb-4 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => {
                    setTab('login');
                    setErrorMsg('');
                  }}
                  className={`w-full py-2 rounded-md transition-colors ${
                    tab === 'login'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Воридшавӣ
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTab('register');
                    setErrorMsg('');
                  }}
                  className={`w-full py-2 rounded-md transition-colors ${
                    tab === 'register'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Бақайдгирӣ
                </button>
              </div>
              <h2 className="text-lg font-bold text-slate-950 dark:text-white tracking-tight">
                {tab === 'login' ? 'Утоқи шахсии корбар' : 'Сабти номи корбари нав'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {tab === 'login'
                  ? 'Рақами телефон (+992) ё логини худро ворид кунед'
                  : 'Барои дастрасии пурра ба низом маълумоти худро сабт кунед'}
              </p>
            </div>

            {/* Error or Success notification */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {tab === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-300">
                    Логин ё Рақами телефон (+992)
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="omuzgor ё +992 90 011 22 33"
                      value={loginInput}
                      onChange={(e) => setLoginInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-300">
                    Парол
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      placeholder="Пароли худро ворид кунед"
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-2.5 px-4 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.99] transition disabled:opacity-50"
                >
                  {isLoading ? 'Дар ҳоли санҷиш...' : 'Воридшавӣ ба уток'}
                </button>

                {/* Fast login presets for judges */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-center">
                  <p className="text-[11px] text-slate-400 mb-2">Намоиши фаврӣ барои ҳакамон ва меҳмонон:</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        loginAsDemo('teacher');
                        onClose();
                      }}
                      className="py-1.5 px-2.5 rounded-lg text-xs font-medium border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 transition"
                    >
                      👨‍🏫 Ҳамчун Омӯзгор
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        loginAsDemo('student');
                        onClose();
                      }}
                      className="py-1.5 px-2.5 rounded-lg text-xs font-medium border border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition"
                    >
                      👨‍🎓 Ҳамчун Хонанда
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <form onSubmit={handleRegisterSubmit} className="space-y-3 max-h-[70vh] overflow-y-auto pr-1">
                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-300">
                    Нақши корбар дар система
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('teacher')}
                      className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                        role === 'teacher'
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-600'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      Омӯзгор
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('student')}
                      className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold border transition ${
                        role === 'student'
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/40 text-blue-600'
                          : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      <GraduationCap className="w-3.5 h-3.5" />
                      Хонанда
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-300">
                    Ному насаб (пурра)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Масалан: Ярахмадов Аличон"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-300">
                    Рақами телефон (бо формати тоҷикии +992)
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="+992 90 123 45 67"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm font-mono rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400">Формат: +992 ва 9 рақам</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-300">
                    Муассисаи таълимӣ (Мактаб / Коллеҷ)
                  </label>
                  <div className="relative">
                    <School className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="МТМУ №36 н. Шоҳмансур"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {role === 'teacher' ? (
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-300">
                      Фанни таълимӣ
                    </label>
                    <input
                      type="text"
                      placeholder="Масалан: Математика, Физика, Забони тоҷикӣ"
                      value={specialization}
                      onChange={(e) => setSpecialization(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-300">
                      Синфи таҳсил
                    </label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {Array.from({ length: 11 }, (_, i) => `Синфи ${i + 1}`).map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-300">
                      Логин
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="alijon11"
                      value={regLogin}
                      onChange={(e) => setRegLogin(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-slate-600 dark:text-slate-300">
                      Парол
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="••••••"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-3 py-2.5 px-4 rounded-xl text-sm font-bold bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.99] transition disabled:opacity-50"
                >
                  {isLoading ? 'Дар ҳоли сабт...' : 'Бақайдгирӣ ва воридшавӣ'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
