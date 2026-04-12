import { API_ENDPOINTS } from '../../shared/constants/api';
import { ApiResponse } from '../../shared/types/api';
import { GetChildApplicationsResponse } from '../../shared/types/application';

import { apiClient } from '../apiClient';

export const applicationInventoryService = {
  getApplicationByChild: async (
    childId: string,
  ): Promise<ApiResponse<GetChildApplicationsResponse>> => {
    try {
      const response = await apiClient.get(
        API_ENDPOINTS.APPLICATIONS.GET_BY_CHILD,
        {
          params: { childId },
        },
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw error.response.data;
      }

      throw new Error(error.message || 'Network Error');
    }
  },
};
