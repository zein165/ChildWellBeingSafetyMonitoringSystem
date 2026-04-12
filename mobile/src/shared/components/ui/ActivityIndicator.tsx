import { ActivityIndicator as ActivityIndicatorPaper } from 'react-native-paper';

import { colors } from '../../constants/theme/colors';

type Props = {
  toggle: boolean;
  size?: number;
};

export default function ActivityIndicator({ toggle, size }: Props) {
  return <ActivityIndicatorPaper animating={toggle} color={colors.primary} size={size || 'large'} />;
}
