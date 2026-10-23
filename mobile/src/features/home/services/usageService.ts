import { apiClient } from "../../../services/apiClient"

export interface WeeklyUsageSummary {
    day: string;
    date: string;
    value: number; // in minutes
    active: boolean;
}

export interface DailyUsageDetail {
    id: string;
    applicationId: string;
    packageName: string;
    appName: string;
    durationMinutes: number;
    timeDisplay: string;
    icon?: string; // We can add this if needed
}

export const usageService = {
    getWeeklySummary: async (childId: string) => {
        const response = await apiClient.get(`/usage/summary/${childId}`);
        return response.data.data as WeeklyUsageSummary[];
    },

    getDailyDetails: async (childId: string, date?: string) => {
        const response = await apiClient.get(`/usage/details/${childId}`, {
            params: { date }
        });
        return response.data.data as DailyUsageDetail[];
    }
}
