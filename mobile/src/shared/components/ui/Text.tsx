import { Text as RNText, StyleProp, TextStyle } from 'react-native';

import { typography } from '../../constants/theme/typography';
import { colors } from '../../constants/theme/colors';

type Props = {
  variant?: 'regular' | 'semibold' | 'bold';
  size?:
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | 'xxl'
    | 'displaySm'
    | 'displayMd'
    | 'displayLg';
  lineHeight?:
    | 'xs'
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | 'xxl'
    | 'displaySm'
    | 'displayMd'
    | 'displayLg';
  color?: string;
  style?: StyleProp<TextStyle>;
  children: React.ReactNode;
};

const fontVariantMap = {
  regular: typography.fontFamily.regular,
  semibold: typography.fontFamily.bold,
  bold: typography.fontFamily.bold,
};

const fontSizeMap = {
  xs: typography.fontSize.xs,
  sm: typography.fontSize.sm,
  md: typography.fontSize.md,
  lg: typography.fontSize.lg,
  xl: typography.fontSize.xl,
  xxl: typography.fontSize.xxl,
  displaySm: typography.fontSize.displaySm,
  displayMd: typography.fontSize.displayMd,
  displayLg: typography.fontSize.displayLg,
};

const lineHeightMap = {
  xs: typography.lineHeight.xs,
  sm: typography.lineHeight.sm,
  md: typography.lineHeight.md,
  lg: typography.lineHeight.lg,
  xl: typography.lineHeight.xl,
  xxl: typography.lineHeight.xxl,
  displaySm: typography.lineHeight.displaySm,
  displayMd: typography.lineHeight.displayMd,
  displayLg: typography.lineHeight.displayLg,
};

export default function Text({
  variant,
  size,
  lineHeight,
  color,
  children,
  style,
}: Props) {
  return (
    <RNText
      style={{
        fontFamily: fontVariantMap[variant || 'regular'],
        fontSize: fontSizeMap[size || 'md'],
        lineHeight: lineHeightMap[lineHeight || size || 'md'],
        color: color || colors.primary,
        ...style,
      }}
    >
      {children}
    </RNText>
  );
}
