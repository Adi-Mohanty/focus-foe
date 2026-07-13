import React from 'react';

import {
  View,
  Pressable,
  Text,
} from 'react-native';

import { C } from '../constants/colors';
import { S } from '../styles/allStyles';

export default function SettingSelector({
  options,
  value,
  onChange,
  themeColor,
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 8,
        marginTop: 12,
      }}
    >
      {options.map(option => {
        const active =
          value === option;

        return (
          <Pressable
            key={option}
            onPress={() =>
              onChange(option)
            }
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: 12,
              alignItems: 'center',
              backgroundColor:
                active
                  ? themeColor
                  : '#1B1D38',
            }}
          >
            <Text
              style={{
                color:
                  active
                    ? '#fff'
                    : C.muted,
                fontWeight: '700',
              }}
            >
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}