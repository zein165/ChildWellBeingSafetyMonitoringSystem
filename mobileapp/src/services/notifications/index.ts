import PushNotification from 'react-native-push-notification';

export const triggerLocalAlert = (title: string, message: string) => {
  PushNotification.localNotification({
    channelId: "cwsms-alerts", // Wajib untuk Android 8.0+
    title: title,
    message: message,
    allowWhileIdle: true,
  });
};