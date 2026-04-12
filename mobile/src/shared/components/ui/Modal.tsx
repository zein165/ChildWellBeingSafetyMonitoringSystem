import React from 'react';
import { View } from 'react-native';
import { Portal as PortalPaper, Modal as ModalPaper } from 'react-native-paper';

import { colors } from '../../constants/theme/colors';
import { spacing } from '../../constants/theme/spacing';

type Props = {
  children: React.ReactNode;
  visible: boolean;
  onDismiss: () => void;
};

export default function Modal({ children, visible, onDismiss }: Props) {
  return (
    <PortalPaper>
      <ModalPaper visible={visible} onDismiss={onDismiss}>
        <View
          style={{
            backgroundColor: colors.backgroundWhite,
            padding: spacing.lg,
            borderRadius: 12,
            marginHorizontal: spacing.xl,
          }}
        >
          {children}
        </View>
      </ModalPaper>
    </PortalPaper>
  );
}
