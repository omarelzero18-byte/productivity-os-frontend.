'use client';
import { useEffect, useRef, useState } from 'react';
import { apiFetch } from '../lib/api';

export default function AISidebarChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    apiFetch('/ai/history').then((history) =>
      setMessages(history.map((h) => ({ role: h.role, content: h.message })))
    );
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const { reply } = await apiFetch('/ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message: userMsg.content }),
      });
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } catch (e) {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'معلش، حصل خطأ في الاتصال. جرب تاني.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="flex h-full flex-col rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-4 py-3">
        <h3 className="font-semibold text-indigo-700">🤖 NOUR lv1</h3>
        <p className="text-xs text-gray-400">مساعدتك الشخصية تحت امرك وهنا لخدمتك</p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
              m.role === 'user' ? 'mr-auto bg-indigo-600 text-white' : 'ml-auto bg-gray-100 text-gray-800'
            }`}
          >
            {m.content}
          </div>
        ))}
        {loading && <div className="ml-auto text-xs text-gray-400">NOUR بيكتب...</div>}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2 border-t border-gray-100 p-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="اكتب رسالتك لـ NOUR..."
          className="flex-1 rounded-full border border-gray-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        <button
          onClick={send}
          className="rounded-full bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700"
        >
          إرسال
        </button>
      </div>
    </div>
  );
}
