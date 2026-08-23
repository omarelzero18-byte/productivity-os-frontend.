'use client';
import { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api';

export default function MessagesPanel() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    apiFetch('/messages').then(setMessages).catch(() => {});
  }, []);

  const autoReplied = messages.filter((m) => m.auto_replied);
  const needsAttention = messages.filter((m) => !m.auto_replied);
  const platformIcon = (p) => (p === 'whatsapp' ? '💬' : '🎵');

  return (
    <div dir="rtl" className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <h3 className="font-semibold text-gray-800 mb-3">رسائل محتاجة رد ({needsAttention.length})</h3>
        {needsAttention.length === 0 ? (
          <p className="text-gray-400 text-sm">مفيش رسائل جديدة.</p>
        ) : (
          <ul className="space-y-2">
            {needsAttention.map((m) => (
              <li key={m.id} className="rounded-lg border border-gray-100 px-3 py-2">
                <p className="text-sm text-gray-500">
                  {platformIcon(m.platform)} {m.sender_name || m.sender_identifier}
                </p>
                <p className="text-gray-800">{m.content}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      {autoReplied.length > 0 && (
        <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <h3 className="font-semibold text-gray-600 mb-3">اتردت آليًا عبر n8n ({autoReplied.length})</h3>
          <ul className="space-y-1">
            {autoReplied.map((m) => (
              <li key={m.id} className="text-sm text-gray-500">
                {platformIcon(m.platform)} {m.sender_name || m.sender_identifier}: {m.content}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
