import { apiRequest } from './api';
import type { ChatQueryResponse, ChatSession } from '../types';

export const chatbotService = {
  ask: async (message: string, sessionId?: number): Promise<ChatQueryResponse> => {
    return apiRequest<ChatQueryResponse>('/chatbot/ask', {
      method: 'POST',
      body: JSON.stringify({ message, session_id: sessionId }),
    });
  },

  getSessions: async (): Promise<ChatSession[]> => {
    return apiRequest<ChatSession[]>('/chatbot/sessions');
  },
};
