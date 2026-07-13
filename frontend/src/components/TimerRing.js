import React from 'react';

import {
  View,
  Text,
} from 'react-native';

import Svg, {
  Circle,
} from 'react-native-svg';

import { C } from '../constants/colors';
import { F } from '../constants/fonts';

import {
  formatTime,
} from '../utils/timeUtils';

export default function TimerRing({ secondsLeft, totalSeconds, themeColor = C.primary, size = 220 }) {
    const r = (size - 20) / 2;
    const circ = 2 * Math.PI * r;
    const pct = totalSeconds > 0 ? secondsLeft / totalSeconds : 0;
    const offset = circ * (1 - pct);
    const isDanger = pct < 0.25 && pct > 0;
    const strokeColor = isDanger ? C.red : themeColor;
  
    return (
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={size} height={size} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
          {/* track */}
          <Circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.bgCardHigh} strokeWidth={10} />
          {/* progress */}
          <Circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke={strokeColor} strokeWidth={10}
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </Svg>
        <View style={{ alignItems: 'center' }}>
          <Text style={[F.mono, { color: C.onSurface, fontSize: 48, lineHeight: 56 }]}>
            {formatTime(secondsLeft)}
          </Text>
          <Text style={[F.label, { color: C.muted, fontSize: 10, marginTop: 4 }]}>
            REMAINING
          </Text>
        </View>
      </View>
    );
  }