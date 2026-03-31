import axios from 'axios';
import { API } from '../shared/constants/api';

export const apiClient = axios.create({
  baseURL: API.BASE_URL,
  timeout: API.TIMEOUT,
});
