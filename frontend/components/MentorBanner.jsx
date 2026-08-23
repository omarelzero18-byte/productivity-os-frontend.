'use client';
import { useEffect, useState } from 'react';
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
    <div className="space-y-2 mb-6" dir="rtl">
      {directives.map((d) => (
        <div
          key={d.id}
          className="flex items-start justify-between gap-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 shadow-sm"
        >
          <div>
            <p className="text-sm font-semibold text-amber-800">توجيه من {d.mentor_name}</p>
            <p className="mt-1 text-amber-900">{d.message}</p>
          </div>
          <button
            onClick={() => dismiss(d.id)}
            className="text-amber-600 hover:text-amber-900 text-sm shrink-0"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
