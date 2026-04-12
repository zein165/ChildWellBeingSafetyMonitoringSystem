import { Portal, Modal } from 'react-native-paper';
import { Pressable, View, StyleSheet } from 'react-native';

import { colors } from '../../constants/theme/colors';
import { spacing } from '../../constants/theme/spacing';

import { Child } from '../../types/child';

import Icon from './Icon';
import Text from './Text';

type Props = {
  visible: boolean;
  children: Child[];
  activeChildId?: string;
  onClose: () => void;
  onSelect: (child: Child) => void;
  onAddChild?: () => void;
};

export default function ChildDropdown({
  visible,
  children,
  activeChildId,
  onClose,
  onSelect,
  onAddChild,
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

        {children.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Icon
              name="account-off-outline"
              color={colors.textBody}
              size={32}
            />
            <Text size="sm" color={colors.textBody}>
              No child accounts found. Create one to start monitoring.
            </Text>
          </View>
        ) : (
          children.map(child => {
            const isSelected = child.id === activeChildId;

            return (
              <Pressable
                key={child.id}
                style={[
                  styles.childItem,
                  isSelected && styles.childItemSelected,
                ]}
                onPress={() => {
                  onSelect(child);
                  onClose();
                }}
              >
                <View style={styles.iconContainer}>
                  <Icon
                    name="account-circle-outline"
                    color={colors.primary}
                    size={24}
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text size="md" variant="bold" color={colors.textHeading}>
                    {capitalize(child.username)}
                  </Text>
                </View>

                {isSelected && (
                  <Icon name="check-circle" color={colors.primary} size={20} />
                )}
              </Pressable>
            );
          })
        )}

        <View style={styles.divider} />

        <Pressable
          style={styles.childItem}
          onPress={() => {
            onClose();
            if (onAddChild) onAddChild();
          }}
        >
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: colors.background },
            ]}
          >
            <Icon name="plus" color={colors.primary} size={24} />
          </View>

          <View style={{ flex: 1 }}>
            <Text size="md" variant="bold" color={colors.primary}>
              Add Child Account
            </Text>
          </View>
        </Pressable>
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
  childItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: 16,
    gap: spacing.sm,
  },
  childItemSelected: {
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
  emptyStateContainer: {
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
});
