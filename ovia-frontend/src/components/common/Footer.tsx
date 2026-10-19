import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Accessibility } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Purpose */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                OV
              </div>
              <span className="text-xl font-bold text-white tracking-tight">OVIA</span>
            </div>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed mb-4">
              AI-Powered Inclusive Learning Portal designed for Deaf and Hard-of-Hearing individuals to learn, practice, and assess Indian Sign Language with real-time feedback.
            </p>
            <div className="flex items-center gap-2 text-xs text-indigo-400">
              <Accessibility className="w-4 h-4" />
              <span>Built with WCAG 2.1 accessible visual-first principles</span>
            </div>
          </div>

          {/* Learning Links */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Learning Modules</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/learn?category=alphabet" className="hover:text-white transition-colors">
                  ISL Alphabets (A-Z)
                </Link>
              </li>
              <li>
                <Link to="/learn?category=number" className="hover:text-white transition-colors">
                  ISL Numbers (1-10)
                </Link>
              </li>
              <li>
                <Link to="/quizzes" className="hover:text-white transition-colors">
                  Interactive Assessments
                </Link>
              </li>
              <li>
                <Link to="/ai-tutor" className="hover:text-white transition-colors">
                  RAG ISL Tutor
                </Link>
              </li>
            </ul>
          </div>

          {/* Academic & Disclaimers */}
          <div>
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-4">Final Year CSE Project</h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Final-year B.Tech Computer Science and Engineering Capstone Project.
            </p>
            <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-700/60 text-xs text-slate-300">
              <span className="font-semibold text-amber-400 block mb-1">Educational Notice:</span>
              OVIA supports self-paced learning and practice. It does not replace certified sign-language teachers.
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} OVIA. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Privacy-first transient frame processing
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
