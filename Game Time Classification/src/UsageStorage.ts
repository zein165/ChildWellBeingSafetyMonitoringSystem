// ============================================================
// STORY A2 — UsageStorage (Mobile)
// Persist per-app usage durations to AsyncStorage
// ============================================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import { UsageRecord, GameMapping, StorageData } from './types';
import { DebugLogger } from './DebugLogger';

const STORAGE_KEY = 'cwsms_usage_data'; // Unique key for this app

export class UsageStorage {
    private logger: DebugLogger;
    private gameMapping: GameMapping;

    constructor(logger: DebugLogger, gameMapping: GameMapping) {
        this.logger = logger;
        this.gameMapping = gameMapping;
    }

    /**
     * Get today's date string in YYYY-MM-DD format.
     */
    private getTodayKey(): string {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    /**
     * Load all stored data from AsyncStorage.
     */
    public async loadAll(): Promise<StorageData> {
        try {
            const raw = await AsyncStorage.getItem(STORAGE_KEY);
            if (!raw) return {};
            return JSON.parse(raw) as StorageData;
        } catch (e) {
            this.logger.log('WARN', `Failed to parse storage, resetting: ${e}`);
            return {};
        }
    }

    /**
     * Save data back to AsyncStorage.
     */
    private async saveAll(data: StorageData): Promise<void> {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            this.logger.log('WARN', `Failed to save to storage: ${e}`);
        }
    }

    /**
     * Resolve app name from the game mapping or return the package name.
     */
    private resolveAppName(packageName: string): string {
        return this.gameMapping[packageName]?.appName ?? packageName;
    }

    /**
     * Add usage duration for a package to today's records.
     * Accumulates if already exists.
     */
    public async addDuration(packageName: string, seconds: number): Promise<void> {
        if (seconds <= 0) return;

        // Load existing data first
        const data = await this.loadAll();
        const today = this.getTodayKey();

        if (!data[today]) {
            data[today] = [];
        }

        // Find existing record for this package today
        const existing = data[today].find((r) => r.packageName === packageName);

        if (existing) {
            existing.usageDurationSeconds += seconds;
            this.logger.log('DEBUG', `📊 Accumulated ${seconds}s → ${existing.usageDurationSeconds}s total for ${packageName}`);
        } else {
            const record: UsageRecord = {
                date: today,
                appName: this.resolveAppName(packageName),
                packageName,
                usageDurationSeconds: seconds,
            };
            data[today].push(record);
            this.logger.log('DEBUG', `📊 New record: ${packageName} = ${seconds}s`);
        }

        await this.saveAll(data);
    }

    /**
     * Get all usage records for today.
     */
    public async getToday(): Promise<UsageRecord[]> {
        const data = await this.loadAll();
        const today = this.getTodayKey();
        return data[today] ?? [];
    }

    /**
     * Get all records for a specific date.
     */
    public async getByDate(dateKey: string): Promise<UsageRecord[]> {
        const data = await this.loadAll();
        return data[dateKey] ?? [];
    }

    /**
     * Clear all stored data (Development utility).
     */
    public async clearAll(): Promise<void> {
        await AsyncStorage.removeItem(STORAGE_KEY);
        this.logger.log('INFO', '🗑️ All usage data cleared');
    }

    /**
     * Remove records older than N days.
     */
    public async pruneOlderThan(days: number): Promise<void> {
        const data = await this.loadAll();
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        const cutoffKey = cutoff.toISOString().slice(0, 10);

        let removed = 0;
        for (const dateKey of Object.keys(data)) {
            if (dateKey < cutoffKey) {
                delete data[dateKey];
                removed++;
            }
        }

        if (removed > 0) {
            await this.saveAll(data);
            this.logger.log('INFO', `🧹 Pruned ${removed} day(s) of old data`);
        }
    }
}
