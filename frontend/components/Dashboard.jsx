'use client';
import { useEffect, useState } from 'react';
import { Sparkles, LogOut } from 'lucide-react';
import AuthPage from './AuthPage';
import MentorBanner from './MentorBanner';
import TasksPanel from './TasksPanel';
import MessagesPanel from './MessagesPanel';
import WeeklyComparisonChart from './WeeklyComparisonChart';
import AISidebarChat from './AISidebarChat';
import { getToken, fetchMe, logout } from '../lib/auth';

const todayLabel = () =>
  new Date().toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' });

export default function Dashboard() {
  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function checkSession() {
      const token = getToken();
      if (!token) {
        setChecking(false);
        return;
      }
      try {
        const { user: freshUser } = await fetchMe();
        setUser(freshUser);
      } catch {
        logout();
        return;
      } finally {
        setChecking(false);
      }
    }
    checkSession();
  }, []);

  function handleAuthSuccess(loggedInUser) {
    setUser(loggedInUser);
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-void-950">
        <p className="text-sm text-mist-500">جاري التحقق من الجلسة...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div dir="rtl" className="min-h-screen bg-void-950">
      <header className="sticky top-0 z-40 border-b border-void-700 bg-void-950/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <div className="halo-glow flex h-9 w-9 items-center justify-center rounded-full bg-nour-400/15 text-nour-400">
              <Sparkles size={17} />
            </div>
            <div>
              <h1 className="font-display text-base font-bold text-white">
                أهلاً، {user.name} <span className="align-middle">👋</span>
              </h1>
              <p className="text-xs text-mist-500">
                {user.role === 'mentor' ? 'حساب مرشد' : 'مساعدك NOUR lv1 شغال معاك'} · {todayLabel()}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 rounded-lg border border-void-700 px-3 py-1.5 text-sm text-mist-400 transition hover:border-void-600 hover:text-white"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">تسجيل الخروج</span>
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 md:px-8">
        <MentorBanner />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <TasksPanel />
            <MessagesPanel />
            <WeeklyComparisonChart />
          </div>

          <div className="h-[75vh] lg:sticky lg:top-24">
            <AISidebarChat />
          </div>
        </div>
      </main>
    </div>
  );
}
