import { View } from 'react-native';

import { colors } from '../../constants/theme/colors';
import { spacing } from '../../constants/theme/spacing';

import Text from '../ui/Text';

type Props = {
  title: string;
  subtitle: string;
};

export default function AppPageHeader({ title, subtitle }: Props) {
  return (
    <View style={{ gap: spacing.xs }}>
      <Text variant="bold" size="xl" color={colors.textHeading}>
        {title}
      </Text>
      <Text size="sm" color={colors.textBody}>
        {subtitle}
      </Text>
    </View>
  );
}
