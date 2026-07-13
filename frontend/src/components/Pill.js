import React from 'react';
import {
  View,
  Text,
} from 'react-native';

import { F } from '../constants/fonts';

export default function Pill({ label, color, bg }) {
    return (
      <View style={{
        paddingHorizontal: 12, paddingVertical: 4,
        borderRadius: 99,
        borderWidth: 1,
        borderColor: color,
        backgroundColor: bg || `${color}18`,
      }}>
        <Text style={[F.label, { color, fontSize: 10 }]}>{label}</Text>
      </View>
    );
  }