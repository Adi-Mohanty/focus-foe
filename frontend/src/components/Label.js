import React from 'react';
import { Text } from 'react-native';

import { C } from '../constants/colors';
import { F } from '../constants/fonts';

export default function Label({
  children,
  color,
  style,
}) {
  return (
    <Text
      style={[
        F.label,
        {
          color: color || C.muted,
          fontSize: 11,
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}