import { RootState } from '../../app/store';
import { RuleThreshold, TimelineEvent } from '../../types/domain';
import { triggerLocalAlert } from '../../services/notifications';
import { saveEvent } from '../timeline/storage';

export interface RuleEvaluation {
  rule: RuleThreshold;
  passed: boolean;
  actual: number;
}

// Fungsi bawaan dosen (tidak diubah)
export function evaluateRules(state: RootState): RuleEvaluation[] {
  // Pastikan memberi fallback || 0 agar tidak error jika state masih kosong
  const gameTime = state.digitalMonitoring?.dailySummary?.gameMinutes || 0;
  const screenTime = state.digitalMonitoring?.dailySummary?.totalMinutes || 0;
  const outsideDuration = state.location?.outsideDurationMinutes || 0;

  return state.rules.thresholds.map(rule => {
    const actual =
      rule.metric === 'gameTimeMinutes'
        ? gameTime
        : rule.metric === 'screenTimeMinutes'
          ? screenTime
          : outsideDuration;

    const passed = rule.operator === 'gt' ? actual > rule.value : actual >= rule.value;

    return { rule, passed, actual };
  });
}

// FUNGSI BARU UNTUK STORY D2: Memunculkan Notifikasi & Menyimpan ke Timeline
export const processRuleAlerts = async (state: RootState) => {
  const evaluations = evaluateRules(state);

  for (const evalResult of evaluations) {
    // Jika rule aktif (enabled) DAN batasnya terlewati (passed)
    if (evalResult.rule.enabled && evalResult.passed) {
      
      const alertTitle = 'Peringatan Aktivitas!';
      const alertDetail = `Batas ${evalResult.rule.name} telah terlewati (${evalResult.actual} menit).`;

      // 1. Munculkan pop-up Notifikasi di HP (Tugas D2)
      triggerLocalAlert(alertTitle, alertDetail);

      // 2. Catat pelanggaran ini ke dalam Unified Timeline (Tugas D1 & D2)
      const alertEvent: TimelineEvent = {
        id: Date.now().toString() + Math.random().toString(36).substring(7), // Generate ID unik
        type: 'alert',
        title: alertTitle,
        detail: alertDetail,
        occurredAt: new Date().toISOString(), // Format ISO String sesuai standar domain.ts
        metadata: {
          ruleId: evalResult.rule.id,
          metric: evalResult.rule.metric,
          actualValue: evalResult.actual,
        }
      };

      await saveEvent(alertEvent);
    }
  }
};