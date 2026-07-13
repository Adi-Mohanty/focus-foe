import React from 'react';

import {
  View,
  Text,
} from 'react-native';

import { C } from '../constants/colors';
import { F } from '../constants/fonts';

export default function XPBar({
  progress,
  level,
  themeColor,
}) {
    return (
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
          <Text style={[F.label, { color: themeColor, fontSize: 10 }]}>LVL {level}</Text>
          <Text style={[F.label, { color: C.mutedDim, fontSize: 10 }]}>LVL {level + 1}</Text>
        </View>
        <View style={{ height: 5, backgroundColor: C.bgCardHigh, borderRadius: 99, overflow: 'hidden' }}>
          <View style={{ width: `${progress * 100}%`, height: '100%', backgroundColor: themeColor, borderRadius: 99 }} />
        </View>
      </View>
    );
  }