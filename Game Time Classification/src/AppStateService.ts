// ============================================================
// STORY A2 — AppStateService (Mobile)
// Listen to React Native AppState changes (active / background)
// ============================================================

import { AppState, AppStateStatus as RNAppStateStatus, NativeEventSubscription } from 'react-native';
import { DebugLogger } from './DebugLogger';

type AppStateCallback = (status: RNAppStateStatus) => void;

export class AppStateService {
    private logger: DebugLogger;
    private subscription: NativeEventSubscription | null = null;
    private onStateChange: AppStateCallback;

    constructor(logger: DebugLogger, onStateChange: AppStateCallback) {
        this.logger = logger;
        this.onStateChange = onStateChange;
    }

    /**
     * Start listening to AppState changes.
     */
    startListening(): void {
        this.logger.log('INFO', '👂 AppState listener started');

        this.subscription = AppState.addEventListener('change', (nextAppState) => {
            this.logger.log('DEBUG', `📱 AppState changed to: ${nextAppState}`);
            this.onStateChange(nextAppState);
        });
    }

    /**
     * Stop listening.
     */
    stopListening(): void {
        if (this.subscription) {
            this.subscription.remove();
            this.subscription = null;
            this.logger.log('INFO', '👂 AppState listener stopped');
        }
    }

    /**
     * Get current state immediately.
     */
    getCurrentState(): RNAppStateStatus {
        return AppState.currentState;
    }
}
