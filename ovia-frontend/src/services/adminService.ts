// import { apiRequest } from './api';
// import { SystemOverviewStats, User, AuditLog } from '../types';

// export const adminService = {
//   getOverview: async (): Promise<SystemOverviewStats> => {
//     return apiRequest<SystemOverviewStats>('/admin/overview');
//   },

//   getUsers: async (role?: string): Promise<User[]> => {
//     const query = role ? `?role=${encodeURIComponent(role)}` : '';
//     return apiRequest<User[]>(`/admin/users${query}`);
//   },

//   updateRole: async (userId: number, role: string): Promise<User> => {
//     return apiRequest<User>(`/admin/users/${userId}/role`, {
//       method: 'PATCH',
//       body: JSON.stringify({ role }),
//     });
//   },

//   toggleStatus: async (userId: number, isActive: boolean): Promise<User> => {
//     return apiRequest<User>(`/admin/users/${userId}/status`, {
//       method: 'PATCH',
//       body: JSON.stringify({ is_active: isActive }),
//     });
//   },

//   getAuditLogs: async (limit: number = 50): Promise<AuditLog[]> => {
//     return apiRequest<AuditLog[]>(`/admin/audit-logs?limit=${limit}`);
//   },
// };

// export const teacherService = {
//   getOverview: async (): Promise<any> => {
//     return apiRequest<any>('/teacher/overview');
//   },

//   createLesson: async (data: any): Promise<any> => {
//     return apiRequest<any>('/teacher/lessons', {
//       method: 'POST',
//       body: JSON.stringify(data),
//     });
//   },

//   createQuiz: async (data: any): Promise<any> => {
//     return apiRequest<any>('/teacher/quizzes', {
//       method: 'POST',
//       body: JSON.stringify(data),
//     });
//   },

//   getStudentPerformance: async (): Promise<any[]> => {
//     return apiRequest<any[]>('/teacher/students');
//   },
// };




import { apiRequest } from './api';
import type { SystemOverviewStats, User, AuditLog } from '../types';

/**
 * Admin API service.
 *
 * These functions are intended for use when the backend is available.
 * They do not run automatically when the frontend starts.
 */

export const adminService = {
  getOverview: async (): Promise<SystemOverviewStats> => {
    return apiRequest<SystemOverviewStats>('/admin/overview');
  },

  getUsers: async (role?: string): Promise<User[]> => {
    const query = role ? `?role=${encodeURIComponent(role)}` : '';
    return apiRequest<User[]>(`/admin/users${query}`);
  },

  updateRole: async (userId: number, role: string): Promise<User> => {
    return apiRequest<User>(`/admin/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  },

  toggleStatus: async (
    userId: number,
    isActive: boolean
  ): Promise<User> => {
    return apiRequest<User>(`/admin/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ is_active: isActive }),
    });
  },

  getAuditLogs: async (limit = 50): Promise<AuditLog[]> => {
    return apiRequest<AuditLog[]>(`/admin/audit-logs?limit=${limit}`);
  },
};
