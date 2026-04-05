import { StyleProp, ViewStyle, TouchableOpacity, View } from "react-native";
import { Surface } from "react-native-paper";
import { colors } from "../../constants/theme/colors";
import { spacing } from "../../constants/theme/spacing";

type CardVariant = 'default' | 'elevated' | 'outlined';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: CardVariant;
  padding?: number;
  borderRadius?: number;
  backgroundColor?: string;
  onPress?: () => void;
};

export default function Card({
  children,
  style,
  variant = 'default',
  padding = spacing.lg,
  borderRadius = 20,
  backgroundColor,
  onPress,
}: Props) {
  const surfaceStyle: ViewStyle = {
    padding,
    borderRadius,
    backgroundColor: backgroundColor || colors.surface,
    elevation: variant === 'elevated' ? 2 : 0,
    shadowColor: variant === 'elevated' ? colors.shadow : 'transparent',
    shadowOffset: variant === 'elevated' ? { width: 0, height: 2 } : undefined,
    shadowOpacity: variant === 'elevated' ? 0.5 : 0,
    shadowRadius: variant === 'elevated' ? 12 : 0,
    borderWidth: variant === 'outlined' ? 1 : 0,
    borderColor: variant === 'outlined' ? colors.inputBorder : 'transparent',
  };

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <Surface style={[surfaceStyle, style]}>
          {children}
        </Surface>
      </TouchableOpacity>
    );
  }

  return <Surface style={[surfaceStyle, style]}>{children}</Surface>;
}