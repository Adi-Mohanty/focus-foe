import React from 'react';
import { Shield } from "lucide-react-native";
import { ActivityIndicator, Text, View } from "react-native";
import OverseerAvatar from './OverseerAvatar';

import { C } from '../constants/colors';
import { S } from '../styles/allStyles';

export default function LoadingOverlay({
    transitionLoading,
    villainMood,
    loadingMessage,
    themeColor,
    reducedMotion,
  }) {
    return (
      <View
        pointerEvents={transitionLoading ? 'auto' : 'none'}
        style={[
          S.loadingOverlay,
          {
            opacity: transitionLoading ? 1 : 0,
            display: transitionLoading ? 'flex' : 'none',
          },
        ]}
      >
        {/* background glow */}
        {/* <View
          style={[
            S.loadingGlow,
            {
              backgroundColor: `${themeColor}18`,
            },
          ]}
        /> */}

        <View
          style={[
            S.loadingCard,
            {
              borderColor: `${themeColor}40`,
              shadowColor: themeColor,
            },
          ]}
        >
          <View
            style={[
              S.loadingCardGlow,
              {
                backgroundColor: `${themeColor}10`,
              },
            ]}
          />

          <View
            style={[
              S.loadingPill,
              {
                backgroundColor: `${themeColor}18`,
                borderColor: `${themeColor}40`,
              },
            ]}
          >
            <Shield
              size={13}
              color={themeColor}
            />

            <Text
              style={[
                S.loadingPillText,
                {
                  color: themeColor,
                },
              ]}
            >
              OVERSEER ACTIVE
            </Text>
          </View>

          <OverseerAvatar
            mood={villainMood || 'judging'}
            size={90}
            glowColor={
              villainMood === 'impressed' 
              ? C.greenGlow 
              : villainMood === 'disappointed'
              ? C.redGlow
              : `${themeColor}55`
            }
            themeColor={themeColor}
            reducedMotion={reducedMotion}
          />

          <Text
            style={S.loadingTitle}
          >
            {loadingMessage}
          </Text>

          <Text
            style={S.loadingSubtitle}
          >
            The Overseer is
            evaluating your
            discipline.
          </Text>

          <View
            style={S.loadingDotsWrap}
          >
            <ActivityIndicator
              size="small"
              color={themeColor}
            />

            <Text
              style={[
                S.loadingDotsText,
                {
                  color: themeColor,
                },
              ]}
            >
              PLEASE WAIT
            </Text>
          </View>
        </View>
      </View>
    )
  }
