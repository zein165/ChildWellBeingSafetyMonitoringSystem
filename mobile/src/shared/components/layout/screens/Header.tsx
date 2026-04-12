import { useState } from 'react';
import { View, Pressable, Alert } from 'react-native';

import { colors } from '../../../constants/theme/colors';
import { spacing } from '../../../constants/theme/spacing';

import { useChildrenStore } from '../../../../store/childrenStore';
import { useUserStore } from '../../../../store/userStore';
import { authService } from '../../../../features/auth/services/authService';

import IconButton from '../../ui/IconButton';
import Icon from '../../ui/Icon';
import Text from '../../ui/Text';
import ChildDropdown from '../../ui/ChildDropdown';
import Modal from '../../ui/Modal';
import TextInput from '../../ui/TextInput';
import Button from '../../ui/Button';
import { useSnackbarStore } from '../../../../store/ui/snackbarStore';

type Props = {
  onSettingsPress?: () => void;
};

export default function Header({ onSettingsPress }: Props) {
  const { user } = useUserStore();
  const { children, activeChild, setActiveChild, fetchChildren } = useChildrenStore();
  const { showSnackbar } = useSnackbarStore();

  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isAddChildModalVisible, setAddChildModalVisible] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const hasChildren = children.length > 0;

  const displayName = activeChild
    ? `${capitalize(activeChild.username)}'s Phone`
    : 'No child account';

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
        backgroundColor: colors.backgroundWhite,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
        }}
      >
        <View
          style={{
            backgroundColor: colors.iconBackground,
            borderRadius: 20,
            padding: spacing.sm,
          }}
        >
          <Icon
            name="account-circle-outline"
            color={hasChildren ? colors.icon : colors.textBody}
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
              color={hasChildren ? colors.textHeading : colors.textBody}
            >
              {displayName}
            </Text>
            <Icon name="chevron-down" color={colors.textHeading} size={20} />
          </Pressable>
          {!hasChildren && (
            <Text size="xs" color={colors.textBody}>
              Create a child account first
            </Text>
          )}
        </View>
      </View>
      <IconButton
        name="cog-outline"
        color={colors.textBody}
        size={28}
        onPress={onSettingsPress}
      />
      <ChildDropdown
        visible={isDropdownVisible}
        children={children}
        activeChildId={activeChild?.id}
        onClose={() => setDropdownVisible(false)}
        onSelect={child => setActiveChild(child)}
        onAddChild={() => setAddChildModalVisible(true)}
      />

      <Modal
        visible={isAddChildModalVisible}
        onDismiss={() => setAddChildModalVisible(false)}
      >
        <View style={{ gap: spacing.md }}>
          <View>
            <Text variant="bold" size="lg" color={colors.textHeading}>
              Register Child Account
            </Text>
            <Text size="sm" color={colors.textBody}>
              Provide a username and PIN for your child to login on their
              device.
            </Text>
          </View>
          <View style={{ gap: spacing.md }}>
            <TextInput
              variant="outlined"
              placeholder="Username"
              leftIcon="account-outline"
              value={username}
              onChangeText={setUsername}
            />

            <TextInput
              variant="outlined"
              placeholder="PIN"
              leftIcon="lock-outline"
              secureText
              value={password}
              onChangeText={setPassword}
            />
          </View>
          <Button
            title="Register Child"
            variant="contained"
            loading={isLoading}
            onPress={async () => {
              if (!username || !password) {
                showSnackbar('Please fill out both username and pin fields');
                return;
              }
              if (!user) {
                showSnackbar('Parent user not authenticated');
                return;
              }

              try {
                setIsLoading(true);
                await authService.registerChild({
                  parentId: user.id,
                  username,
                  pin: password,
                });
                
                await fetchChildren(user.id);
                setAddChildModalVisible(false);
                setUsername('');
                setPassword('');
                showSnackbar('Child account registered successfully');
              } catch (error: any) {
                showSnackbar(error.message || 'Something went wrong');
              } finally {
                setIsLoading(false);
              }
            }}
          />
        </View>
      </Modal>
    </View>
  );
}
