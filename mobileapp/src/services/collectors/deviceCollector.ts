import DeviceInfo from 'react-native-device-info';

export interface DeviceSnapshot {
  model: string;
  systemName: string;
  systemVersion: string;
  uniqueId: string;
}

export async function readDeviceSnapshot(): Promise<DeviceSnapshot> {
  return {
    model: DeviceInfo.getModel(),
    systemName: DeviceInfo.getSystemName(),
    systemVersion: DeviceInfo.getSystemVersion(),
    uniqueId: await DeviceInfo.getUniqueId(),
  };
}
