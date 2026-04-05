import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';

import HomeScreen from '../../features/home/screens/HomeScreen';
import { BottomTabParamList } from './types';
import { colors } from '../../shared/constants/theme/colors';
import BottomNavbar from '../../shared/components/layout/screens/BottomNavbar';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const DummyScreen = () => <View style={{ flex: 1, backgroundColor: colors.background }} />;

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={props => <BottomNavbar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Location" component={DummyScreen} />
      <Tab.Screen name="Applications" component={DummyScreen} />
      <Tab.Screen name="Activity" component={DummyScreen} />
      <Tab.Screen name="Rule" component={DummyScreen} />
    </Tab.Navigator>
  );

}