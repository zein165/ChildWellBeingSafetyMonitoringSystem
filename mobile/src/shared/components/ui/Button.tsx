import { StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';

import { colors } from '../../constants/theme/colors';

type Props = {
  variant?: 'text' | 'outlined' | 'contained' | 'elevated';
  color?: string;
  textColor?: string;
  icon?: string;
  title: string;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  loading?: boolean;
  onPress?: () => void;
};

export default function Button({
  variant = 'contained',
  color,
  textColor,
  icon,
  title,
  style,
  contentStyle,
  labelStyle,
  loading = false,
  onPress,
}: Props) {
  return (
    <PaperButton
      mode={variant}
      textColor={
        textColor ||
        (variant === 'contained' || variant === 'elevated'
          ? colors.surface
          : colors.primary)
      }
      {...(variant === 'contained' || variant === 'elevated'
        ? { buttonColor: color || colors.primary }
        : {})}
      style={style}
      contentStyle={[
        {
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        },
        contentStyle,
      ]}
      labelStyle={[
        { fontFamily: 'Poppins-Regular', textAlign: 'center' },
        labelStyle,
      ]}
      icon={icon}
      loading={loading}
      disabled={loading}
      onPress={onPress}
    >
      {title}
    </PaperButton>
  );
}
