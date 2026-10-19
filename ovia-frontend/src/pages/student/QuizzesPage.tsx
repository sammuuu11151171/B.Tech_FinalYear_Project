import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, Award, CheckCircle, Clock } from 'lucide-react';
import { quizService } from '../../services/quizService';
import type { Quiz, QuizAttempt } from '../../types';
import { TopBar } from '../../components/navigation/TopBar';
import { QuizCard } from '../../components/quizzes/QuizCard';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const QuizzesPage: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [quizList, attemptList] = await Promise.all([
          quizService.getQuizzes(),
          quizService.getMyAttempts(),
        ]);
        setQuizzes(quizList);
        setAttempts(attemptList);
      } catch (err) {
        console.error('Failed to load quiz data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleStartQuiz = (id: number) => {
    navigate(`/student/quizzes/${id}`);
  };

  return (
    <div className="flex-1 flex flex-col">
      <TopBar
        title="Interactive ISL Assessments"
        subtitle="Validate your recognition with multiple-choice questions and live webcam sign-practice challenges."
      />

      <div className="p-6 lg:p-8 space-y-8 max-w-7xl">
        {loading ? (
          <div className="py-20 flex justify-center">
            <LoadingSpinner label="Loading assessments..." />
          </div>
        ) : (
          <>
            {/* Active Quizzes Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-slate-900">Available Quizzes</h2>
                <Badge variant="indigo" size="sm">
                  {quizzes.length} Tests Ready
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quizzes.map((q) => (
                  <QuizCard key={q.id} quiz={q} onStart={handleStartQuiz} />
                ))}
              </div>
            </div>

            {/* Past Attempts History */}
            {attempts.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
                <h3 className="text-base font-bold text-slate-900 mb-4">Recent Attempt History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-100">
                      <tr>
                        <th className="py-3 px-4">Quiz Title</th>
                        <th className="py-3 px-4">Score Earned</th>
                        <th className="py-3 px-4">Percentage</th>
                        <th className="py-3 px-4">Result</th>
                        <th className="py-3 px-4">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {attempts.map((att) => (
                        <tr key={att.id} className="hover:bg-slate-50/50">
                          <td className="py-3 px-4 font-semibold text-slate-900">{att.quiz_title}</td>
                          <td className="py-3 px-4">
                            {att.score} / {att.total_points}
                          </td>
                          <td className="py-3 px-4 font-bold text-indigo-600">{att.percentage}%</td>
                          <td className="py-3 px-4">
                            <Badge variant={att.passed ? 'success' : 'danger'} size="sm">
                              {att.passed ? 'Passed' : 'Needs Review'}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-slate-400">
                            {new Date(att.completed_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
