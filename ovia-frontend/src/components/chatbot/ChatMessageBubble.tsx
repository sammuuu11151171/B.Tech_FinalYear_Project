import React from 'react';
import { Sparkles, User } from 'lucide-react';
import type { SourceCitation } from '../../types';
import { CitationCard } from './CitationCard';

interface ChatMessageBubbleProps {
  sender: 'user' | 'tutor';
  message: string;
  sources?: SourceCitation[];
  timestamp?: string;
  onSelectSign?: (sign: string) => void;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({
  sender,
  message,
  sources = [],
  timestamp,
  onSelectSign,
}) => {
  const isUser = sender === 'user';

  return (
    <div className={`flex gap-3 mb-6 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          isUser ? 'bg-indigo-600 text-white' : 'bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-xs'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
      </div>

      {/* Message Content */}
      <div className={`max-w-2xl ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`p-4 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? 'bg-indigo-600 text-white rounded-tr-xs'
              : 'bg-white border border-slate-200/80 text-slate-800 shadow-xs rounded-tl-xs'
          }`}
        >
          {/* Format markdown-like bold text and line breaks */}
          <div className="whitespace-pre-wrap space-y-2">
            {message.split('\n\n').map((paragraph, pIdx) => (
              <p key={pIdx}>
                {paragraph.split('**').map((part, partIdx) =>
                  partIdx % 2 === 1 ? <strong key={partIdx}>{part}</strong> : part
                )}
              </p>
            ))}
          </div>

          {timestamp && (
            <div
              className={`text-[10px] mt-2 font-medium ${
                isUser ? 'text-indigo-200 text-right' : 'text-slate-400 text-left'
              }`}
            >
              {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          )}
        </div>

        {/* Source Citations */}
        {!isUser && sources && sources.length > 0 && (
          <div className="mt-3 space-y-2 w-full">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block px-1">
              Curated Curriculum References
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sources.map((cit, idx) => (
                <CitationCard key={idx} citation={cit} onSelectSign={onSelectSign} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
