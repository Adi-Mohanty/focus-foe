import React from 'react';

import {
  ScrollView,
  View,
  Text,
  Pressable,
} from 'react-native';

import { C } from '../constants/colors';
import { S } from '../styles/allStyles';

import { DoorOpen, Play, TriangleAlert } from 'lucide-react-native';

import OverseerAvatar from '../components/OverseerAvatar';
import DialogueBubble from '../components/DialogueBubble';
import Pill from '../components/Pill';
import { formatTime } from '../utils/timeUtils';

export default function WeaknessScreen({
  secondsLeft,
  slipsCount,
  currentVillainText,
  loadingVoice,
  resumeMission,
  handleSurrender,
  actionLockRef,
  themeColor,
}) {
  return (
    <ScrollView
      keyboardShouldPersistTaps="always"
      contentContainerStyle={{
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 120,
        paddingTop: 20,
      }}
    >
      <>
        {/* Red banner */}
        <View style={S.weaknessBanner}>
          <TriangleAlert
            size={22}
            color="#FFD1D7"
            strokeWidth={2.4}
          />

          <Text
            style={{
              color: '#FFD1D7',
              fontSize: 14,
              fontWeight: '900',
              letterSpacing: 5,
              marginTop: 10,
            }}
          >
            WEAKNESS DETECTED
          </Text>

          <Text
            style={{
              color:
                'rgba(255,255,255,0.65)',
              fontSize: 11,
              letterSpacing: 1.5,
              marginTop: 6,
              textTransform:
                'uppercase',
            }}
          >
            Discipline compromised
          </Text>
        </View>
        
        {/* Warning pill */}
        <View
          style={{
            width: '100%',
            alignItems: 'center',
            marginTop: 12,
          }}
        >
          <View
            style={{
              width: 130,
              alignSelf: 'flex-end',
              marginRight: 10,
              zIndex: 10,
            }}
          >
            <View
              style={
                S.warningPill
              }
            >
              <TriangleAlert
                size={10}
                color={
                  C.red
                }
              />

              <Text
                style={
                  S.warningText
                }
              >
                DEVICE MOVED
              </Text>
            </View>

            <View
              style={{
                position: 'absolute',
                left: 3,
                bottom: -1,
                width: 0,
                height: 0,
                borderLeftWidth: 10,
                borderRightWidth: 4,
                borderTopWidth: 10,
                borderLeftColor: '#FF506B',
                borderRightColor: 'transparent',
                borderTopColor: 'transparent',
                transform: [
                  {
                    rotate:
                      '-16deg',
                  },
                ],
              }}
            />
          </View>
        </View>

        {/* Overseer */}
        <OverseerAvatar
          mood="celebrating"
          size={120}
          glowColor={
            C.redGlow
          }
          themeColor={themeColor}
        />

        {/* Card */}
        <View
          style={{
            width: '100%',
            marginTop: 24,
            position: 'relative',
          }}
        >
          {/* speech connector */}
          <View
            style={{
              position: 'absolute',
              top: -19.5,
              left: '50%',
              marginLeft: -18,
              width: 0,
              height: 0,
              borderLeftWidth: 18,
              borderRightWidth: 18,
              borderBottomWidth: 20,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderBottomColor: C.red,
              zIndex: 4,
            }}
          />

          <View
            style={[
              S.cardRed,
            {
              width: '100%',
            },
          ]}
          >
            <Text
              style={{
                color: C.red,
                fontWeight: '800',
                marginBottom: 14,
                letterSpacing: 1.5,
              }}
            >
              OVERSEER WARNING
            </Text>

            <DialogueBubble
              text={currentVillainText}
              loading={loadingVoice}
              compact
              accent="#FF6B7A"
              backgroundColor="rgba(255,90,110,0.08)"
              borderColor="rgba(255,90,110,0.18)"
            />
          </View>
        </View>

        {/* Resume */}
        <Pressable
          disabled={actionLockRef.current}
          onPress={resumeMission}
          style={S.resumeBtn}
        >
          <Play
            color="white"
            size={18}
          />

          <Text
            style={{
              color: 'white',
              fontWeight: '700',
              fontSize: 16,
            }}
          >
            Resume Mission
          </Text>
        </Pressable>

        {/* Surrender */}
        <Pressable
          disabled={actionLockRef.current}
          onPress={handleSurrender}
          style={S.surrenderBtn}
        >
          <DoorOpen
            color="#FF8797"
            size={20}
            strokeWidth={2.2}
          />

          <View
            style={{
              marginLeft: 10,
            }}
          >
            <Text
              style={{
                color: '#FF8797',
                fontWeight: '800',
                letterSpacing: 1,
                fontSize: 15,
              }}
            >
              SURRENDER
            </Text>

            <Text
              style={{
                color: 'rgba(255,135,151,0.5)',
                fontSize: 11,
                marginTop: 2,
              }}
            >
              abandon your mission
            </Text>
          </View>
        </Pressable>

        {/* Meta */}
        <View
          style={{
            flexDirection: 'row',
            gap: 10,
            marginTop: 24,
            opacity: 0.65,
          }}
        >
          <Pill
            label={`${formatTime(
              secondsLeft
            )} LEFT`}
            color={C.muted}
          />

          <Pill
            label={`${slipsCount}× PENALTY`}
            color={C.red}
          />
        </View>
      </>
    </ScrollView>
  )
}