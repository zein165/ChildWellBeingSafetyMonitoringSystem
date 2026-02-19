// ============================================================
// STORY A2 — Game Time Classification (Mobile)
// Type Definitions
// ============================================================

/** Output data format per acceptance criteria */
export interface UsageRecord {
    date: string;           // YYYY-MM-DD
    appName: string;        // Human-readable app name
    packageName: string;    // e.g. "com.supercell.clashofclans"
    usageDurationSeconds: number;
}

/** Active session tracking structure */
export interface AppSession {
    packageName: string;
    startTime: number;      // Date.now() timestamp
    isActive: boolean;
}

/** Game mapping entry from JSON configuration */
export interface GameMappingEntry {
    appName: string;
    isGame: boolean;
}

/** Full game mapping dictionary */
export interface GameMapping {
    [packageName: string]: GameMappingEntry;
}

/** Storage schema — keyed by date string */
export interface StorageData {
    [date: string]: UsageRecord[];
}

/** Log levels for DebugLogger */
export type LogLevel = 'INFO' | 'WARN' | 'DEBUG' | 'ERROR';

/** App Lifecycle State */
export type AppStateStatus = 'active' | 'background' | 'inactive';
