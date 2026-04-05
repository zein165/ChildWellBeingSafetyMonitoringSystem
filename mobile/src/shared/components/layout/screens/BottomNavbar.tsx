import { View, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { colors } from '../../../constants/theme/colors';

export default function BottomNavbar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        let iconName = '';

        if (route.name === 'Home') iconName = isFocused ? 'home' : 'home-outline';
        else if (route.name === 'Location') iconName = isFocused ? 'map-marker' : 'map-marker-outline';
        else if (route.name === 'Applications') iconName = isFocused ? 'view-grid' : 'view-grid-outline';
        else if (route.name === 'Activity') iconName = isFocused ? 'pulse' : 'pulse';
        else if (route.name === 'Rule') iconName = isFocused ? 'bell' : 'bell-outline';

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <IconButton
            key={route.key}
            icon={iconName}
            size={28}
            onPress={onPress}
            iconColor={isFocused ? colors.navbarActive : colors.navbarInactive}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 70,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.backgroundWhite,

    borderTopWidth: 0,
    elevation: 10,

    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
});