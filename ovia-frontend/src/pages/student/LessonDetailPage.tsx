import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Camera, HelpCircle } from 'lucide-react';
import { lessonService } from '../../services/lessonService';
import type { Lesson } from '../../types';
import { TopBar } from '../../components/navigation/TopBar';
import { SignVisualGuide } from '../../components/learning/SignVisualGuide';
import { WebcamPracticeModal } from '../../components/webcam/WebcamPracticeModal';
import { Button } from '../../components/common/Button';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const LessonDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [showPractice, setShowPractice] = useState<boolean>(false);
  const [isMarking, setIsMarking] = useState<boolean>(false);

  const fetchLesson = async () => {
    if (!id) return;
    try {
      const data = await lessonService.getLessonById(Number(id));
      setLesson(data);
    } catch (err) {
      console.error('Failed to load lesson:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLesson();
  }, [id]);

  const handleMarkComplete = async () => {
    if (!lesson) return;
    setIsMarking(true);
    try {
      await lessonService.markCompleted(lesson.id);
      fetchLesson();
    } catch (err) {
      console.error('Error marking complete:', err);
    } finally {
      setIsMarking(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col">
        <TopBar title="Lesson Viewer" subtitle="Loading lesson content..." />
        <div className="flex-1 flex items-center justify-center p-12">
          <LoadingSpinner label="Retrieving verified ISL lesson content..." size="lg" />
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-600 mb-4">Lesson not found.</p>
        <Link to="/student/learn">
          <Button variant="outline">Back to Curriculum</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <TopBar title={lesson.title} subtitle={`Category: ${lesson.category} | Difficulty: ${lesson.difficulty}`} />

      <div className="p-6 lg:p-8 space-y-6 max-w-5xl">
        {/* Back Link & Quick Actions */}
        <div className="flex items-center justify-between">
          <Link
            to="/student/learn"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Lessons
          </Link>

          <div className="flex items-center gap-2">
            {lesson.status === 'completed' ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Lesson Completed
              </span>
            ) : (
              <Button
                onClick={handleMarkComplete}
                isLoading={isMarking}
                variant="outline"
                size="sm"
                leftIcon={<CheckCircle2 className="w-4 h-4" />}
              >
                Mark as Completed
              </Button>
            )}

            <Button
              onClick={() => setShowPractice(true)}
              variant="primary"
              size="sm"
              leftIcon={<Camera className="w-4 h-4" />}
            >
              Start Webcam Practice
            </Button>
          </div>
        </div>

        {/* Visual Guide Component */}
        <SignVisualGuide lesson={lesson} onStartPractice={() => setShowPractice(true)} />

        {/* Webcam Modal */}
        <WebcamPracticeModal
          isOpen={showPractice}
          onClose={() => setShowPractice(false)}
          targetSign={lesson.sign_label}
          lessonId={lesson.id}
          onLessonCompleted={fetchLesson}
        />
      </div>
    </div>
  );
};
