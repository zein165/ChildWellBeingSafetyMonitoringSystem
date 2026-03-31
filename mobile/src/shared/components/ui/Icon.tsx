import { Icon as PaperIcon } from 'react-native-paper';

import { colors } from '../../constants/theme/colors';

type Props = {
  name: string;
  color?: string;
  size?: number;
};

export default function Icon({ name, color, size }: Props) {
  return (
    <PaperIcon
      source={name}
      color={color || colors.black}
      size={size || 20}
    />
  );
}
