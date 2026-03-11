import { AppEvent, RuleSchema } from '../models/types';
import { triggerLocalAlert } from './NotificationService';

// ✅ Tidak ada lagi import StorageService di sini!

export const evaluateRules = async (event: AppEvent, rules: RuleSchema[], saveEventCallback: Function) => {
  for (const rule of rules) {
    if (rule.targetEventType !== event.eventType) continue;

    let isTriggered = false;
    const { field, operator, value } = rule.condition;
    const eventValue = event.payload[field];

    if (eventValue === undefined) continue;

    switch (operator) {
      case '>':
        isTriggered = eventValue > value;
        break;
      case '<':
        isTriggered = eventValue < value;
        break;
      case '==':
        isTriggered = eventValue === value;
        break;
      case 'OutsideAfter':
        const eventDate = new Date(event.timestamp);
        const currentHour = eventDate.getHours();
        const currentMin = eventDate.getMinutes();
        const [targetHour, targetMin] = value.split(':').map(Number);
        
        if (currentHour > targetHour || (currentHour === targetHour && currentMin >= targetMin)) {
          isTriggered = true;
        }
        break;
    }

    if (isTriggered) {
      // 1. Munculkan Push Notification
      await triggerLocalAlert('Peringatan Keselamatan', rule.message);
      
      // 2. Simpan Alert ke Timeline menggunakan callback
      await saveEventCallback({
        id: `alert_${Date.now()}`,
        eventType: 'ALERT',
        payload: { ruleId: rule.id, triggeredValue: eventValue, message: rule.message },
        timestamp: Date.now()
      }, false); 
    }
  }
};