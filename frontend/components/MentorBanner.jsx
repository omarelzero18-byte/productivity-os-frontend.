'use client';
import { useEffect, useState } from 'react';
import { Megaphone, X } from 'lucide-react';
import { apiFetch } from '../lib/api';

export default function MentorBanner() {
  const [directives, setDirectives] = useState([]);

  useEffect(() => {
    apiFetch('/mentor/directives').then(setDirectives).catch(() => {});
  }, []);

  const dismiss = async (id) => {
    await apiFetch(`/mentor/directives/${id}/dismiss`, { method: 'PATCH' });
    setDirectives((prev) => prev.filter((d) => d.id !== id));
  };

  if (!directives.length) return null;

  return (
    <div className="mb-6 space-y-2" dir="rtl">
      {directives.map((d) => (
        <div
          key={d.id}
          className="flex items-start justify-between gap-4 rounded-2xl border border-nour-400/25 bg-nour-400/[0.06] px-4 py-3"
        >
          <div className="flex items-start gap-3">
            <Megaphone size={16} className="mt-0.5 shrink-0 text-nour-400" />
            <div>
              <p className="text-sm font-semibold text-nour-300">توجيه من {d.mentor_name}</p>
              <p className="mt-1 text-sm text-mist-200">{d.message}</p>
            </div>
          </div>
          <button
            onClick={() => dismiss(d.id)}
            className="shrink-0 text-mist-500 transition hover:text-white"
            aria-label="إغلاق"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
