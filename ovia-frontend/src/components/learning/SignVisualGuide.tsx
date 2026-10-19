import React from 'react';
import { Eye, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import type { Lesson } from '../../types';
import { Badge } from '../common/Badge';

interface SignVisualGuideProps {
  lesson: Lesson;
  onStartPractice: () => void;
}

export const SignVisualGuide: React.FC<SignVisualGuideProps> = ({ lesson, onStartPractice }) => {
  const steps = lesson.instructions.split('\n').filter((s) => s.trim().length > 0);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-slate-50 to-indigo-50/30">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="indigo" size="sm">
              {lesson.category.toUpperCase()}
            </Badge>
            <Badge variant={lesson.difficulty === 'beginner' ? 'success' : 'warning'} size="sm">
              {lesson.difficulty}
            </Badge>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{lesson.title}</h2>
        </div>

        <button
          onClick={onStartPractice}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 active:bg-indigo-800 shadow-md shadow-indigo-200 transition-all cursor-pointer"
        >
          <Eye className="w-4 h-4" />
          Practice With Webcam
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 lg:p-8">
        {/* Left Column: Visual Illustration */}
        <div className="flex flex-col items-center justify-center bg-slate-50 rounded-2xl p-6 border border-slate-100">
          <div className="w-64 h-64 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center p-4 overflow-hidden relative">
            {lesson.reference_image_url ? (
              <img
                src={lesson.reference_image_url}
                alt={`Verified Indian Sign Language sign for ${lesson.sign_label}`}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="text-center text-slate-400">
                <span className="text-6xl font-black text-indigo-600">{lesson.sign_label}</span>
                <p className="text-xs mt-2">Verified Visual Reference</p>
              </div>
            )}
          </div>
          <div className="mt-4 text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Verified Static Representation
            </span>
            <p className="text-sm text-slate-700 font-medium mt-0.5">
              Target Sign: <strong className="text-indigo-600 font-bold">{lesson.sign_label}</strong>
            </p>
          </div>
        </div>

        {/* Right Column: Step-by-Step Execution Guide */}
        <div className="flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Overview
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
              {lesson.description}
            </p>

            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Step-by-Step Instructions
            </h3>

            <div className="space-y-3 mb-6">
              {steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs shrink-0">
                    {idx + 1}
                  </span>
                  <span className="pt-0.5 leading-snug">{step.replace(/^\d+\.\s*/, '')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Practice Prompt Banner */}
          <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-indigo-600 shrink-0" />
              <div className="text-xs text-indigo-900">
                <p className="font-semibold">Ready to test your hand pose?</p>
                <p className="text-indigo-700">Open your camera to receive instant ML feedback.</p>
              </div>
            </div>
            <button
              onClick={onStartPractice}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-white px-3 py-1.5 rounded-lg border border-indigo-200 shadow-2xs cursor-pointer hover:bg-indigo-50"
            >
              Start Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
