import React from 'react';
import { HelperText as PaperHelperText } from 'react-native-paper';

type Props = {
  type: 'error' | 'info';
  visible?: boolean;
  children: React.ReactNode;
};

export default function HelperText({ type, visible = true, children }: Props) {
  return (
    <PaperHelperText
      visible={visible}
      type={type}
      style={{ fontFamily: 'Poppins-Regular' }}
    >
      {children}
    </PaperHelperText>
  );
}
