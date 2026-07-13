import React from 'react';

import {
  View,
  Text,
  Switch,
} from 'react-native';

import { C } from '../constants/colors';

export default function SettingToggle({
  label,
  disabled,
  value,
  onChange,
  themeColor,
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 5,
      }}
    >
      <Text
        style={{
          color: C.white,
        }}
      >
        {label}
      </Text>

      <Switch
        disabled={disabled}
        value={value}
        onValueChange={onChange}
        thumbColor={themeColor}
      />
    </View>
  );
}