'use client';
import { useEffect, useMemo, useState } from 'react';
import { MessageCircle, Music2, Check, Archive, Inbox } from 'lucide-react';
import { apiFetch } from '../lib/api';

const PLATFORM_META = {
  whatsapp: { icon: MessageCircle, tint: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  tiktok: { icon: Music2, tint: 'text-fuchsia-400', bg: 'bg-fuchsia-400/10' },
};

function cleanText(raw) {
  if (!raw) return '';
  return raw
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\r\n/g, '\n')
    .replace(/\n{2,}/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .trim();
}

function relativeTime(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'دلوقتي';
  if (mins < 60) return `من ${mins} دقيقة`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `من ${hours} ساعة`;
  const days = Math.floor(hours / 24);
  return `من ${days} يوم`;
}

export default function MessagesPanel() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [localHandled, setLocalHandled] = useState({});

  useEffect(() => {
    apiFetch('/messages')
      .then(setMessages)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const markHandled = (id, action) => {
    setLocalHandled((prev) => ({ ...prev, [id]: action }));
  };

  const visibleMessages = useMemo(
    () => messages.filter((m) => !localHandled[m.id]),
    [messages, localHandled]
  );
  const autoReplied = visibleMessages.filter((m) => m.auto_replied);
  const needsAttention = visibleMessages.filter((m) => !m.auto_replied);

  return (
    <div dir="rtl" className="space-y-6">
      <div className="rounded-2xl border border-void-700 bg-void-900 p-5">
        <h3 className="mb-4 font-display text-sm font-semibold text-mist-300">
          رسائل محتاجة رد ({needsAttention.length})
        </h3>

        {loading ? (
          <div className="py-6 text-center text-sm text-mist-500">جاري التحميل...</div>
        ) : needsAttention.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-void-700 py-8 text-center">
            <Inbox size={20} className="text-mist-500" />
            <p className="text-sm text-mist-500">مفيش رسائل جديدة دلوقتي، الصندوق نضيف.</p>
          </div>
        ) : (
          <ul className="space-y-2.5">
            {needsAttention.map((m) => {
              const meta = PLATFORM_META[m.platform] || PLATFORM_META.whatsapp;
              const Icon = meta.icon;
              return (
                <li
                  key={m.id}
                  className="flex items-start gap-3 rounded-xl border border-void-700 bg-void-800/50 p-3 transition hover:border-void-600"
                >
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${meta.bg} ${meta.tint}`}>
                    <Icon size={16} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-medium text-white">
                        {m.sender_name || m.sender_identifier}
                      </p>
                      <span className="shrink-0 text-xs text-mist-500 tabular-nums">
                        {relativeTime(m.received_at)}
                      </span>
                    </div>
                    <p className="mt-1 whitespace-pre-line text-sm text-mist-300">{cleanText(m.content)}</p>
                  </div>
                  <div className="flex shrink-0 flex-col gap-1.5">
                    <button
                      onClick={() => markHandled(m.id, 'completed')}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-void-600 text-mist-400 transition hover:border-emerald-400 hover:text-emerald-400"
                      aria-label="تمت المعالجة"
                      title="تمت المعالجة"
                    >
                      <Check size={13} />
                    </button>
                    <button
                      onClick={() => markHandled(m.id, 'archived')}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-void-600 text-mist-400 transition hover:border-nour-400 hover:text-nour-400"
                      aria-label="أرشفة"
                      title="أرشفة"
                    >
                      <Archive size={13} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {autoReplied.length > 0 && (
        <div className="rounded-2xl border border-void-700 bg-void-900/50 p-5">
          <h3 className="mb-3 font-display text-sm font-semibold text-mist-400">
            اتردت آليًا عبر n8n ({autoReplied.length})
          </h3>
          <ul className="space-y-1.5">
            {autoReplied.map((m) => {
              const meta = PLATFORM_META[m.platform] || PLATFORM_META.whatsapp;
              const Icon = meta.icon;
              return (
                <li key={m.id} className="flex items-center gap-2 text-sm text-mist-500">
                  <Icon size={13} className={meta.tint} />
                  <span className="truncate">
                    {m.sender_name || m.sender_identifier}: {cleanText(m.content)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
                          }
