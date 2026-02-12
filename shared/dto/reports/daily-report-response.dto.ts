import { DailyUsageSummaryDto } from "./daily-usage-summary.dto";
import { DailyLocationSummaryDto } from "./daily-location-summary.dto";

export interface DailyReportDto {
    childId: string;
    date: string;
    usage: DailyUsageSummaryDto;
    location: DailyLocationSummaryDto;
}