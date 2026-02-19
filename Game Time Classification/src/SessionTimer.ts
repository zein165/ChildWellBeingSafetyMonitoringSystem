// ============================================================
// STORY A2 — SessionTimer (Mobile)
// Start / stop session tracking per app
// ============================================================

import { AppSession } from './types';
import { DebugLogger } from './DebugLogger';

export class SessionTimer {
    private sessions: Map<string, AppSession> = new Map();
    private logger: DebugLogger;

    constructor(logger: DebugLogger) {
        this.logger = logger;
    }

    /**
     * Start a new session for the given package.
     * If a session is already running, it will be ignored (no double-start).
     */
    startSession(packageName: string): void {
        const existing = this.sessions.get(packageName);

        if (existing && existing.isActive) {
            // Already tracking, ignore
            return;
        }

        const session: AppSession = {
            packageName,
            startTime: Date.now(),
            isActive: true,
        };

        this.sessions.set(packageName, session);
        this.logger.log('INFO', `⏱️ Session STARTED: ${packageName}`);
    }

    /**
     * Stop the session for the given package.
     * Returns the elapsed duration in seconds, or 0 if no active session.
     */
    stopSession(packageName: string): number {
        const session = this.sessions.get(packageName);

        if (!session || !session.isActive) {
            return 0;
        }

        const elapsedMs = Date.now() - session.startTime;
        const elapsedSeconds = Math.round(elapsedMs / 1000);

        session.isActive = false;
        this.sessions.set(packageName, session);

        // Remove from map to clean up memory
        this.sessions.delete(packageName);

        this.logger.log('INFO', `⏹️ Session STOPPED: ${packageName} — ${elapsedSeconds}s`);
        return elapsedSeconds;
    }

    /**
     * Stop all active sessions and return their durations.
     * Useful when the monitoring app itself is being killed or backgrounded.
     */
    stopAll(): Map<string, number> {
        const results = new Map<string, number>();
        for (const [pkg, session] of this.sessions) {
            if (session.isActive) {
                const duration = this.stopSession(pkg);
                results.set(pkg, duration);
            }
        }
        return results;
    }

    /**
     * Check if a specific package has an active session.
     */
    isActive(packageName: string): boolean {
        const session = this.sessions.get(packageName);
        return session?.isActive ?? false;
    }
}
