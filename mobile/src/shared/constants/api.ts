import Config from "react-native-config";

export const API = {
  BASE_URL: Config.API_BASE_URL,
  TIMEOUT: 10000,
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER_PARENT: '/auth/register/parent',
  },
  DEVICE: {
    GET_CHILDREN: '/devices'
  }
}