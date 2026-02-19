// ============================================================
// STORY A2 — GameClassifier (Mobile)
// Classify apps as game vs non-game, aggregate game time
// ============================================================

import { UsageRecord, GameMapping } from './types';

export class GameClassifier {
    private mapping: GameMapping;

    constructor(mapping: GameMapping) {
        this.mapping = mapping;
    }

    /**
     * Check if a package is classified as a game.
     */
    isGame(packageName: string): boolean {
        return this.mapping[packageName]?.isGame ?? false;
    }

    /**
     * Get the app name for a package (or the package name itself).
     */
    getAppName(packageName: string): string {
        return this.mapping[packageName]?.appName ?? packageName;
    }

    /**
     * Filter records to only game apps.
     */
    getGameUsage(records: UsageRecord[]): UsageRecord[] {
        return records.filter((r) => this.isGame(r.packageName));
    }

    /**
     * Filter records to only non-game apps.
     */
    getNonGameUsage(records: UsageRecord[]): UsageRecord[] {
        return records.filter((r) => !this.isGame(r.packageName));
    }

    /**
     * Get total game time in seconds from a set of records.
     */
    getTotalGameTime(records: UsageRecord[]): number {
        return this.getGameUsage(records).reduce(
            (sum, r) => sum + r.usageDurationSeconds,
            0
        );
    }

    /**
     * Get total non-game time in seconds from a set of records.
     */
    getTotalNonGameTime(records: UsageRecord[]): number {
        return this.getNonGameUsage(records).reduce(
            (sum, r) => sum + r.usageDurationSeconds,
            0
        );
    }

    /**
     * Get total screen time (all apps) in seconds.
     */
    getTotalScreenTime(records: UsageRecord[]): number {
        return records.reduce((sum, r) => sum + r.usageDurationSeconds, 0);
    }

    /**
     * Get a summary object for a set of records.
     */
    getSummary(records: UsageRecord[]): {
        totalScreenTime: number;
        totalGameTime: number;
        totalNonGameTime: number;
        gameAppsCount: number;
        nonGameAppsCount: number;
    } {
        const gameRecords = this.getGameUsage(records);
        const nonGameRecords = this.getNonGameUsage(records);

        return {
            totalScreenTime: this.getTotalScreenTime(records),
            totalGameTime: gameRecords.reduce((s, r) => s + r.usageDurationSeconds, 0),
            totalNonGameTime: nonGameRecords.reduce((s, r) => s + r.usageDurationSeconds, 0),
            gameAppsCount: gameRecords.length,
            nonGameAppsCount: nonGameRecords.length,
        };
    }
}
