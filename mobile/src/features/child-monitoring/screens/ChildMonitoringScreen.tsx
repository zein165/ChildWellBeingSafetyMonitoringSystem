import { useEffect, useRef } from 'react';
import { View, NativeModules, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useUserStore } from '../../../store/userStore';

import { colors } from '../../../shared/constants/theme/colors';
import { spacing } from '../../../shared/constants/theme/spacing';

import Text from '../../../shared/components/ui/Text';
import Icon from '../../../shared/components/ui/Icon';

const { ServiceModule } = NativeModules;

export const ChildMonitoringScreen = () => {
  const { user } = useUserStore();

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (user?.id && ServiceModule) {
      ServiceModule.setChildId(user.id);
      ServiceModule.startTrackingService();
    }

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [user?.id, pulseAnim]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
        gap: spacing.lg,
      }}
    >
      <View
        style={{
          width: 100,
          height: 100,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Animated.View
          style={{
            position: 'absolute',
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: colors.green,
            transform: [{ scale: pulseAnim }],
            opacity: 0.2,
          }}
        />
        <View
          style={{
            width: 70,
            height: 70,
            borderRadius: 35,
            backgroundColor: colors.backgroundWhite,
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 4,
            shadowColor: colors.shadow,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          }}
        >
          <Icon name="security" size={40} color={colors.green} />
        </View>
      </View>

      <View
        style={{
          alignItems: 'center',
        }}
      >
        <Text variant="bold" size="xl" color={colors.green}>
          Monitoring Active
        </Text>
        <Text
          variant="regular"
          size="md"
          color={colors.textBody}
          style={{
            textAlign: 'center',
            marginTop: spacing.md,
            paddingHorizontal: spacing.xl,
          }}
        >
          The application is running as a foreground service to ensure your
          safety and well-being.
        </Text>
      </View>

      <View
        style={{
          backgroundColor: colors.surface,
          padding: spacing.lg,
          borderRadius: 12,
          width: '100%',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: colors.border,
        }}
      >
        <Text variant="semibold" size="md" color={colors.textHeading}>
          User: {user?.username}
        </Text>
      </View>
    </SafeAreaView>
  );
};
