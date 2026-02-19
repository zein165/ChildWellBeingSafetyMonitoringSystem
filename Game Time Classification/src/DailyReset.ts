// ============================================================
// STORY A2 — DailyReset (Mobile)
// Midnight rollover: detect date change and trigger reset
// ============================================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import { DebugLogger } from './DebugLogger';

const LAST_DATE_KEY = 'cwsms_last_active_date';

export class DailyReset {
    private logger: DebugLogger;
    private onReset: (previousDate: string, newDate: string) => Promise<void> | void;
    private intervalId: ReturnType<typeof setInterval> | null = null;

    constructor(
        logger: DebugLogger,
        onReset: (previousDate: string, newDate: string) => Promise<void> | void
    ) {
        this.logger = logger;
        this.onReset = onReset;
    }

    /**
     * Get today's date key (YYYY-MM-DD).
     */
    private getTodayKey(): string {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    /**
     * Check if a day rollover has occurred.
     */
    public async check(): Promise<void> {
        const today = this.getTodayKey();
        const lastDate = await AsyncStorage.getItem(LAST_DATE_KEY);

        if (lastDate === null) {
            // First run — just store today
            await AsyncStorage.setItem(LAST_DATE_KEY, today);
            this.logger.log('INFO', `📅 Daily reset initialized: ${today}`);
            return;
        }

        if (lastDate !== today) {
            this.logger.log('INFO', `🌅 Midnight rollover detected: ${lastDate} → ${today}`);

            // Trigger the reset callback (e.g., stop sessions, clear memory cache)
            await this.onReset(lastDate, today);

            await AsyncStorage.setItem(LAST_DATE_KEY, today);
        }
    }

    /**
     * Start periodic checking (default: every 60 seconds).
     * React Native background timers may pause this when app is backgrounded.
     * Use native background fetch for reliable wake-ups if needed, 
     * but for foreground/active usage detection this is sufficient.
     */
    startPeriodicCheck(intervalMs: number = 60_000): void {
        // Immediate check
        this.check();

        // Periodic check
        this.intervalId = setInterval(() => {
            this.check();
        }, intervalMs);

        this.logger.log('DEBUG', `⏰ Daily reset checker started (every ${intervalMs / 1000}s)`);
    }

    /**
     * Stop periodic checking.
     */
    stopPeriodicCheck(): void {
        if (this.intervalId !== null) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            this.logger.log('DEBUG', '⏰ Daily reset checker stopped');
        }
    }
}
