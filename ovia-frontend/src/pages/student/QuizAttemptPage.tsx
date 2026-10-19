import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle, XCircle, Award, RotateCcw } from 'lucide-react';
import { quizService } from '../../services/quizService';
import type { QuizDetail, QuizAttempt } from '../../types';
import { TopBar } from '../../components/navigation/TopBar';
import { QuestionCard } from '../../components/quizzes/QuestionCard';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const QuizAttemptPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState<QuizDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [responses, setResponses] = useState<{ [key: number]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [result, setResult] = useState<QuizAttempt | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!id) return;
      try {
        const data = await quizService.getQuizById(Number(id));
        setQuiz(data);
      } catch (err) {
        console.error('Failed to load quiz:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  const handleSelectAnswer = (qId: number, answer: string) => {
    setResponses((prev) => ({ ...prev, [qId]: answer }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    setIsSubmitting(true);
    try {
      const payload = Object.entries(responses).map(([question_id, selected_answer]) => ({
        question_id: Number(question_id),
        selected_answer,
      }));

      const attemptResult = await quizService.submitQuiz(quiz.id, payload);
      setResult(attemptResult);
    } catch (err) {
      console.error('Failed to submit quiz attempt:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col">
        <TopBar title="Loading Quiz..." />
        <div className="flex-1 flex items-center justify-center p-12">
          <LoadingSpinner label="Setting up your test questions..." size="lg" />
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-600 mb-4">Quiz not found.</p>
        <Link to="/student/quizzes">
          <Button variant="outline">Back to Quizzes</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <TopBar title={quiz.title} subtitle={`Category: ${quiz.category} | Passing Score: ${quiz.passing_score}%`} />

      <div className="p-6 lg:p-8 space-y-6 max-w-4xl">
        <div className="flex items-center justify-between">
          <Link
            to="/student/quizzes"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Quizzes
          </Link>
        </div>

        {/* Result Summary View */}
        {result ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-md space-y-6">
            <div className="text-center max-w-md mx-auto">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  result.passed ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'
                }`}
              >
                {result.passed ? <Award className="w-8 h-8" /> : <RotateCcw className="w-8 h-8" />}
              </div>

              <Badge variant={result.passed ? 'success' : 'danger'} size="md" className="mb-2">
                {result.passed ? 'Assessment Passed' : 'Needs Practice'}
              </Badge>

              <h2 className="text-2xl font-black text-slate-900">
                You scored {result.percentage}%
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Earned {result.score} out of {result.total_points} total points.
              </p>
            </div>

            {/* Question Breakdown */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Question Evaluation Breakdown</h3>
              {result.results.map((res, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border text-xs leading-relaxed ${
                    res.is_correct ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950' : 'bg-rose-50/60 border-rose-200 text-rose-950'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2 font-semibold">
                    <span>
                      {idx + 1}. {res.question_text}
                    </span>
                    <span className="font-bold shrink-0">
                      {res.points_earned} / {res.max_points} pts
                    </span>
                  </div>
                  <div className="space-y-1 text-slate-700">
                    <p>
                      Your Answer: <strong className={res.is_correct ? 'text-emerald-700 font-bold' : 'text-rose-700 font-bold'}>{res.selected_answer}</strong>
                    </p>
                    {!res.is_correct && (
                      <p>
                        Correct Verified Answer: <strong className="text-emerald-700 font-bold">{res.correct_answer}</strong>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-4 pt-4">
              <Button
                onClick={() => {
                  setResult(null);
                  setResponses({});
                }}
                variant="outline"
              >
                Retry Quiz
              </Button>
              <Link to="/student/progress">
                <Button variant="primary">View Updated Progress</Button>
              </Link>
            </div>
          </div>
        ) : (
          /* Active Quiz Questions Form */
          <div className="space-y-6">
            <div className="space-y-6">
              {quiz.questions.map((q, idx) => (
                <QuestionCard
                  key={q.id}
                  question={q}
                  index={idx}
                  selectedAnswer={responses[q.id] || ''}
                  onSelectAnswer={(val) => handleSelectAnswer(q.id, val)}
                />
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <Button
                onClick={handleSubmit}
                isLoading={isSubmitting}
                variant="primary"
                size="lg"
                disabled={Object.keys(responses).length === 0}
              >
                Submit Answers for Grading
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
