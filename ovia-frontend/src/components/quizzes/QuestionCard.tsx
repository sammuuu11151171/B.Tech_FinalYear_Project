import React, { useState } from 'react';
import { Camera, CheckCircle2, Sparkles } from 'lucide-react';
import type { QuizQuestion } from '../../types';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { WebcamPracticeModal } from '../webcam/WebcamPracticeModal';

interface QuestionCardProps {
  question: QuizQuestion;
  index: number;
  selectedAnswer: string;
  onSelectAnswer: (val: string) => void;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  selectedAnswer,
  onSelectAnswer,
}) => {
  const [showWebcam, setShowWebcam] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center">
            {index + 1}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {question.question_type === 'sign_practice' ? 'Webcam Sign Question' : 'Multiple Choice'}
          </span>
        </div>
        <Badge variant="neutral" size="sm">
          {question.points} Points
        </Badge>
      </div>

      <h3 className="text-base font-semibold text-slate-900 mb-5 leading-relaxed">
        {question.question_text}
      </h3>

      {question.question_type === 'multiple_choice' ? (
        <div className="space-y-3">
          {question.options.map((option, optIdx) => {
            const isSelected = selectedAnswer === option;
            return (
              <button
                key={optIdx}
                type="button"
                onClick={() => onSelectAnswer(option)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-medium ring-2 ring-indigo-500/20'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs font-semibold ${
                      isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300 text-slate-400'
                    }`}
                  >
                    {String.fromCharCode(65 + optIdx)}
                  </span>
                  <span className="text-sm leading-snug">{option}</span>
                </div>
                {isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      ) : (
        /* Sign Practice Question */
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 text-center flex flex-col items-center">
          <Camera className="w-10 h-10 text-indigo-500 mb-3" />
          <p className="text-sm text-slate-700 font-medium mb-1">
            Perform the target sign <strong className="text-indigo-600 font-bold">'{question.target_sign}'</strong> using your webcam.
          </p>
          <p className="text-xs text-slate-500 mb-4">
            The computer vision model will evaluate your hand configuration and record your response.
          </p>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowWebcam(true)}
              variant="primary"
              size="sm"
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Open Camera to Sign
            </Button>
            {selectedAnswer && (
              <Badge variant="success" size="md">
                Recorded: {selectedAnswer}
              </Badge>
            )}
          </div>

          <WebcamPracticeModal
            isOpen={showWebcam}
            onClose={() => setShowWebcam(false)}
            targetSign={question.target_sign || ''}
            onLessonCompleted={() => {
              if (question.target_sign) {
                onSelectAnswer(question.target_sign);
              }
            }}
          />
        </div>
      )}
    </div>
  );
};
