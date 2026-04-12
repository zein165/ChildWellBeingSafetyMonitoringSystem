import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { usePermissions } from '../hooks/usePermissions';
import Button from '../components/ui/Button';
import Text from '../components/ui/Text';
import { colors } from '../constants/theme/colors';
import { spacing } from '../constants/theme/spacing';
import Icon from '../components/ui/Icon';
import { SafeAreaView } from 'react-native-safe-area-context';

export interface PermissionScreenProps {
  onContinue: () => void;
}

export const PermissionScreen: React.FC<PermissionScreenProps> = ({
  onContinue,
}) => {
  const {
    status,
    requestLocation,
    requestNotification,
    requestUsageAccess,
    isAllGranted,
  } = usePermissions();

  const PermissionItem = ({
    title,
    description,
    icon,
    granted,
    onPress,
  }: {
    title: string;
    description: string;
    icon: string;
    granted: boolean;
    onPress: () => void;
  }) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        backgroundColor: colors.surface,
        padding: spacing.lg,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: colors.iconBackground,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: spacing.md,
        }}
      >
        <Icon
          name={icon}
          size={28}
          color={granted ? colors.green : colors.primary}
        />
      </View>

      <View
        style={{
          flex: 1,
        }}
      >
        <Text variant="semibold" size="md" color={colors.textHeading}>
          {title}
        </Text>
        <Text variant="regular" size="sm" color={colors.textBody}>
          {description}
        </Text>
      </View>

      <Button
        variant={granted ? 'contained' : 'outlined'}
        title={granted ? 'Granted' : 'Allow'}
        onPress={onPress}
        loading={false}
        color={granted ? colors.green : colors.primary}
      />
    </View>
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <ScrollView
        style={{
          padding: spacing.xl,
        }}
        contentContainerStyle={{
          gap: spacing.lg,
          paddingBottom: spacing.xxl,
        }}
      >
        <View>
          <Text variant="bold" size="xl" color={colors.textHeading}>
            Permissions Required
          </Text>
          <Text variant="regular" size="md" color={colors.textBody}>
            To keep your child safe, we need the following permissions to work
            correctly in the background.
          </Text>
        </View>

        <PermissionItem
          title="Location"
          description="Allows monitoring of your child's movement and safety zones."
          icon="location-on"
          granted={status.location}
          onPress={requestLocation}
        />

        <PermissionItem
          title="Notifications"
          description="Required to show the foreground service and alert you of important events."
          icon="notifications"
          granted={status.notifications}
          onPress={requestNotification}
        />

        <PermissionItem
          title="Usage Access"
          description="Allows us to track app usage time and restrict dangerous apps."
          icon="bar-chart"
          granted={status.usageAccess}
          onPress={requestUsageAccess}
        />
      </ScrollView>

      <View
        style={{
          padding: spacing.lg,
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        }}
      >
        <Button
          variant="contained"
          title="Continue to App"
          onPress={onContinue}
          loading={!isAllGranted}
        />
      </View>
    </SafeAreaView>
  );
};
