import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { colors } from '../../shared/constants/theme/colors.ts';

import Header from '../../shared/components/layout/screens/Header.tsx';
import BottomNavbar from '../../shared/components/layout/screens/BottomNavbar.tsx';

import HomeScreen from '../../features/home/screens/HomeScreen.tsx';
import { LocationScreen } from '../../features/location/screens/LocationScreen.tsx';
import ApplicationInventoryScreen from '../../features/application-inventory/screens/ApplicationInventoryScreen.tsx';

import { AppParamList } from './types.ts';

const Tab = createBottomTabNavigator<AppParamList>();

const DummyScreen = () => (
  <View style={{ flex: 1, backgroundColor: colors.background }} />
);

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        header: () => (
          <Header onSettingsPress={() => console.log('Settings pressed')} />
        ),
      }}
      tabBar={props => <BottomNavbar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Location" component={LocationScreen} />
      <Tab.Screen name="Applications" component={ApplicationInventoryScreen} />
      <Tab.Screen name="Activity" component={DummyScreen} />
      <Tab.Screen name="Rule" component={DummyScreen} />
    </Tab.Navigator>
  );
}