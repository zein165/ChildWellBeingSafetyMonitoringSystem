export interface InstalledAppDto {
    packageName: string;
    appName: string;
    category?: string;
    version?: string;
}

export interface AppInventorySnapshotDto {
    apps: InstalledAppDto[];
    snapshotTime: string;
}
