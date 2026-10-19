import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ProgressChartProps {
  completedLessons: number;
  totalLessons: number;
  quizzesAttempted: number;
  averageScore: number;
  practiceAttempts: number;
  practiceAccuracy: number;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({
  completedLessons,
  totalLessons,
  quizzesAttempted,
  averageScore,
  practiceAttempts,
  practiceAccuracy,
}) => {
  const data = [
    { name: 'Lessons', Progress: completedLessons, Target: totalLessons },
    { name: 'Quizzes Attempted', Progress: quizzesAttempted, Target: 5 },
    { name: 'Practice Attempts', Progress: practiceAttempts, Target: Math.max(practiceAttempts, 10) },
    { name: 'Quiz Avg %', Progress: averageScore, Target: 100 },
    { name: 'Sign Accuracy %', Progress: practiceAccuracy, Target: 100 },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
      <h3 className="text-base font-bold text-slate-900 mb-4">Competency & Progress Breakdown</h3>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="Progress" fill="#4f46e5" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
