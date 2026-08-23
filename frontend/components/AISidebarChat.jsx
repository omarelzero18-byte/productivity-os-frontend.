'use client';
import { useEffect, useRef, useState } from 'react';
import { Sparkles, Send, Volume2, VolumeX } from 'lucide-react';
import { apiFetch } from '../lib/api';

const VOICE_PREF_KEY = 'nour_voice_enabled';

export default function AISidebarChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const arabicVoiceRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem(VOICE_PREF_KEY);
    if (saved !== null) setVoiceEnabled(saved === 'true');

    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const pickArabicVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      arabicVoiceRef.current =
        voices.find((v) => v.lang === 'ar-EG') ||
        voices.find((v) => v.lang?.startsWith('ar')) ||
        null;
    };
    pickArabicVoice();
    window.speechSynthesis.addEventListener('voiceschanged', pickArabicVoice);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', pickArabicVoice);
  }, []);

  useEffect(() => {
    apiFetch('/ai/history').then((history) =>
      setMessages(history.map((h) => ({ role: h.role, content: h.message })))
    );
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speak = (text) => {
    if (!voiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-EG';
    if (arabicVoiceRef.current) utterance.voice = arabicVoiceRef.current;
    utterance.rate = 0.95;
    utterance.pitch = 1.05;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const toggleVoice = () => {
    const next = !voiceEnabled;
    setVoiceEnabled(next);
    localStorage.setItem(VOICE_PREF_KEY, String(next));
    if (!next && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
    }
  };

  const send = async () => {
    if (!input.trim() || loading) return;
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
      speak(reply);
    } catch (e) {
      const fallback = 'معلش، حصل خطأ في الاتصال. جرب تاني.';
      setMessages((prev) => [...prev, { role: 'assistant', content: fallback }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div dir="rtl" className="flex h-full flex-col rounded-2xl border border-void-700 bg-void-900">
      <div className="flex items-center justify-between gap-2.5 border-b border-void-700 px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="halo-glow relative flex h-8 w-8 items-center justify-center rounded-full bg-nour-400/15 text-nour-400">
            <Sparkles size={15} />
            {speaking && (
              <span className="absolute -bottom-0.5 -left-0.5 h-2.5 w-2.5 animate-pulse-dot rounded-full bg-emerald-400 ring-2 ring-void-900" />
            )}
          </div>
          <div>
            <h3 className="font-display text-sm font-semibold text-white">NOUR lv1</h3>
            <p className="text-xs text-mist-500">{speaking ? 'بيتكلم دلوقتي...' : 'مساعدك الشخصي'}</p>
          </div>
        </div>

        <button
          onClick={toggleVoice}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-mist-400 transition hover:bg-void-800 hover:text-nour-400"
          aria-label={voiceEnabled ? 'إيقاف الصوت' : 'تشغيل الصوت'}
          title={voiceEnabled ? 'إيقاف الصوت' : 'تشغيل الصوت'}
        >
          {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.length === 0 && !loading && (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-center">
            <Sparkles size={20} className="text-mist-600" />
            <p className="text-sm text-mist-500">اسأل NOUR عن مهامك أو أي حاجة محتاجها.</p>
          </div>
        )}

        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
              m.role === 'user'
                ? 'mr-auto bg-nour-400 text-void-950 font-medium'
                : 'ml-auto bg-void-800 text-mist-200'
            }`}
          >
            {m.content}
          </div>
        ))}

        {loading && (
          <div className="ml-auto flex w-fit items-center gap-1.5 rounded-2xl bg-void-800 px-4 py-3">
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-nour-400 [animation-delay:-0.32s]" />
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-nour-400 [animation-delay:-0.16s]" />
            <span className="h-1.5 w-1.5 animate-pulse-dot rounded-full bg-nour-400" />
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-center gap-2 border-t border-void-700 p-3">
        <input
          ref={inputRef}
          value={input}
          disabled={loading}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="اكتب رسالتك لـ NOUR..."
          className="flex-1 rounded-full border border-void-700 bg-void-800 px-4 py-2.5 text-sm text-white outline-none transition placeholder:text-mist-500 focus:border-nour-400 disabled:opacity-60"
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-nour-400 text-void-950 transition hover:bg-nour-300 disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="إرسال"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}
