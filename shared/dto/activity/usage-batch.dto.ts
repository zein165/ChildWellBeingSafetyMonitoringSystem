import { AppCategory } from '../../enums/app-category.enum';

export interface UsageItemDto {
    packageName: string;
    appName: string;
    category: AppCategory;
    startTime: string;
    endTime: string;
    durationSeconds: number;
}

export interface UsageBatchDto {
    deviceTime: string;
    usages: UsageItemDto[];
}