import notifee, { AndroidImportance } from '@notifee/react-native';

export const triggerLocalAlert = async (title: string, message: string) => {
  try {
    // 1. Minta izin notifikasi (Wajib untuk Android 13+ / iOS)
    await notifee.requestPermission();

    // 2. Buat Channel (Wajib untuk Android)
    const channelId = await notifee.createChannel({
      id: 'safety_alerts',
      name: 'Safety & Rule Alerts',
      importance: AndroidImportance.HIGH, // HIGH agar muncul pop-up dari atas layar
    });

    // 3. Tampilkan Notifikasi Asli
    await notifee.displayNotification({
      title: `⚠️ ${title}`,
      body: message,
      android: {
        channelId,
        smallIcon: 'ic_launcher', // Pakai icon bawaan aplikasi
        pressAction: {
          id: 'default',
        },
      },
    });
    
    console.log(`🔔 [PUSH NOTIF]: ${title} - ${message}`);
  } catch (error) {
    console.error('Gagal memunculkan notifikasi:', error);
  }
};