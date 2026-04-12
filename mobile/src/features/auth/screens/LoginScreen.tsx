import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootParamList } from '../../../app/navigation/types.ts';

import { Images } from '../../../assets/images';
import { colors } from '../../../shared/constants/theme/colors.ts';
import { spacing } from '../../../shared/constants/theme/spacing.ts';

import { useAuthStore } from '../../../store/authStore.ts';
import { useUserStore } from '../../../store/userStore.ts';
import { useChildrenStore } from '../../../store/childrenStore.ts';
import { useSnackbarStore } from '../../../store/ui/snackbarStore.ts';

import Button from '../../../shared/components/ui/Button.tsx';
import Text from '../../../shared/components/ui/Text.tsx';
import TextInput from '../../../shared/components/ui/TextInput.tsx';
import HelperText from '../../../shared/components/ui/HelperText.tsx';
import Pressable from '../../../shared/components/ui/Pressable.tsx';

import { useLogin } from '../hooks/useAuth.ts';

type NavigationProp = NativeStackNavigationProp<RootParamList, 'Login'>;

type FieldState = {
  type: 'error' | 'info' | null;
  message: string;
};

export default function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();

  const { setLogin } = useAuthStore();
  const { setUser } = useUserStore();
  const { fetchChildren } = useChildrenStore();
  const { showSnackbar } = useSnackbarStore();

  const { login, loading } = useLogin();

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [usernameFieldState, setUsernameFieldState] = useState<FieldState>({
    type: null,
    message: '',
  });
  const [passwordFieldState, setPasswordFieldState] = useState<FieldState>({
    type: null,
    message: '',
  });

  const handleLogin = async () => {
    if (username.length < 3) {
      setUsernameFieldState({
        type: 'error',
        message: 'Username must be at least 3 characters',
      });
      return;
    }
    setUsernameFieldState({ type: null, message: '' });

    if (password.length === 0) {
      setPasswordFieldState({
        type: 'error',
        message: 'Password is required',
      });
      return;
    }
    setPasswordFieldState({ type: null, message: '' });

    try {
      const data = await login({ username, password });

      setUser(data.user);

      // Fetch children yang terafiliasi dengan parent sebelum redirect
      await fetchChildren(data.user.id);

      setLogin();

      showSnackbar(`Login successful. Welcome ${data.user.username}!`);
    } catch (error: any) {
      showSnackbar(error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          gap: spacing.lg,
        }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Image source={Images.logo} />

        <View style={{ alignItems: 'center' }}>
          <Text size="displayMd" variant="bold" color={colors.primary}>
            Beacon
          </Text>
          <Text size="sm" color={colors.primary}>
            Parental Control Apps
          </Text>
        </View>

        <View
          style={{
            width: '100%',
            gap: spacing.lg,
            paddingHorizontal: spacing.xl,
          }}
        >
          <View style={{ width: '100%', gap: spacing.md }}>
            <View>
              <TextInput
                variant="outlined"
                placeholder="Username"
                leftIcon="account-outline"
                disabled={loading}
                error={usernameFieldState.type === 'error'}
                onChangeText={(username: string) => setUsername(username)}
              />
              {usernameFieldState.type && (
                <HelperText type={usernameFieldState.type}>
                  {usernameFieldState.message}
                </HelperText>
              )}
            </View>

            <View>
              <TextInput
                variant="outlined"
                placeholder="Password"
                leftIcon="lock"
                disabled={loading}
                error={passwordFieldState.type === 'error'}
                secureText={true}
                onChangeText={(password: string) => setPassword(password)}
              />
              {passwordFieldState.type && (
                <HelperText type={passwordFieldState.type}>
                  {passwordFieldState.message}
                </HelperText>
              )}
            </View>

            <View style={{ alignItems: 'flex-end' }}>
              <Pressable onPress={() => {}}>
                <Text size="sm" color={colors.primary}>
                  Forgot Password?
                </Text>
              </Pressable>
            </View>
          </View>

          <View style={{ width: '100%', gap: spacing.md }}>
            <Button
              title="Sign In"
              variant="contained"
              loading={loading}
              onPress={handleLogin}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: spacing.xs,
              }}
            >
              <Text size="sm">Don t have an account?</Text>
              <Pressable onPress={() => navigation.navigate('Register')}>
                <Text size="sm" variant="bold" color={colors.primary}>
                  Sign Up
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
