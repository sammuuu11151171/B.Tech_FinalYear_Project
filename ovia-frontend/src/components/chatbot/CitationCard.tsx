import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ExternalLink, ShieldCheck } from 'lucide-react';
import type { SourceCitation } from '../../types';

interface CitationCardProps {
  citation: SourceCitation;
  onSelectSign?: (sign: string) => void;
}

export const CitationCard: React.FC<CitationCardProps> = ({ citation, onSelectSign }) => {
  return (
    <div className="bg-white rounded-xl border border-indigo-100 p-3 shadow-2xs text-xs">
      <div className="flex items-start justify-between gap-2 mb-1">
        <span className="font-bold text-indigo-900 flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
          {onSelectSign && citation.sign_label ? (
            <button type="button" onClick={() => onSelectSign(citation.sign_label!)} className="text-left hover:underline">
              {citation.title}
            </button>
          ) : citation.title}
        </span>
        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shrink-0">
          Grounded Source
        </span>
      </div>

      <p className="text-slate-600 line-clamp-2 my-1.5 text-[11px] leading-relaxed">
        {citation.snippet}
      </p>

      <div className="flex items-center justify-between pt-1.5 border-t border-slate-100 mt-2">
        {citation.reference_image_url ? (
          <div className="flex items-center gap-1.5">
            <img
              src={citation.reference_image_url}
              alt={citation.title}
              className="w-5 h-5 rounded object-contain bg-slate-100 p-0.5"
            />
            <span className="text-[10px] text-slate-500 font-medium">Verified Sign Card</span>
          </div>
        ) : (
          <span className="text-[10px] text-slate-400">Curated Knowledge</span>
        )}

        {citation.lesson_id && (
          <Link
            to={`/learn/${citation.lesson_id}`}
            className="text-indigo-600 font-semibold hover:text-indigo-800 flex items-center gap-1"
          >
            Open Lesson
            <ExternalLink className="w-3 h-3" />
          </Link>
        )}
      </div>
    </div>
  );
};
