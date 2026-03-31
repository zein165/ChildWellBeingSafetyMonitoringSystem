import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

import { RootParamList } from '../../../app/navigation/types';

import { Images } from '../../../assets/images';
import { colors } from '../../../shared/constants/theme/colors';
import { spacing } from '../../../shared/constants/theme/spacing';

import { useSnackbarStore } from '../../../store/ui/snackbarStore';

import Text from '../../../shared/components/ui/Text';
import Button from '../../../shared/components/ui/Button';
import TextInput from '../../../shared/components/ui/TextInput';
import Pressable from '../../../shared/components/ui/Pressable';
import HelperText from '../../../shared/components/ui/HelperText';

import { useRegister } from '../hooks/useAuth';

type NavigationProp = NativeStackNavigationProp<RootParamList, 'Register'>;

type FieldState = {
  type: 'error' | 'info' | null;
  message: string;
};

export default function RegisterScreen() {
  const navigation = useNavigation<NavigationProp>();

  const { register, loading } = useRegister();
  const { showSnackbar } = useSnackbarStore();

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

  const handleRegister = async () => {
    if (username.length < 3) {
      setUsernameFieldState({
        type: 'error',
        message: 'Username must be at least 3 characters',
      });
      return;
    }
    setUsernameFieldState({ type: null, message: '' });

    if (password.length < 6) {
      setPasswordFieldState({
        type: 'error',
        message: 'Password is required and must be at least 6 characters',
      });
      return;
    }
    setPasswordFieldState({ type: null, message: '' });

    try {
      const data = await register({ username, password });
      showSnackbar(`Registration successful. Please login as ${data.username}!`);
      navigation.navigate('Login')
    } catch (error: any) {
      console.log(error);
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
            Create Account
          </Text>
          <Text size="sm" color={colors.primary}>
            Set up your parent account to start monitoring.
          </Text>
        </View>

        <View
          style={{
            width: '100%',
            gap: spacing.lg,
            paddingHorizontal: spacing.xl,
          }}
        >
          <View
            style={{
              width: '100%',
              gap: spacing.md
            }}>
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
          </View>

          <View style={{ width: '100%', gap: spacing.md }}>
            <Button
              title="Sign Up"
              variant="contained"
              color={colors.buttonPrimary}
              loading={loading}
              onPress={handleRegister}
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: spacing.xs,
              }}
            >
              <Text size="sm">Already have an account?</Text>
              <Pressable onPress={() => navigation.navigate('Login')}>
                <Text size="sm" variant="bold" color={colors.primary}>
                  Sign In
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
