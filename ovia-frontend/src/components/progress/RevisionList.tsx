import React from 'react';
import { AlertCircle, ArrowRight, RotateCcw } from 'lucide-react';
import type { SignRevisionItem } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

interface RevisionListProps {
  items: SignRevisionItem[];
  onPracticeSign: (sign: string, lessonId?: number) => void;
}

export const RevisionList: React.FC<RevisionListProps> = ({ items, onPracticeSign }) => {
  if (items.length === 0) {
    return (
      <div className="bg-emerald-50/60 rounded-2xl border border-emerald-200/80 p-6 text-center">
        <h4 className="text-sm font-bold text-emerald-900 mb-1">High Accuracy Across Attempted Signs</h4>
        <p className="text-xs text-emerald-700">
          No signs currently require urgent revision based on your recorded performance. Keep practicing new lessons!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Recommended Revision Activities</h3>
          <p className="text-xs text-slate-500">
            Signs where your accuracy dropped below 70% or where mistakes occurred.
          </p>
        </div>
        <Badge variant="warning" size="sm">
          {items.length} Signs
        </Badge>
      </div>

      <div className="divide-y divide-slate-100">
        {items.map((item, idx) => (
          <div key={idx} className="py-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-extrabold flex items-center justify-center text-base">
                {item.sign_label}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900">
                    Sign '{item.sign_label}' ({item.category})
                  </span>
                  <Badge variant="danger" size="sm">
                    {item.accuracy_percentage}% Accuracy
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{item.recommendation_reason}</p>
              </div>
            </div>

            <Button
              onClick={() => onPracticeSign(item.sign_label, item.suggested_lesson_id)}
              variant="outline"
              size="sm"
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            >
              Revisit Sign
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
