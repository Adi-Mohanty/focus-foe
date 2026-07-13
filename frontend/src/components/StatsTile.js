import React from 'react';
import {
  View,
  Text,
} from 'react-native';

import { C } from '../constants/colors';
import { S } from '../styles/allStyles';

export default function StatsTile({
  icon: Icon,
  label,
  value,
  themeColor,
}) {
  return (
    <View
      style={
        S.analyticsTile
      }
    >
      <View
        style={[
          S.analyticsIcon,
          {
            backgroundColor: `${themeColor}16`,
          }
        ]}
      >
        <Icon
          size={18}
          color={themeColor}
        />
      </View>

      <Text
        style={
          S.analyticsValue
        }
      >
        {value}
      </Text>

      <Text
        style={
          S.analyticsLabel
        }
      >
        {label}
      </Text>
    </View>
  )
}