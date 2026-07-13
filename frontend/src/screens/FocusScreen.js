import React from 'react';

import {
  ScrollView,
  View,
  Text,
  Pressable,
} from 'react-native';


import { C } from '../constants/colors';
import { F } from '../constants/fonts';
import { S } from '../styles/allStyles';

import OverseerAvatar from '../components/OverseerAvatar';
import DialogueBubble from '../components/DialogueBubble';
import { DoorOpen } from 'lucide-react-native';

import TimerRing from '../components/TimerRing';
import Pill from '../components/Pill';

export default function FocusScreen({
  taskName,
  duration,
  secondsLeft,
  slipsCount,
  villainMood,
  currentVillainText,
  loadingVoice,
  handleSurrender,
  actionLockRef,
  themeColor,
}) {
  const pct =
    duration > 0
      ? secondsLeft /
        (duration *
          60)
      : 0;

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        paddingBottom: 120,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* top nav */}
      <View
        style={
          S.topBarCompact
        }
      >
        <OverseerAvatar
          mood={
            slipsCount === 0
              ? 'suspicious'
              : villainMood
          }
          size={38}
          themeColor={themeColor}
        />

        <Text
          style={[
            F.villain,
            {
              color: themeColor,
              fontSize: 18,
            },
          ]}
        >
          FOCUSFOE
        </Text>

        <Pill
          label={`${slipsCount} SLIPS`}
          color={
            slipsCount >
            0
              ? C.red
              : themeColor
          }
        />
      </View>

      {/* task */}
      <View
        style={{
          paddingHorizontal: 24,
          marginTop: 12,
        }}
      >
        <Text
          style={{
            color: C.muted,
            fontSize: 12,
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          CURRENT MISSION
        </Text>

        <Text
          style={{
            color: C.white,
            fontSize: 28,
            fontWeight: '900',
            marginTop: 8,
          }}
        >
          {taskName}
        </Text>
      </View>

      {/* overseer section */}
      <View
        style={{
          marginTop: 18,
          alignItems: 'center',
          paddingHorizontal: 20,
        }}
      >
        <OverseerAvatar
          mood={
            villainMood
          }
          size={95}
          themeColor={themeColor}
        />

        {/* connector */}
        <View
          style={{
            width: 0,
            height: 0,
            borderLeftWidth: 14,
            borderRightWidth: 14,
            borderBottomWidth: 16,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: C.bgCard,
            marginTop: 10,
          }}
        />

        <DialogueBubble
          text={
            currentVillainText ||
            'The Overseer is watching your discipline...'
          }
          loading={loadingVoice}
          accent={
            slipsCount > 0
              ? '#FF6B7A'
              : themeColor
          }
          backgroundColor={
            slipsCount > 0
              ? 'rgba(255,90,110,0.06)'
              : 'rgba(123,97,255,0.08)'
          }
          borderColor={
            slipsCount > 0
              ? 'rgba(255,90,110,0.16)'
              : 'rgba(123,97,255,0.14)'
          }
        />
      </View>

      {/* timer */}
      <View
        style={{
          alignItems: 'center',
          marginTop: 34,
        }}
      >
        <TimerRing
          secondsLeft={
            secondsLeft
          }
          totalSeconds={
            duration *
            60
          }
          themeColor={themeColor}
          size={250}
        />
      </View>

      {/* surrender */}
      <View
        style={{
          marginTop: 28,
          marginBottom: 110,
          paddingHorizontal: 24,
        }}
      >
        <Pressable
          onPress={
            handleSurrender
          }
          disabled={
            actionLockRef.current
          }
          style={
            S.focusQuitBtn
          }
        >
          <DoorOpen
            size={18}
            color="#FF7C8C"
          />

          <Text
            style={{
              color: '#FF8797',
              fontWeight: '800',
              marginLeft: 10,
              letterSpacing: 0.8,
              fontSize: 15,
            }}
          >
            ABANDON MISSION
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};