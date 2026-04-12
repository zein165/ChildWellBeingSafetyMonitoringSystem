export interface TrackingRequestDto {
  childId: string;
  apps: {
    packageName: string;
    appName: string;
  }[];
  usage: Record<string, number>;
  latitude: number;
  longitude: number;
}
