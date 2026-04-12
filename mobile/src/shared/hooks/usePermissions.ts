import { useState, useEffect, useCallback } from 'react';
import {
  PermissionsAndroid,
  NativeModules,
  Platform,
  AppState,
  AppStateStatus,
} from 'react-native';

const { AppModule } = NativeModules;

export interface PermissionStatus {
  location: boolean;
  notifications: boolean;
  usageAccess: boolean;
}

export const usePermissions = () => {
  const [status, setStatus] = useState<PermissionStatus>({
    location: false,
    notifications: false,
    usageAccess: false,
  });
  const [loading, setLoading] = useState(true);

  const checkPermissions = useCallback(async () => {
    let locationGranted = false;
    let notificationGranted = false;
    let usageGranted = false;

    try {
      locationGranted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );

      if (Platform.OS === 'android' && Number(Platform.Version) >= 33) {
        notificationGranted = await PermissionsAndroid.check(
          'android.permission.POST_NOTIFICATIONS' as any,
        );
      } else {
        notificationGranted = true;
      }

      if (AppModule?.checkUsageAccess) {
        usageGranted = await AppModule.checkUsageAccess();
      }

      setStatus({
        location: locationGranted,
        notifications: notificationGranted,
        usageAccess: usageGranted,
      });
    } catch (error) {
      console.error('Error checking permissions:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkPermissions();

    const subscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        if (nextAppState === 'active') {
          checkPermissions();
        }
      },
    );

    return () => {
      subscription.remove();
    };
  }, [checkPermissions]);

  const requestLocation = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'The app needs location access for safety monitoring.',
        buttonPositive: 'OK',
      },
    );
    await checkPermissions();
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  };

  const requestNotification = async () => {
    if (Platform.OS === 'android' && Number(Platform.Version) >= 33) {
      const granted = await PermissionsAndroid.request(
        'android.permission.POST_NOTIFICATIONS' as any,
      );
      await checkPermissions();
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const requestUsageAccess = () => {
    if (AppModule?.openUsageAccessSettings) {
      AppModule.openUsageAccessSettings();
    }
  };

  const isAllGranted =
    status.location && status.notifications && status.usageAccess;

  return {
    status,
    loading,
    checkPermissions,
    requestLocation,
    requestNotification,
    requestUsageAccess,
    isAllGranted,
  };
};
