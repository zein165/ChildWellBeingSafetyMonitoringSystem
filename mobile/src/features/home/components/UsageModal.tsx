import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Modal,
  Image,
  TouchableOpacity,
} from 'react-native';
import { IconButton } from 'react-native-paper';
import { colors } from '../../../shared/constants/theme/colors';
import { spacing } from '../../../shared/constants/theme/spacing';
import Text from '../../../shared/components/ui/Text';
import Card from '../../../shared/components/ui/Card';
import CustomProgressBar from '../../../shared/components/ui/CustomProgressBar';
import { DailyUsageDetail } from '../services/usageService';

interface UsageModalProps {
  visible: boolean;
  onClose: () => void;
  date: string;
  data: DailyUsageDetail[];
}

export const UsageModal: React.FC<UsageModalProps> = ({
  visible,
  onClose,
  date,
  data,
}) => {
  const maxDuration =
    data.length > 0 ? Math.max(...data.map(d => d.durationMinutes)) : 1;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View>
              <Text variant="bold" size="xl" color={colors.textHeading}>
                App Usage Details
              </Text>
              <Text variant="regular" size="sm" color={colors.textBody}>
                {date}
              </Text>
            </View>
            <IconButton
              icon="close"
              onPress={onClose}
              iconColor={colors.textHeading}
            />
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {data.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text color={colors.textBody}>
                  No activity found for this day.
                </Text>
              </View>
            ) : (
              <View style={{ gap: spacing.lg }}>
                {data.map(app => (
                  <View
                    key={app.id}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 16,
                    }}
                  >
                    <View style={styles.iconPlaceholder}>
                      <Text size="xs" color={colors.primary}>
                        {app.appName.charAt(0).toUpperCase()}
                      </Text>
                    </View>

                    <View style={{ flex: 1, gap: 8 }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <Text
                          size="md"
                          variant="bold"
                          color={colors.textHeading}
                          style={{ flex: 1 }}
                        >
                          {app.appName}
                        </Text>
                        <Text
                          size="sm"
                          color={colors.textBody}
                          style={{ marginLeft: spacing.sm }}
                        >
                          {app.timeDisplay}
                        </Text>
                      </View>
                      <CustomProgressBar
                        progress={app.durationMinutes / maxDuration}
                        color={colors.primary}
                      />
                    </View>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '80%',
    paddingTop: spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  emptyContainer: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  iconPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
});
