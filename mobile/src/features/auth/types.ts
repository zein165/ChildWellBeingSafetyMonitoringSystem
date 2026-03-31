import { User } from '../../shared/types/user';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface RegisterParentRequest {
  username: string;
  password: string;
}
