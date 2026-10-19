import { apiRequest } from './api';
import type { PredictResponse, LandmarkPoint } from '../types';

export const recognitionService = {
  predictSign: async (params: {
    target_sign: string;
    image_base64?: string;
    landmarks?: LandmarkPoint[];
    lesson_id?: number;
  }): Promise<PredictResponse> => {
    return apiRequest<PredictResponse>('/recognition/predict', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  getModelInfo: async (): Promise<any> => {
    return apiRequest<any>('/recognition/model-info');
  },
};
