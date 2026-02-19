// ============================================================
// STORY A2 — DebugLogger (Mobile)
// Console logging wrapper for React Native debugging
// ============================================================

import { LogLevel } from './types';

export class DebugLogger {
    private enabled: boolean = true;
    private prefix: string = '🛡️ [CWSMS]'; // Child Well-Being System Prefix

    constructor(enabled: boolean = true) {
        this.enabled = enabled;
    }

    /** Enable or disable logging */
    setEnabled(enabled: boolean): void {
        this.enabled = enabled;
    }

    /** Log a message to console with standard formatting */
    log(level: LogLevel, message: string, data?: any): void {
        if (!this.enabled) return;

        const timestamp = new Date().toISOString();
        const formattedMsg = `${this.prefix} [${timestamp}] [${level}] ${message}`;

        switch (level) {
            case 'INFO':
                console.log(formattedMsg, data || '');
                break;
            case 'WARN':
                console.warn(formattedMsg, data || '');
                break;
            case 'DEBUG':
                // React Native often hides debug logs by default; treating as log or custom
                console.debug(formattedMsg, data || '');
                break;
            case 'ERROR':
                console.error(formattedMsg, data || '');
                break;
        }
    }
}
