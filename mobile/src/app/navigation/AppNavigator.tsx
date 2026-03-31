import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../../features/home/screens/HomeScreen.tsx';

import { AppParamList } from './types.ts';

const Stack = createNativeStackNavigator<AppParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
  );
}