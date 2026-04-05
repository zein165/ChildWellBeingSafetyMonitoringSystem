import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';

import { useAuthStore } from '../../store/authStore.ts';

export default function RootNavigator() {
  const { isLoggedIn } = useAuthStore();

  return (
    <NavigationContainer>
      {isLoggedIn ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  )
}