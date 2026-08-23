'use client';
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
import { apiFetch } from '../lib/api';

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-void-700 bg-void-800 px-3 py-2 text-xs shadow-xl">
      <p className="mb-1 font-semibold text-mist-300">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }} className="tabular-nums">
          {p.dataKey}: {p.value}
        </p>
      ))}
    </div>
  );
}

export default function WeeklyComparisonChart() {
  const [snapshots, setSnapshots] = useState([]);
  const [comparison, setComparison] = useState(null);

  useEffect(() => {
    apiFetch('/snapshots').then((data) => setSnapshots([...data].reverse()));
    apiFetch('/snapshots/compare').then(setComparison);
  }, []);

  const chartData = snapshots.map((s) => ({
    week: new Date(s.week_start_date).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' }),
    'نسبة الإنجاز': Number(s.completion_rate),
    'مهام مهملة': s.tasks_neglected,
  }));

  const diff = comparison?.diff?.completion_rate_diff;
  const TrendIcon = diff >= 0 ? TrendingUp : TrendingDown;

  return (
    <div dir="rtl" className="rounded-2xl border border-void-700 bg-void-900 p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-sm font-semibold text-mist-300">مقارنة الأداء الأسبوعي</h3>

        {diff !== undefined && (
          <span
            className={`flex items-center gap-1 text-xs font-medium tabular-nums ${
              diff >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            <TrendIcon size={13} />
            {Math.abs(diff)}% عن الأسبوع اللي فات
          </span>
        )}
      </div>

      {chartData.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <Sparkles size={18} className="text-mist-600" />
          <p className="text-sm text-mist-500">لسه مفيش بيانات كفاية للمقارنة الأسبوعية.</p>
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262631" />
              <XAxis dataKey="week" stroke="#77778A" fontSize={11} tickLine={false} />
              <YAxis stroke="#77778A" fontSize={11} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Legend wrapperStyle={{ fontSize: '12px', color: '#C7C7D1' }} />
              <Line type="monotone" dataKey="نسبة الإنجاز" stroke="#F2B84B" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="مهام مهملة" stroke="#FB7185" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {snapshots[snapshots.length - 1]?.ai_analysis && (
        <div className="mt-4 rounded-xl border border-nour-400/20 bg-nour-400/[0.05] p-3 text-sm text-mist-200">
          <strong className="text-nour-300">تحليل NOUR lv1: </strong>
          {snapshots[snapshots.length - 1].ai_analysis}
        </div>
      )}
    </div>
  );
}
