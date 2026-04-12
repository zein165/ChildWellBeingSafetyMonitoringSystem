import { apiClient } from '../../../services/apiClient';

import { API_ENDPOINTS } from '../../../shared/constants/api';
import { ApiResponse } from '../../../shared/types/api';
import { User } from '../../../shared/types/user';

import { LoginRequest, LoginResponse, RegisterParentRequest, RegisterChildRequest } from '../types';

export const authService = {
  login: async (payload: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, payload);
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw error.response.data;
      }

      throw new Error(error.message || 'Network Error');
    }
  },

  register: async (payload: RegisterParentRequest): Promise<ApiResponse<User>> => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.AUTH.REGISTER_PARENT,
        payload,
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw error.response.data;
      }

      throw new Error(error.message || 'Network Error');
    }
  },

  registerChild: async (payload: RegisterChildRequest): Promise<ApiResponse<User>> => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.AUTH.REGISTER_CHILD,
        payload,
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
