import { AppCategory } from '../../enums/app-category.enum';

export interface AppUsageSummaryDto {
    packageName: string;
    appName: string;
    category: AppCategory;
    totalDurationSeconds: number;
}

export interface DailyUsageSummaryDto {
    totalScreenTimeSeconds: number;
    totalGameTimeSeconds: number;
    totalNonGameTimeSeconds: number;
    perApp: AppUsageSummaryDto[];
}
