import React from 'react';
import { View, Text } from 'react-native';

import { S } from '../styles/allStyles';

export default function SettingCard({
  title,
  icon,
  children,
}) {
  const Icon = icon;

  return (
    <View style={S.settingCard}>
      <View style={S.settingHeader}>
        <Icon size={16} />
        <Text style={S.settingTitle}>
          {title}
        </Text>
      </View>

      {children}
    </View>
  );
}