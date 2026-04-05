import { useState } from "react";
import { View, Pressable } from "react-native";

import IconButton from "../../ui/IconButton";
import Icon from "../../ui/Icon";
import Text from '../../ui/Text';
import DeviceDropdown from "../../ui/DeviceDropdown";

import { colors } from "../../../constants/theme/colors";
import { spacing } from '../../../constants/theme/spacing';

import { useDevices } from "../hooks/useDevice";
import { useUserStore } from '../../../../store/userStore';

type Props = {
  onSettingsPress?: () => void;
};

export default function Header({ onSettingsPress, }: Props) {
  const { user } = useUserStore();
  const parentId = user?.id || '';

  const { devices, loading } = useDevices(parentId);

  const [isDropdownVisible, setDropdownVisible] = useState(false);
  
  const [selectedDevice, setSelectedDevice] = useState(devices[0] || null);

  if (!selectedDevice && devices.length > 0) {
    setSelectedDevice(devices[0]);
  }

  const deviceName = selectedDevice 
    ? `${capitalize(selectedDevice.name)}'s Phone` 
    : "Child's Phone";

  const status = selectedDevice?.status || 'OFFLINE';
  const isOnline = status === 'ONLINE';

  function capitalize(str: string) {
    if (!str) return str;
    return str[0].toUpperCase() + str.slice(1);
  }

  return (
    <View 
      style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingHorizontal: spacing.md, 
        paddingTop: spacing.sm,
        paddingBottom: spacing.md, 
        backgroundColor: colors.backgroundWhite
      }}
    >
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: spacing.sm }}>
        <View style={{ 
          backgroundColor: colors.iconBackground, 
          borderRadius: 20,
          padding: spacing.sm 
        }} >
          <Icon
            name="cellphone" 
            color={colors.icon} 
            size={24}
          />
        </View>
        <View>
          <Pressable 
            style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
            onPress={() => setDropdownVisible(true)}
          >
            <Text 
              size="md" 
              variant="bold" 
              color={colors.textHeading}>
                {deviceName}
              </Text>
            <Icon 
              name="chevron-down" 
              color={colors.textHeading} 
              size={20}
            />
          </Pressable>
          <View style={{ 
            flexDirection: 'row', 
            alignItems: 'center', 
            gap: spacing.xs }}>
            <View 
              style={{ 
                width: 8, 
                height: 8, 
                borderRadius: 4, 
                backgroundColor: isOnline ? colors.successText : colors.textBody 
              }} 
            />
            <Text 
              size="xs" 
              color={isOnline ? colors.successText : colors.textBody} 
              variant="bold">
              {status}
            </Text>
          </View>
        </View>
      </View>
      <IconButton name="cog-outline" color={colors.textBody} size={28} onPress={onSettingsPress}/>
      <DeviceDropdown 
        visible={isDropdownVisible}
        devices={devices}
        selectedDeviceId={selectedDevice?.id}
        onClose={() => setDropdownVisible(false)}
        onSelect={(device) => setSelectedDevice(device)}
      />
    </View>
  );
}