import React from 'react';
import { HelpCircle, Clock, Award, ArrowRight } from 'lucide-react';
import type { Quiz } from '../../types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

interface QuizCardProps {
  quiz: Quiz;
  onStart: (id: number) => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({ quiz, onStart }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-3">
          <Badge variant="indigo" size="sm">
            {quiz.category.toUpperCase()}
          </Badge>
          <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
            <Clock className="w-3.5 h-3.5" />
            {Math.round(quiz.time_limit_seconds / 60)} mins
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-2">{quiz.title}</h3>
        <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {quiz.description}
        </p>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1 font-medium">
            <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
            {quiz.question_count} questions
          </span>
          <span className="flex items-center gap-1 font-medium">
            <Award className="w-3.5 h-3.5 text-emerald-500" />
            {quiz.passing_score}% pass
          </span>
        </div>

        <Button
          onClick={() => onStart(quiz.id)}
          size="sm"
          variant="outline"
          rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
        >
          Take Quiz
        </Button>
      </div>
    </div>
  );
};
