import React from 'react';
import { Pressable as RNPressable } from 'react-native';

type Props = {
  children: React.ReactNode;
  onPress: () => void;
};

export default function Pressable({ children, onPress }: Props) {
  return (
    <RNPressable
      style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
      onPress={onPress}
    >
      {children}
    </RNPressable>
  );
}
