import { View } from 'react-native';

import { colors } from '../../constants/theme/colors';
import { spacing } from '../../constants/theme/spacing';

import Button from './Button';

type SegmentedControlProps = {
  options: {
    label: string;
    value: string;
    icon?: string;
  }[];
  value: string;
  onChange: (value: string) => void;
};

export default function SegmentedControl({
  options,
  value,
  onChange,
}: SegmentedControlProps) {
  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        borderRadius: 36,
        backgroundColor: colors.inputBackground,
        padding: spacing.xs,
      }}
    >
      {options.map(option => {
        const selected = option.value === value;
        return (
          <Button
            key={option.value}
            title={option.label}
            variant={selected ? 'contained' : 'text'}
            color={selected ? colors.surface : colors.transparent}
            textColor={selected ? colors.primary : colors.textBody}
            style={{
              flex: 1,
              borderRadius: 36,
            }}
            icon={option.icon}
            onPress={() => onChange(option.value)}
          />
        );
      })}
    </View>
  );
}
