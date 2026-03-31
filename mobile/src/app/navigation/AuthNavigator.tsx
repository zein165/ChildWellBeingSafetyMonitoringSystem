import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../../features/auth/screens/LoginScreen.tsx';
import RegisterScreen from '../../features/auth/screens/RegisterScreen.tsx';

import { AuthParamList } from './types.ts';

const Stack = createNativeStackNavigator<AuthParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  )
}