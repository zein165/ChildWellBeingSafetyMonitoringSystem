export type DeviceStatus = 'ONLINE' | 'OFFLINE';

export interface Device {
    id: string;
    name: string;
    status: DeviceStatus;
}