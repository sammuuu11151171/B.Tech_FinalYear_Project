import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Award,
  Camera,
  ArrowRight,
  TrendingUp,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { progressService } from '../../services/progressService';
import type { StudentDashboardSummary } from '../../types';
import { TopBar } from '../../components/navigation/TopBar';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ProgressChart } from '../../components/progress/ProgressChart';
import { RevisionList } from '../../components/progress/RevisionList';
import { ActivityTimeline } from '../../components/progress/ActivityTimeline';
import { WebcamPracticeModal } from '../../components/webcam/WebcamPracticeModal';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [summary, setSummary] = useState<StudentDashboardSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [practiceSign, setPracticeSign] = useState<string | null>(null);
  const [practiceLessonId, setPracticeLessonId] = useState<number | undefined>(undefined);

  const fetchSummary = async () => {
    try {
      const data = await progressService.getMyProgressSummary();
      setSummary(data);
    } catch (err) {
      console.error('Failed to load student summary:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const handlePracticeSign = (sign: string, lessonId?: number) => {
    setPracticeSign(sign);
    setPracticeLessonId(lessonId);
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col">
        <TopBar title="Student Dashboard" subtitle="Loading your personalized dashboard..." />
        <div className="flex-1 flex items-center justify-center p-12">
          <LoadingSpinner label="Fetching your real-time learning metrics..." size="lg" />
        </div>
      </div>
    );
  }

  const stats = summary?.stats;

  return (
    <div className="flex-1 flex flex-col">
      <TopBar
        title="Student Dashboard"
        subtitle={`Welcome back, ${user?.full_name}! Here is your real learning progress.`}
      />

      <div className="p-6 lg:p-8 space-y-8 max-w-7xl">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Lessons Completed
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black text-slate-900">
                  {stats?.completed_lessons || 0}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  / {stats?.total_lessons || 0} Total
                </span>
              </div>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Quiz Avg Score
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black text-slate-900">
                  {stats?.average_quiz_score || 0}%
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  ({stats?.total_quizzes_attempted || 0} Attempts)
                </span>
              </div>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Sign Practice Accuracy
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black text-slate-900">
                  {stats?.practice_accuracy_percentage || 0}%
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  ({stats?.total_practice_attempts || 0} Tries)
                </span>
              </div>
            </div>
          </Card>

          <Card className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Curriculum Progress
              </span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-black text-slate-900">
                  {stats?.completion_percentage || 0}%
                </span>
                <span className="text-xs text-emerald-600 font-semibold">Active</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Continue Learning Prompt */}
        {summary?.continue_lesson && (
          <div className="bg-gradient-to-r from-indigo-600 to-sky-700 rounded-3xl p-6 sm:p-8 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <Badge variant="indigo" size="sm" className="bg-white/20 text-white border-white/20 mb-3">
                Continue Learning
              </Badge>
              <h2 className="text-2xl font-black tracking-tight mb-1">
                {summary.continue_lesson.title}
              </h2>
              <p className="text-indigo-100 text-sm max-w-xl">
                Ready to master the sign for '{summary.continue_lesson.sign_label}'? Review visual instructions and test your camera execution.
              </p>
            </div>
            <Link to={`/student/learn/${summary.continue_lesson.id}`}>
              <Button
                variant="outline"
                className="bg-white text-indigo-700 hover:bg-indigo-50 border-white shrink-0 font-bold"
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Open Lesson
              </Button>
            </Link>
          </div>
        )}

        {/* Charts & Revision Recommendations */}
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
            onPracticeSign={handlePracticeSign}
          />
        </div>

        {/* Activity Feed */}
        <ActivityTimeline activities={summary?.recent_activities || []} />
      </div>

      {/* Practice Modal */}
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
