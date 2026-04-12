import { StyleProp, TextStyle } from 'react-native';
import {
  TextInput as PaperTextInput,
} from 'react-native-paper';

import { colors } from '../../constants/theme/colors.ts';
import { typography } from '../../constants/theme/typography.ts';

type Props = {
  variant: 'flat' | 'outlined';
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  style?: StyleProp<TextStyle>;
  leftIcon?: string;
  rightIcon?: string;
  iconColor?: string;
  secureText?: boolean;
  error?: boolean;
  onChangeText?: (text: string) => void;
};

export default function TextInput({
  variant,
  value,
  placeholder,
  disabled = false,
  style,
  leftIcon,
  rightIcon,
  iconColor = colors.inputPlaceholder,
  secureText = false,
  error = false,
  onChangeText
}: Props) {
  return (
    <PaperTextInput
      mode={variant}
      value={value}
      placeholder={placeholder}
      placeholderTextColor={colors.inputPlaceholder}
      disabled={disabled}
      outlineStyle={{ borderRadius: 12, borderColor: error ? colors.dangerBorder : colors.inputBorder }}
      style={[{ backgroundColor: error ? colors.dangerBackground : colors.inputBackground }, style]}
      contentStyle={{ fontFamily: 'Poppins-Regular', fontSize: typography.fontSize.md }}
      left={leftIcon ? <PaperTextInput.Icon icon={leftIcon} color={iconColor} /> : undefined}
      right={rightIcon ? <PaperTextInput.Icon icon={rightIcon} color={iconColor} /> : undefined}
      secureTextEntry={secureText}
      error={error}
      onChangeText={onChangeText}
    />
  );
}
