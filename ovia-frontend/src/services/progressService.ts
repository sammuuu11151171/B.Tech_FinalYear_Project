import { apiRequest } from './api';
import type { StudentDashboardSummary } from '../types';

export const progressService = {
  getMyProgressSummary: async (): Promise<StudentDashboardSummary> => {
    return apiRequest<StudentDashboardSummary>('/progress/me');
  },
};
