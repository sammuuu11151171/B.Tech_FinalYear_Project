import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle, Clock, ArrowRight, Eye } from 'lucide-react';
import { lessonService } from '../../services/lessonService';
import type { Lesson } from '../../types';
import { TopBar } from '../../components/navigation/TopBar';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const LearnPage: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [category, setCategory] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchLessons = async () => {
      setLoading(true);
      try {
        const catParam = category === 'all' ? undefined : category;
        const data = await lessonService.getLessons(catParam);
        setLessons(data);
      } catch (err) {
        console.error('Failed to load lessons:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchLessons();
  }, [category]);

  return (
    <div className="flex-1 flex flex-col">
      <TopBar
        title="ISL Curriculum & Lessons"
        subtitle="Explore verified Indian Sign Language static alphabets and numbers with step-by-step instructions."
      />

      <div className="p-6 lg:p-8 space-y-6 max-w-7xl">
        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {['all', 'alphabet', 'number'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                category === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {cat === 'all' ? 'All Curricula' : cat === 'alphabet' ? 'Alphabets (A-Z)' : 'Numbers (1-10)'}
            </button>
          ))}
        </div>

        {/* Lessons Grid */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner label="Loading ISL lessons..." />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {lessons.map((lesson) => (
              <div
                key={lesson.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Sign Card Header Preview */}
                  <div className="h-44 bg-slate-50 border-b border-slate-100 flex items-center justify-center p-4 relative group-hover:bg-indigo-50/20 transition-colors">
                    {lesson.reference_image_url ? (
                      <img
                        src={lesson.reference_image_url}
                        alt={`Sign for ${lesson.sign_label}`}
                        className="max-h-36 max-w-full object-contain"
                      />
                    ) : (
                      <span className="text-5xl font-black text-indigo-600">
                        {lesson.sign_label}
                      </span>
                    )}

                    <div className="absolute top-3 left-3">
                      <Badge variant="indigo" size="sm">
                        {lesson.category.toUpperCase()}
                      </Badge>
                    </div>

                    {lesson.status === 'completed' && (
                      <div className="absolute top-3 right-3 bg-emerald-500 text-white p-1 rounded-full shadow-xs">
                        <CheckCircle className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-indigo-600">
                        Sign '{lesson.sign_label}'
                      </span>
                      <Badge
                        variant={lesson.difficulty === 'beginner' ? 'success' : 'warning'}
                        size="sm"
                      >
                        {lesson.difficulty}
                      </Badge>
                    </div>

                    <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">
                      {lesson.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {lesson.description}
                    </p>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-5 pt-0">
                  <Link to={`/student/learn/${lesson.id}`} className="block">
                    <Button variant="outline" size="sm" className="w-full font-semibold" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      View Lesson & Practice
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
