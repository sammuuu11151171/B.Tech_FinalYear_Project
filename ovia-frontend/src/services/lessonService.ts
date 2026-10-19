import { apiRequest } from './api';
import type { Lesson } from '../types';

export const lessonService = {
  getLessons: async (category?: string): Promise<Lesson[]> => {
    const query = category ? `?category=${encodeURIComponent(category)}` : '';
    return apiRequest<Lesson[]>(`/lessons${query}`);
  },

  getLessonById: async (id: number): Promise<Lesson> => {
    return apiRequest<Lesson>(`/lessons/${id}`);
  },

  markCompleted: async (id: number): Promise<{ message: string; lesson_id: number; status: string }> => {
    return apiRequest<{ message: string; lesson_id: number; status: string }>(`/lessons/${id}/complete`, {
      method: 'POST',
    });
  },
};
