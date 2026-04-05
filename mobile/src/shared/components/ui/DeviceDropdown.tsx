import { Portal, Modal } from "react-native-paper";
import { Pressable, View, StyleSheet } from "react-native";

import Icon from './Icon';
import Text from './Text';
import { colors } from '../../constants/theme/colors';
import { spacing } from '../../constants/theme/spacing';

type Device = {
    id: string;
    name: string;
    status: 'ONLINE' | 'OFFLINE';
};

type Props = {
  visible: boolean;
  devices: Device[];
  selectedDeviceId?: string;
  onClose: () => void;
  onSelect: (device: Device) => void;
};

export default function DeviceDropdown({
    visible,
    devices,
    selectedDeviceId,
    onClose,
    onSelect,
}: Props) {
    function capitalize(str: string) {
        if (!str) return str;
        return str[0].toUpperCase() + str.slice(1);
    }

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={onClose}
                contentContainerStyle={styles.dropdownContainer}
                theme={{ colors: { backdrop: 'transparent' } }}
                >
                <Pressable style={styles.overlay} onPress={onClose} />
                {devices.map((device) => {
                        const isSelected = device.id === selectedDeviceId;
                        const isOnline = device.status === 'ONLINE';

                    return (
                        <Pressable
                            key={device.id}
                            style={[
                                styles.deviceItem,
                                isSelected && styles.deviceItemSelected,
                            ]}
                            onPress={() => {
                                onSelect(device);
                                onClose();
                            }}
                        >
                            <View style={styles.iconContainer}>
                                <Icon name="cellphone" color={colors.primary} size={24} />
                            </View>

                            <View>
                                <Text size="md" variant="bold" color={colors.textHeading}>
                                    {`${capitalize(device.name)}'s Phone`}
                                </Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.xs }}>
                                    <View
                                        style={[
                                            styles.statusDot,
                                            { backgroundColor: isOnline ? colors.successText : colors.textBody },
                                        ]}
                                    />
                                    <Text
                                        size="xs"
                                        color={isOnline ? colors.successText : colors.textBody}
                                        variant="bold"
                                    >
                                        {device.status}
                                    </Text>
                                </View>
                            </View>
                        </Pressable>
                    );
                })}
            </Modal>
        </Portal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        flex: 1,
    },
    dropdownContainer: {
        position: 'absolute',
        top: 68,
        marginLeft: 4,
        width: 250,
        backgroundColor: colors.backgroundWhite,
        borderRadius: 20,
        padding: 8,
        elevation: 24,
        shadowColor: colors.primary,
        shadowOffset: { width: 10, height: 10 },
        shadowOpacity: 1,
        shadowRadius: 40,
        borderWidth: 0.3,
        borderColor: colors.border,
    },
    deviceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.sm,
        borderRadius: 16,
        gap: spacing.sm
    },
    deviceItemSelected: {
        backgroundColor: colors.background, 
    },
    iconContainer: {
        backgroundColor: colors.iconBackground,
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
});