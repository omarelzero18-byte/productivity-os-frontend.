'use client';
import { useEffect, useMemo, useState } from 'react';
import { Plus, Sparkles, Clock, X, Check } from 'lucide-react';
import { apiFetch } from '../lib/api';

const PRIORITY_META = {
  urgent: { label: 'عاجلة', bar: 'bg-rose-400', text: 'text-rose-400' },
  high: { label: 'مهمة', bar: 'bg-nour-400', text: 'text-nour-400' },
  medium: { label: 'متوسطة', bar: 'bg-mist-400', text: 'text-mist-400' },
  low: { label: 'بسيطة', bar: 'bg-void-600', text: 'text-mist-500' },
};

const EMPTY_TASK_FORM = {
  title: '',
  description: '',
  category: '',
  priority: 'medium',
  due_date: new Date().toISOString().slice(0, 10),
  due_time: '',
};

export default function TasksPanel() {
  const [todayTasks, setTodayTasks] = useState([]);
  const [overdueTasks, setOverdueTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_TASK_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

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

  const openModal = () => {
    setForm(EMPTY_TASK_FORM);
    setFormError('');
    setModalOpen(true);
  };

  const submitTask = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setFormError('محتاج عنوان للمهمة الأول');
      return;
    }
    setSaving(true);
    setFormError('');
    try {
      await apiFetch('/tasks', {
        method: 'POST',
        body: JSON.stringify({
          title: form.title.trim(),
          description: form.description.trim() || undefined,
          category: form.category.trim() || undefined,
          priority: form.priority,
          due_date: form.due_date,
          due_time: form.due_time || undefined,
        }),
      });
      setModalOpen(false);
      load();
    } catch (err) {
      setFormError(err.message || 'حصل خطأ في إنشاء المهمة');
    } finally {
      setSaving(false);
    }
  };

  const completedCount = useMemo(
    () => todayTasks.filter((t) => t.status === 'completed').length,
    [todayTasks]
  );
  const totalCount = todayTasks.length;
  const percent = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (percent / 100) * circumference;

  return (
    <div dir="rtl" className="space-y-6">
      {overdueTasks.length > 0 && (
        <div className="rounded-2xl border border-rose-500/20 bg-rose-500/[0.06] p-4 animate-fade-up">
          <h3 className="mb-2 flex items-center gap-2 font-display text-sm font-semibold text-rose-400">
            <Clock size={16} /> مهام متأخرة ({overdueTasks.length})
          </h3>
          <ul className="space-y-1.5">
            {overdueTasks.map((t) => (
              <li key={t.id} className="text-sm text-rose-300/90">
                {t.title} — كان المفروض يخلص {new Date(t.due_date).toLocaleDateString('ar-EG')}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-center justify-between rounded-2xl border border-void-700 bg-void-900 p-5">
        <div className="flex items-center gap-4">
          <div className="halo-glow relative h-24 w-24 shrink-0">
            <svg viewBox="0 0 100 100" className="h-24 w-24 -rotate-90">
              <circle cx="50" cy="50" r={radius} fill="none" stroke="#1B1B24" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke="#F2B84B"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-xl font-bold text-nour-300 tabular-nums">{percent}%</span>
            </div>
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold text-white">إنجاز النهاردة</h2>
            <p className="mt-1 text-sm text-mist-400 tabular-nums">
              {completedCount} من {totalCount} مهمة خلصانة
            </p>
          </div>
        </div>

        <button
          onClick={openModal}
          className="flex items-center gap-1.5 rounded-xl bg-nour-400 px-4 py-2.5 text-sm font-semibold text-void-950 shadow-glow-sm transition hover:bg-nour-300 active:scale-[0.97]"
        >
          <Plus size={16} strokeWidth={2.5} />
          مهمة جديدة
        </button>
      </div>

      <div className="rounded-2xl border border-void-700 bg-void-900 p-5">
        <h3 className="mb-4 font-display text-sm font-semibold text-mist-300">مهام النهاردة</h3>

        {loading ? (
          <div className="py-8 text-center text-sm text-mist-500">جاري التحميل...</div>
        ) : todayTasks.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-void-700 py-10 text-center animate-fade-up">
            <div className="halo-glow flex h-12 w-12 items-center justify-center rounded-full bg-void-800 text-nour-400">
              <Sparkles size={22} />
            </div>
            <p className="font-display text-base font-semibold text-white">لسه معملتش أي خطوة النهاردة</p>
            <p className="max-w-xs text-sm text-mist-500">ابدأ بمهمة واحدة بس — النور بيبدأ بشمعة.</p>
            <button
              onClick={openModal}
              className="mt-1 rounded-lg bg-nour-400/10 px-4 py-2 text-sm font-medium text-nour-300 transition hover:bg-nour-400/20"
            >
              يلا نبدأ
            </button>
          </div>
        ) : (
          <ul className="space-y-2">
            {todayTasks.map((t) => {
              const meta = PRIORITY_META[t.priority] || PRIORITY_META.medium;
              const done = t.status === 'completed';
              return (
                <li
                  key={t.id}
                  className="flex items-center gap-3 rounded-xl border border-void-700 bg-void-800/50 px-3 py-3 transition hover:border-void-600"
                >
                  <span className={`h-8 w-1 shrink-0 rounded-full ${meta.bar}`} />
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-sm font-medium ${done ? 'text-mist-500 line-through' : 'text-white'}`}>
                      {t.title}
                    </p>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-mist-500">
                      <span className={meta.text}>{meta.label}</span>
                      {t.due_time && (
                        <span className="flex items-center gap-1 tabular-nums">
                          <Clock size={11} /> {t.due_time.slice(0, 5)}
                        </span>
                      )}
                    </div>
                  </div>
                  {!done && (
                    <button
                      onClick={() => markComplete(t.id)}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-void-600 text-mist-400 transition hover:border-emerald-400 hover:text-emerald-400"
                      aria-label="تم الإنجاز"
                    >
                      <Check size={16} />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm animate-fade-up"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-void-700 bg-void-900 p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-white">مهمة جديدة</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-mist-500 transition hover:text-white"
                aria-label="إغلاق"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={submitTask} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs text-mist-400">عنوان المهمة *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  autoFocus
                  className="w-full rounded-lg border border-void-700 bg-void-800 px-3 py-2 text-sm text-white outline-none transition focus:border-nour-400"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-mist-400">وصف (اختياري)</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={2}
                  className="w-full resize-none rounded-lg border border-void-700 bg-void-800 px-3 py-2 text-sm text-white outline-none transition focus:border-nour-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-mist-400">الأولوية</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="w-full rounded-lg border border-void-700 bg-void-800 px-3 py-2 text-sm text-white outline-none transition focus:border-nour-400"
                  >
                    <option value="urgent">عاجلة</option>
                    <option value="high">مهمة</option>
                    <option value="medium">متوسطة</option>
                    <option value="low">بسيطة</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-mist-400">التصنيف (اختياري)</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="شغل، شخصي..."
                    className="w-full rounded-lg border border-void-700 bg-void-800 px-3 py-2 text-sm text-white outline-none transition focus:border-nour-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-mist-400">تاريخ الاستحقاق *</label>
                  <input
                    type="date"
                    value={form.due_date}
                    onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                    className="w-full rounded-lg border border-void-700 bg-void-800 px-3 py-2 text-sm text-white outline-none transition focus:border-nour-400 tabular-nums"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-mist-400">الوقت (اختياري)</label>
                  <input
                    type="time"
                    value={form.due_time}
                    onChange={(e) => setForm({ ...form, due_time: e.target.value })}
                    className="w-full rounded-lg border border-void-700 bg-void-800 px-3 py-2 text-sm text-white outline-none transition focus:border-nour-400 tabular-nums"
                  />
                </div>
              </div>

              {formError && <p className="text-sm text-rose-400">{formError}</p>}

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-lg bg-nour-400 py-2.5 text-sm font-semibold text-void-950 transition hover:bg-nour-300 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? 'جاري الحفظ...' : 'حفظ المهمة'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
            }
