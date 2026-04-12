import { API_ENDPOINTS } from '../../shared/constants/api';
import { ApiResponse } from '../../shared/types/api';
import { Child } from '../../shared/types/child';

import { apiClient } from '../apiClient';

export const childrenService = {
  getChildrenByParent: async (parentId: string): Promise<ApiResponse<Child[]>> => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CHILDREN.GET_BY_PARENT, {
        params: { parentId },
      });
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw error.response.data;
      }

      throw new Error(error.message || 'Network Error');
    }
  },
};
