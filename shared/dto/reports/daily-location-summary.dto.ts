export interface DailyLocationSummaryDto {
    totalOutsideDurationSeconds: number;
    totalInsideDurationSeconds: number;
    firstLocation?: { latitude: number; longitude: number; };
    lastLocation?: { latitude: number; longitude: number; };
}
