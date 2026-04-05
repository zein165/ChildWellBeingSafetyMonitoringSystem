import { apiClient } from "../apiClient";
import { API_ENDPOINTS } from "../../shared/constants/api";

export type Device = {
  id: string;
  name: string;
  status: 'ONLINE' | 'OFFLINE';
};

export const deviceService = {
  getDevicesByParent: async (parentId: string): Promise<Device[]> => {
    const response = await apiClient.get(API_ENDPOINTS.DEVICE.GET_CHILDREN, {
      params: { parentId },
    });
    return response.data.data; // sesuai response dari backend
  },
};