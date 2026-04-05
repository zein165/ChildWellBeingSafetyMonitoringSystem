import { useMemo } from "react";
import { colors } from "../../../shared/constants/theme/colors";

export type WeeklyDataItem = { day: string, value: number, active?: boolean }
export type TopAppItem = { id: string, name: string, time: string, progress: number, color: string, icon: string }

export const useHomeData = () => {
    const WEEKLY_DATA: WeeklyDataItem[] = useMemo(() => [
        { day: 'Mon', value: 30 },
        { day: 'Tue', value: 40 },
        { day: 'Wed', value: 25 },
        { day: 'Thu', value: 50 },
        { day: 'Fri', value: 45 },
        { day: 'Sat', value: 80 },
        { day: 'Sun', value: 65, active: true },
    ], []);

    const TOP_APPS: TopAppItem[] = useMemo(() => [
        { id: '1', name: 'TikTok', time: '1h 45m', progress: 0.7, color: colors.pink, icon: 'https://cdn-icons-png.flaticon.com/512/3046/3046121.png' },
        { id: '2', name: 'Roblox', time: '1h 33m', progress: 0.6, color: colors.blue, icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968917.png' },
        { id: '3', name: 'YouTube', time: '0h 45m', progress: 0.3, color: colors.red, icon: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png' },
        { id: '4', name: 'Whatsapp', time: '0h 24m', progress: 0.15, color: colors.green, icon: 'https://cdn-icons-png.flaticon.com/512/5968/5968841.png' },
    ], []);

    const totalScreenTime = WEEKLY_DATA.reduce((acc, item) => acc + item.value, 0);

    return { WEEKLY_DATA, TOP_APPS, totalScreenTime };
}

export const calcProgressPercentage = (value: number, max: number) => {
    return Math.min(Math.max(value / max, 0), 1);
}