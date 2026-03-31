import { useState } from 'react';

import { authService } from '../services/authService';
import { tokenStorage } from '../../../services/storage/tokenStorage';

import { User } from '../../../shared/types/user';

import { LoginRequest, LoginResponse, RegisterParentRequest } from '../types';

export const useLogin = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const login = async (payload: LoginRequest): Promise<LoginResponse> => {
    setLoading(true);

    try {
      const res = await authService.login(payload);

      tokenStorage.setAccessToken(res.data.accessToken);
      tokenStorage.setRefreshToken(res.data.refreshToken);

      return res.data;
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
};

export const useRegister = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const register = async (payload: RegisterParentRequest): Promise<User> => {
    setLoading(true);

    try {
      const res = await authService.register(payload);
      return res.data;
    } catch (error: any) {
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return { register, loading };
}