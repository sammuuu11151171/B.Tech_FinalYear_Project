import React from 'react';
import { BookOpen, HelpCircle, Camera, Check, X } from 'lucide-react';
import type { RecentActivityItem } from '../../types';

interface ActivityTimelineProps {
  activities: RecentActivityItem[];
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ activities }) => {
  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 text-center text-slate-500 text-sm">
        No learning activity recorded yet. Start by taking your first lesson!
      </div>
    );
  }

  const getIcon = (type: string, isPositive: boolean) => {
    switch (type) {
      case 'lesson_completed':
        return <BookOpen className="w-4 h-4 text-indigo-600" />;
      case 'quiz_attempt':
        return <HelpCircle className="w-4 h-4 text-sky-600" />;
      case 'sign_practice':
        return isPositive ? <Check className="w-4 h-4 text-emerald-600" /> : <X className="w-4 h-4 text-rose-600" />;
      default:
        return <Camera className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
      <h3 className="text-base font-bold text-slate-900 mb-4">Recent Learning Activity</h3>
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
        {activities.map((act) => (
          <div key={act.id} className="relative group">
            <div className="absolute -left-7 top-0.5 w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm">
              {getIcon(act.activity_type, act.is_positive)}
            </div>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-900">{act.title}</span>
                <span className="text-[11px] text-slate-400">
                  {new Date(act.timestamp).toLocaleDateString()}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">{act.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
