import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (login: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: {
    fullName: string;
    phone: string;
    login: string;
    password: string;
    role: UserRole;
    school?: string;
    grade?: string;
    subject?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  loginAsDemo: (role: 'teacher' | 'student') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USERS_KEY = 'smart_teacher_users_db_v1';
const LOCAL_STORAGE_CURRENT_USER_KEY = 'smart_teacher_current_user_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(LOCAL_STORAGE_CURRENT_USER_KEY);
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        // Default guest or demo state if desired, or null
        // Let's create default demo accounts in the database if not present
        initDefaultUsers();
      }
    } catch (e) {
      console.error('Failed to load user state:', e);
    }
  }, []);

  const initDefaultUsers = () => {
    try {
      const existing = localStorage.getItem(LOCAL_STORAGE_USERS_KEY);
      if (!existing) {
        const defaultUsers: Array<User & { password: string }> = [
          {
            id: 'teacher-demo-1',
            fullName: 'Саидова Нигина Саидовна',
            phone: '+992 90 011 22 33',
            login: 'omuzgor',
            password: '123',
            role: 'teacher',
            school: 'МТМУ №36 ш. Душанбе',
            subject: 'Алгебра ва Геометрия',
            createdAt: new Date().toISOString(),
          },
          {
            id: 'student-demo-2',
            fullName: 'Ярахмадов Аличон',
            phone: '+992 93 456 78 90',
            login: 'alijon',
            password: '123',
            role: 'student',
            school: 'МТМУ №36 н. Шоҳмансур',
            grade: 'Синфи 11',
            createdAt: new Date().toISOString(),
          },
        ];
        localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(defaultUsers));
      }
    } catch (e) {
      console.error('Init default users failed', e);
    }
  };

  const cleanPhone = (phone: string): string => {
    return phone.replace(/[^\d+]/g, '');
  };

  const isValidTajikPhone = (phone: string): boolean => {
    const cleaned = cleanPhone(phone);
    // Should start with +992 and have 9 digits after, total 13 chars (or 992... 12 chars)
    return /^\+992\d{9}$/.test(cleaned) || /^992\d{9}$/.test(cleaned);
  };

  const login = async (loginInput: string, passwordInput: string): Promise<{ success: boolean; message?: string }> => {
    initDefaultUsers();
    try {
      const usersRaw = localStorage.getItem(LOCAL_STORAGE_USERS_KEY) || '[]';
      const users: Array<User & { password?: string }> = JSON.parse(usersRaw);

      const found = users.find(
        (u) =>
          (u.login.toLowerCase() === loginInput.trim().toLowerCase() || cleanPhone(u.phone) === cleanPhone(loginInput)) &&
          u.password === passwordInput.trim()
      );

      if (!found) {
        return { success: false, message: 'Логин (ё рақами телефон) ё парол нодуруст аст.' };
      }

      const { password, ...safeUser } = found;
      setUser(safeUser as User);
      localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_KEY, JSON.stringify(safeUser));
      return { success: true };
    } catch (e) {
      return { success: false, message: 'Хатогӣ ҳангоми воридшавӣ ба система.' };
    }
  };

  const register = async (data: {
    fullName: string;
    phone: string;
    login: string;
    password: string;
    role: UserRole;
    school?: string;
    grade?: string;
    subject?: string;
  }): Promise<{ success: boolean; message?: string }> => {
    initDefaultUsers();
    if (!data.fullName.trim() || data.fullName.trim().length < 3) {
      return { success: false, message: 'Лутфан ному насаби пурраро ворид кунед.' };
    }

    if (!isValidTajikPhone(data.phone)) {
      return {
        success: false,
        message: 'Рақами телефон бояд рақами муътабари Тоҷикистон бошад (масалан: +992 90 123 45 67).',
      };
    }

    if (!data.login.trim() || data.login.trim().length < 3) {
      return { success: false, message: 'Логин бояд камаш аз 3 рамз иборат бошад.' };
    }

    if (!data.password.trim() || data.password.trim().length < 3) {
      return { success: false, message: 'Парол бояд камаш аз 3 рамз иборат бошад.' };
    }

    try {
      const usersRaw = localStorage.getItem(LOCAL_STORAGE_USERS_KEY) || '[]';
      const users: Array<User & { password?: string }> = JSON.parse(usersRaw);

      const existingUser = users.find(
        (u) =>
          u.login.toLowerCase() === data.login.trim().toLowerCase() ||
          cleanPhone(u.phone) === cleanPhone(data.phone)
      );

      if (existingUser) {
        return {
          success: false,
          message: 'Корбар бо чунин логин ё рақами телефон аллакай ба қайд гирифта шудааст.',
        };
      }

      const formattedPhone = cleanPhone(data.phone).startsWith('+')
        ? cleanPhone(data.phone)
        : `+${cleanPhone(data.phone)}`;

      const newUser: User & { password?: string } = {
        id: `user-${Date.now()}`,
        fullName: data.fullName.trim(),
        phone: formattedPhone,
        login: data.login.trim(),
        password: data.password.trim(),
        role: data.role,
        school: data.school?.trim() || 'Муассисаи таҳсилоти умумӣ',
        grade: data.grade,
        subject: data.subject,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      localStorage.setItem(LOCAL_STORAGE_USERS_KEY, JSON.stringify(users));

      const { password, ...safeUser } = newUser;
      setUser(safeUser as User);
      localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_KEY, JSON.stringify(safeUser));

      return { success: true };
    } catch (e) {
      return { success: false, message: 'Хатогӣ ҳангоми сабти ном.' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_CURRENT_USER_KEY);
  };

  const loginAsDemo = (role: 'teacher' | 'student') => {
    if (role === 'teacher') {
      const demoTeacher: User = {
        id: 'demo-teacher',
        fullName: 'Омӯзгори Намунавӣ',
        phone: '+992 90 123 45 67',
        login: 'demo_teacher',
        role: 'teacher',
        school: 'МТМУ №36 ш. Душанбе',
        subject: 'Алгебра ва Физика',
        createdAt: new Date().toISOString(),
      };
      setUser(demoTeacher);
      localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_KEY, JSON.stringify(demoTeacher));
    } else {
      const demoStudent: User = {
        id: 'demo-student',
        fullName: 'Ярахмадов Аличон (Муаллифи лоиҳа)',
        phone: '+992 93 456 78 90',
        login: 'alijon',
        role: 'student',
        school: 'МТМУ №36 н. Шоҳмансур',
        grade: 'Синфи 11',
        createdAt: new Date().toISOString(),
      };
      setUser(demoStudent);
      localStorage.setItem(LOCAL_STORAGE_CURRENT_USER_KEY, JSON.stringify(demoStudent));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        loginAsDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
