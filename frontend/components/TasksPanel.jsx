'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';

export default function TasksPanel() {
  const [todayTasks, setTodayTasks] = useState([]);
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [today, overdue] = await Promise.all([
      apiFetch('/tasks/today'),
      apiFetch('/tasks/overdue'),
    ]);
    setTodayTasks(today);
    setOverdueTasks(overdue);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const markComplete = async (id) => {
    await apiFetch(`/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'completed' }),
    });
    load();
  };

  if (loading) return <div className="p-4 text-gray-400">جاري التحميل...</div>;

  return (
    <div dir="rtl" className="space-y-6">
      {overdueTasks.length > 0 && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-4">
          <h3 className="font-semibold text-red-700 mb-2">⚠️ مهام متأخرة ({overdueTasks.length})</h3>
          <ul className="space-y-1">
            {overdueTasks.map((t) => (
              <li key={t.id} className="text-red-800 text-sm">
                {t.title} — كان المفروض يخلص {new Date(t.due_date).toLocaleDateString('ar-EG')}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-3">مهام النهاردة</h3>
        {todayTasks.length === 0 ? (
          <p className="text-gray-400 text-sm">مفيش مهام مسجلة النهاردة.</p>
        ) : (
          <ul className="space-y-2">
            {todayTasks.map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2"
              >
                <div>
                  <p className={t.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-800'}>
                    {t.title}
                  </p>
                  <span className="text-xs text-gray-400">أولوية: {t.priority}</span>
                </div>
                {t.status !== 'completed' && (
                  <button
                    onClick={() => markComplete(t.id)}
                    className="text-sm bg-emerald-500 text-white px-3 py-1 rounded-lg hover:bg-emerald-600"
                  >
                    تم ✓
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
