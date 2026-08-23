'use client';
import { useState } from 'react';
import { Sparkles, User, Mail, Lock, Send } from 'lucide-react';
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
    <div dir="rtl" className="flex min-h-screen items-center justify-center bg-void-950 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-void-700 bg-void-900 p-8 shadow-2xl">
        <div className="mb-7 flex flex-col items-center text-center">
          <div className="halo-glow mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-nour-400/15 text-nour-400">
            <Sparkles size={22} />
          </div>
          <h1 className="font-display text-2xl font-bold text-white">NOUR OS</h1>
          <p className="mt-1 text-sm text-mist-500">مساعدك الشخصي NOUR lv1 في انتظارك</p>
        </div>

        <div className="mb-6 flex rounded-xl bg-void-800 p-1">
          <button
            type="button"
            onClick={() => switchRole(ROLES.USER)}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
              role === ROLES.USER ? 'bg-nour-400 text-void-950' : 'text-mist-400 hover:text-mist-200'
            }`}
          >
            مستخدم
          </button>
          <button
            type="button"
            onClick={() => switchRole(ROLES.MENTOR)}
            className={`flex-1 rounded-lg py-2 text-sm font-medium transition ${
              role === ROLES.MENTOR ? 'bg-nour-400 text-void-950' : 'text-mist-400 hover:text-mist-200'
            }`}
          >
            مرشد (Mentor)
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="mb-1 block text-xs text-mist-400">الاسم</label>
              <div className="relative">
                <User size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-mist-500" />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-void-700 bg-void-800 py-2 pl-3 pr-9 text-sm text-white outline-none transition focus:border-nour-400"
                />
              </div>
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs text-mist-400">الإيميل</label>
            <div className="relative">
              <Mail size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-mist-500" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-void-700 bg-void-800 py-2 pl-3 pr-9 text-sm text-white outline-none transition focus:border-nour-400"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs text-mist-400">كلمة السر</label>
            <div className="relative">
              <Lock size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-mist-500" />
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full rounded-lg border border-void-700 bg-void-800 py-2 pl-3 pr-9 text-sm text-white outline-none transition focus:border-nour-400"
              />
            </div>
          </div>

          {mode === 'register' && role === ROLES.MENTOR && (
            <div>
              <label className="mb-1 block text-xs text-mist-400">Telegram Chat ID (اختياري)</label>
              <div className="relative">
                <Send size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-mist-500" />
                <input
                  type="text"
                  name="telegram_chat_id"
                  value={form.telegram_chat_id}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-void-700 bg-void-800 py-2 pl-3 pr-9 text-sm text-white outline-none transition focus:border-nour-400"
                />
              </div>
            </div>
          )}

          {error && <p className="text-sm text-rose-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-nour-400 py-2.5 font-semibold text-void-950 shadow-glow-sm transition hover:bg-nour-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'جاري التحميل...' : mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-mist-500">
          {mode === 'login' ? 'لسه معملتش حساب؟' : 'عندك حساب بالفعل؟'}{' '}
          <button
            type="button"
            onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
            className="font-medium text-nour-400 hover:text-nour-300"
          >
            {mode === 'login' ? 'إنشاء حساب جديد' : 'تسجيل الدخول'}
          </button>
        </p>
      </div>
    </div>
  );
}
