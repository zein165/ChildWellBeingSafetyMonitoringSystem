// ============================================================
// STORY A2 — Game Time Classification (Mobile)
// Main Monitoring Service - Entry Point
// ============================================================

import { AppStateStatus } from 'react-native';
import { GameMapping, UsageRecord } from './types';
import { DebugLogger } from './DebugLogger';
import { GameClassifier } from './GameClassifier';
import { SessionTimer } from './SessionTimer';
import { UsageStorage } from './UsageStorage';
import { DailyReset } from './DailyReset';
import { AppStateService } from './AppStateService';

export class MonitoringService {
    private logger: DebugLogger;
    private classifier: GameClassifier;
    private timer: SessionTimer;
    private storage: UsageStorage;
    private dailyReset: DailyReset;
    private appStateService: AppStateService;

    // In a real usage access scenario, this would be updated by a native module listener
    private currentForegroundPackage: string | null = null;

    constructor(gameMapping: GameMapping) {
        this.logger = new DebugLogger(true); // Enabled by default
        this.classifier = new GameClassifier(gameMapping);
        this.storage = new UsageStorage(this.logger, gameMapping);
        this.timer = new SessionTimer(this.logger);

        // Setup Daily Reset
        this.dailyReset = new DailyReset(this.logger, async (prevDate, newDate) => {
            // On midnight, stop all sessions to seal the previous day's records
            await this.forceStopAllSessions();
            this.logger.log('INFO', `🔃 Midnight reset completed. Sessions restarted for ${newDate}`);

            // If app is still active, restart the session for the new day
            if (this.currentForegroundPackage) {
                this.timer.startSession(this.currentForegroundPackage);
            }
        });

        // Setup AppState Listener
        this.appStateService = new AppStateService(this.logger, (status) => this.handleAppStateChange(status));
    }

    /**
     * Initialize the service.
     * Should be called when the React Native app mounts.
     */
    public initialize(): void {
        this.logger.log('INFO', '🚀 MonitoringService Initializing...');
        this.dailyReset.startPeriodicCheck();
        this.appStateService.startListening();
    }

    /**
     * Cleanup resources.
     */
    public destroy(): void {
        this.dailyReset.stopPeriodicCheck();
        this.appStateService.stopListening();
        this.forceStopAllSessions(); // Save whatever is pending
    }

    /**
     * Handle React Native AppState changes.
     * When the monitoring app itself goes to background, we should technically keep tracking
     * if we are a background service. However, for this specific task scope (lifecycle based),
     * we ensure we save data to avoid loss if killed.
     */
    private async handleAppStateChange(status: AppStateStatus): Promise<void> {
        if (status === 'active') {
            // App came to foreground
            this.dailyReset.check(); // Good time to check for rollover
        } else if (status === 'background') {
            // App went to background.
            // In a real Native Module scenario, the native side tracks usage.
            // But if we are simulating or managing sessions in JS:

            // Just flush/save current pending time without stopping the logical session
            // if we assume the monitoring agent keeps running.
            // But to be safe and strictly follow "Record on stop", we might checkpoint here.

            // For this implementation, we will NOT stop the session just because *our* app dashboard
            // went to background, because the child might be playing a game while our app is in background.
            // HOWEVER, if the OS kills us, we lose memory state.
            // A robust production app relies on Native service.
            // Here we assume JS runtime stays alive or we rely on frequent checkpoints.

            await this.checkpoint();
        }
    }

    /**
     * Simulate or Receive an event that a package has entered foreground.
     * This is the main input for the system.
     */
    public async onPackageForeground(packageName: string): Promise<void> {
        // 1. Stop previous package session if any
        if (this.currentForegroundPackage && this.currentForegroundPackage !== packageName) {
            await this.stopTracking(this.currentForegroundPackage);
        }

        // 2. Start new session
        this.currentForegroundPackage = packageName;
        this.timer.startSession(packageName);
    }

    /**
     * Stop tracking a specific package (it went to background).
     */
    public async stopTracking(packageName: string): Promise<void> {
        const duration = this.timer.stopSession(packageName);
        if (duration > 0) {
            await this.storage.addDuration(packageName, duration);
        }
    }

    /**
     * Force stop all sessions and save data.
     */
    public async forceStopAllSessions(): Promise<void> {
        const results = this.timer.stopAll();
        for (const [pkg, duration] of results) {
            await this.storage.addDuration(pkg, duration);
        }
    }

    /**
     * Save current progress without stopping sessions.
     * (Stop -> Start immediately)
     */
    public async checkpoint(): Promise<void> {
        // Implementation approach: stop all to get duration, save, then restart valid ones.
        if (!this.currentForegroundPackage) return;

        const pkg = this.currentForegroundPackage;
        if (this.timer.isActive(pkg)) {
            const duration = this.timer.stopSession(pkg);
            if (duration > 0) {
                await this.storage.addDuration(pkg, duration);
            }
            // Resume immediately
            this.timer.startSession(pkg);
        }
    }

    /**
     * Get Daily Summary for UI.
     */
    public async getDailySummary(): Promise<any> {
        const records = await this.storage.getToday();
        return this.classifier.getSummary(records);
    }

    /**
     * Get raw logs for UI list.
     */
    public async getTodayLogs(): Promise<UsageRecord[]> {
        return this.storage.getToday();
    }
}
