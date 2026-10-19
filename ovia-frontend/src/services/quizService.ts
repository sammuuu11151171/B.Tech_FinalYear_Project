import { apiRequest } from './api';
import type { Quiz, QuizDetail, QuizAttempt } from '../types';

export const quizService = {
  getQuizzes: async (category?: string): Promise<Quiz[]> => {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    return apiRequest<Quiz[]>(`/quizzes${query}`);
  },

  getQuizById: async (id: number): Promise<QuizDetail> => {
    return apiRequest<QuizDetail>(`/quizzes/${id}`);
  },

  submitQuiz: async (
    quizId: number,
    responses: { question_id: number; selected_answer: string; confidence_score?: number }[]
  ): Promise<QuizAttempt> => {
    return apiRequest<QuizAttempt>(`/quizzes/${quizId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ responses }),
    });
  },

  getMyAttempts: async (): Promise<QuizAttempt[]> => {
    return apiRequest<QuizAttempt[]>('/quizzes/attempts/me');
  },
};
