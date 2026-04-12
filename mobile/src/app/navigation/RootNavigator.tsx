import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';

import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store/userStore';
import { useChildrenStore } from '../../store/childrenStore';

import { usePermissions } from '../../shared/hooks/usePermissions';
import { PermissionScreen } from '../../shared/screens/PermissionScreen';
import { colors } from '../../shared/constants/theme/colors';

import { ChildMonitoringScreen } from '../../features/child-monitoring/screens/ChildMonitoringScreen';

const isChild = (role: string | undefined) => {
  if (!role) return false;
  return role.toUpperCase() === 'CHILD';
};

export default function RootNavigator() {
  const { isLoggedIn } = useAuthStore();
  const { user } = useUserStore();
  const { restoreActiveChild } = useChildrenStore();
  const { isAllGranted, loading: permissionsLoading, checkPermissions } = usePermissions();

  useEffect(() => {
    if (isLoggedIn && user?.id && !isChild(user?.role)) {
      restoreActiveChild(user.id);
    }
  }, [isLoggedIn, user?.id, user?.role]);

  if (permissionsLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!isAllGranted) {
    return (
      <NavigationContainer>
        <PermissionScreen onContinue={checkPermissions} />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      {!isLoggedIn ? (
        <AuthNavigator />
      ) : isChild(user?.role) ? (
        <ChildMonitoringScreen />
      ) : (
        <AppNavigator />
      )}
    </NavigationContainer>
  );
}