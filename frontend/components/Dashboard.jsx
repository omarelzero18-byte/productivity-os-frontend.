'use client';
import { useEffect, useState } from 'react';
import AuthPage from './AuthPage';
import MentorBanner from './MentorBanner';
import TasksPanel from './TasksPanel';
import MessagesPanel from './MessagesPanel';
import WeeklyComparisonChart from './WeeklyComparisonChart';
import AISidebarChat from './AISidebarChat';
import { getToken, fetchMe, logout } from '../lib/auth';

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
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-500">جاري التحقق من الجلسة...</p>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-800">أهلاً، {user.name} 👋</h1>
          <p className="text-sm text-gray-500">
            {user.role === 'mentor' ? 'لخدمتك' : 'مساعدتك الشخصيه NOUR lv1 شغال معاك'}
          </p>
        </div>
        <button
          onClick={logout}
          className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 transition hover:bg-gray-100"
        >
          تسجيل الخروج
        </button>
      </div>

      <MentorBanner />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <TasksPanel />
          <MessagesPanel />
          <WeeklyComparisonChart />
        </div>

        <div className="h-[80vh] lg:sticky lg:top-8">
          <AISidebarChat />
        </div>
      </div>
    </div>
  );
}
