import React from 'react';

import {
  Pressable,
  Text,
} from 'react-native';

import { S } from '../styles/allStyles';

export default function SettingButton({
  title,
  onPress,
  danger,
}) {
  return (
    <Pressable
      style={[
        S.settingButton,
        danger &&
          S.settingDanger,
      ]}
      onPress={onPress}
    >
      <Text
        style={S.settingButtonText}
      >
        {title}
      </Text>
    </Pressable>
  );
}