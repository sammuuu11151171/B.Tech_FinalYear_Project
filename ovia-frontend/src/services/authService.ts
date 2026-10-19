import { apiRequest } from './api';
import type { AuthResponse, User } from '../types';

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (email: string, full_name: string, password: string, role: string = 'student'): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, full_name, password, role }),
    });
  },

  getMe: async (): Promise<User> => {
    return apiRequest<User>('/auth/me');
  },

  updateProfile: async (data: { full_name?: string; current_password?: string; new_password?: string }): Promise<User> => {
    return apiRequest<User>('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};
