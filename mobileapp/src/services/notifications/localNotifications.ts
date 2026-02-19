import PushNotification from 'react-native-push-notification';

PushNotification.configure({
  onNotification: () => {},
  requestPermissions: true,
});

export function sendLocalAlert(title: string, message: string): void {
  PushNotification.localNotification({
    channelId: 'monitoring-alerts',
    title,
    message,
  });
}
