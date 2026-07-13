import React from 'react';
import { View, Text } from 'react-native';

import { C } from '../constants/colors';
import { F } from '../constants/fonts';
import { S } from '../styles/allStyles';

export default function DialogueBubble({
  text,
  loading,
  accent = C.primary,
  backgroundColor = C.bgCard,
  borderColor = C.borderSub,
  textColor = C.white,
  compact = false,
}) {
    return (
      <View
        style={[
          S.bubble,
          {
            backgroundColor,
            borderColor,
            borderLeftColor: accent,
            marginHorizontal: compact ? 0 : 20,
          },
        ]}
      >
        {loading ? (
          <View
            style={{
              flexDirection: 'row',
              gap: 6,
              justifyContent: 'center',
              paddingVertical: 4,
            }}
          >
            {[0, 1, 2].map(i => (
              <View
                key={i}
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 99,
                  backgroundColor: accent,
                  opacity: 0.7,
                }}
              />
            ))}
          </View>
        ) : (
          <Text
            style={[
              F.villain,
              {
                color: textColor,
                fontSize: 16,
                lineHeight: 26,
                fontStyle: 'italic',
              },
            ]}
          >
            {text}
          </Text>
        )}
      </View>
    );
  }