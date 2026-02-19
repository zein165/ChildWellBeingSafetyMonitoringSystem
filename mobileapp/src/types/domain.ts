export type AppCategory = 'game' | 'education' | 'social' | 'utility' | 'unknown';

export interface AppUsageRecord {
  packageName: string;
  appName: string;
  category: AppCategory;
  durationMinutes: number;
  lastUsedAt: string;
}

export interface InstalledApp {
  packageName: string;
  appName: string;
  category: AppCategory;
  installedAt: string;
}

export interface LocationPoint {
  latitude: number;
  longitude: number;
  capturedAt: string;
  source: 'gps' | 'network';
}

export interface TimelineEvent {
  id: string;
  type: 'usage' | 'inventory' | 'location' | 'alert';
  title: string;
  detail: string;
  occurredAt: string;
  metadata?: Record<string, string | number | boolean>;
}

export interface RuleThreshold {
  id: string;
  name: string;
  enabled: boolean;
  metric: 'gameTimeMinutes' | 'outsideDurationMinutes' | 'screenTimeMinutes';
  operator: 'gt' | 'gte';
  value: number;
}
