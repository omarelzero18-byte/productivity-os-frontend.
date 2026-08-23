'use client';
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { apiFetch } from '../lib/api';

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

  return (
    <div dir="rtl" className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-4">مقارنة الأداء الأسبوعي</h3>

      {comparison?.diff && (
        <div className="mb-4 flex gap-4 text-sm">
          <span className={comparison.diff.completion_rate_diff >= 0 ? 'text-emerald-600' : 'text-red-600'}>
            {comparison.diff.completion_rate_diff >= 0 ? '▲' : '▼'}{' '}
            {Math.abs(comparison.diff.completion_rate_diff)}% عن الأسبوع اللي فات
          </span>
        </div>
      )}

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="نسبة الإنجاز" stroke="#10b981" strokeWidth={2} />
            <Line type="monotone" dataKey="مهام مهملة" stroke="#ef4444" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {snapshots[snapshots.length - 1]?.ai_analysis && (
        <div className="mt-4 rounded-lg bg-indigo-50 p-3 text-sm text-indigo-800">
          <strong>تحليل NOUR lv1:</strong> {snapshots[snapshots.length - 1].ai_analysis}
        </div>
      )}
    </div>
  );
}
