'use client';
import { useState } from 'react';
import { loginUser, registerUser, loginMentor, registerMentor } from '../lib/auth';

const ROLES = { USER: 'user', MENTOR: 'mentor' };

export default function AuthPage({ onAuthSuccess }) {
  const [role, setRole] = useState(ROLES.USER);
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '', telegram_chat_id: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function switchMode(newMode) {
    setError('');
    setMode(newMode);
  }

  function switchRole(newRole) {
    setError('');
    setRole(newRole);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      let user;
      if (role === ROLES.USER) {
        user =
          mode === 'login'
            ? await loginUser({ email: form.email, password: form.password })
            : await registerUser({ name: form.name, email: form.email, password: form.password });
      } else {
        user =
          mode === 'login'
            ? await loginMentor({ email: form.email, password: form.password })
            : await registerMentor({
                name: form.name,
                email: form.email,
                password: form.password,
                telegram_chat_id: form.telegram_chat_id,
              });
      }
      onAuthSuccess?.(user);
    } catch (err) {
      setError(err.message || 'حصل خطأ، حاول تاني');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div dir="rtl" className="flex min-h-screen items-center justify-center bg-gray-950 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-white">Personal Productivity OS</h1>
          <p className="mt-1 text-sm text-gray-400">مساعدك الشخصي NOUR lv1 في انتظارك</p>
        </div>

        <div className="mb-6 flex rounded-lg bg-gray-800 p-1">
          <button
            type="button"
            onClick={() => switchRole(ROLES.USER)}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
              role === ROLES.USER ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            مستخدم
          </button>
          <button
            type="button"
            onClick={() => switchRole(ROLES.MENTOR)}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
              role === ROLES.MENTOR ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            مرشد (Mentor)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="mb-1 block text-sm text-gray-300">الاسم</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white outline-none transition focus:border-indigo-500"
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm text-gray-300">الإيميل</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white outline-none transition focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-300">كلمة السر</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white outline-none transition focus:border-indigo-500"
            />
          </div>

          {mode === 'register' && role === ROLES.MENTOR && (
            <div>
              <label className="mb-1 block text-sm text-gray-300">Telegram Chat ID (اختياري)</label>
              <input
                type="text"
                name="telegram_chat_id"
                value={form.telegram_chat_id}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-white outline-none transition focus:border-indigo-500"
              />
            </div>
          )}

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-indigo-600 py-2.5 font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'جاري التحميل...' : mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          {mode === 'login' ? 'لسه معملتش حساب؟' : 'عندك حساب بالفعل؟'}{' '}
          <button
            type="button"
            onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
            className="font-medium text-indigo-400 hover:text-indigo-300"
          >
            {mode === 'login' ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
          </button>
        </p>
      </div>
    </div>
  );
}
