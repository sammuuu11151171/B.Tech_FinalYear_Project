import React, { useState, useEffect } from 'react';
import { TrendingUp, BookOpen, Award, Camera, CheckCircle2 } from 'lucide-react';
import { progressService } from '../../services/progressService';
import type { StudentDashboardSummary } from '../../types';
import { TopBar } from '../../components/navigation/TopBar';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { ProgressChart } from '../../components/progress/ProgressChart';
import { RevisionList } from '../../components/progress/RevisionList';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { WebcamPracticeModal } from '../../components/webcam/WebcamPracticeModal';

export const ProgressPage: React.FC = () => {
  const [summary, setSummary] = useState<StudentDashboardSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [practiceSign, setPracticeSign] = useState<string | null>(null);
  const [practiceLessonId, setPracticeLessonId] = useState<number | undefined>(undefined);

  const fetchSummary = async () => {
    try {
      const data = await progressService.getMyProgressSummary();
      setSummary(data);
    } catch (err) {
      console.error('Failed to load progress:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col">
        <TopBar title="Learning Analytics & Progress" />
        <div className="flex-1 flex items-center justify-center p-12">
          <LoadingSpinner label="Computing your competency and progress analytics..." size="lg" />
        </div>
      </div>
    );
  }

  const stats = summary?.stats;

  return (
    <div className="flex-1 flex flex-col">
      <TopBar
        title="Learning Analytics & Competency"
        subtitle="Transparent evaluation of completed lessons, quiz scores, and webcam practice accuracy."
      />

      <div className="p-6 lg:p-8 space-y-8 max-w-7xl">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card>
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lessons Finished</h4>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{stats?.completed_lessons || 0}</span>
              <span className="text-xs text-slate-400 font-semibold">/ {stats?.total_lessons || 0} Total</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all"
                style={{ width: `${stats?.completion_percentage || 0}%` }}
              />
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-5 h-5 text-sky-600" />
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Average Quiz Score</h4>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{stats?.average_quiz_score || 0}%</span>
              <span className="text-xs text-slate-400 font-semibold">across {stats?.total_quizzes_attempted || 0} tests</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
              <div
                className="bg-sky-600 h-full rounded-full transition-all"
                style={{ width: `${stats?.average_quiz_score || 0}%` }}
              />
            </div>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-2">
              <Camera className="w-5 h-5 text-emerald-600" />
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Webcam Recognition Accuracy</h4>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900">{stats?.practice_accuracy_percentage || 0}%</span>
              <span className="text-xs text-slate-400 font-semibold">({stats?.total_practice_attempts || 0} tries)</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all"
                style={{ width: `${stats?.practice_accuracy_percentage || 0}%` }}
              />
            </div>
          </Card>
        </div>

        {/* Charts & Revisions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ProgressChart
            completedLessons={stats?.completed_lessons || 0}
            totalLessons={stats?.total_lessons || 0}
            quizzesAttempted={stats?.total_quizzes_attempted || 0}
            averageScore={stats?.average_quiz_score || 0}
            practiceAttempts={stats?.total_practice_attempts || 0}
            practiceAccuracy={stats?.practice_accuracy_percentage || 0}
          />

          <RevisionList
            items={summary?.revisions_needed || []}
            onPracticeSign={(sign, lessonId) => {
              setPracticeSign(sign);
              setPracticeLessonId(lessonId);
            }}
          />
        </div>
      </div>

      {practiceSign && (
        <WebcamPracticeModal
          isOpen={!!practiceSign}
          onClose={() => setPracticeSign(null)}
          targetSign={practiceSign}
          lessonId={practiceLessonId}
          onLessonCompleted={fetchSummary}
        />
      )}
    </div>
  );
};
