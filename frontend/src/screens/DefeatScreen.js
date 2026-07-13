import React from 'react';
import {
  ScrollView,
  View,
  Text,
  Pressable,
} from 'react-native';
import { C } from '../constants/colors';
import { S } from '../styles/allStyles';

import { Flame, Skull, Swords, Timer, TriangleAlert } from 'lucide-react-native';
import OverseerAvatar from '../components/OverseerAvatar';
import DialogueBubble from '../components/DialogueBubble';

import { minutesElapsed } from '../utils/timeUtils';

export default function renderDefeatScreen({
  secondsLeft,
  slipsCount,
  durationRef,
  currentVillainText,
  loadingVoice,
  resetSetupState,
  setScreen,
  actionLockRef,
  themeColor,
}) {
  return (
    <ScrollView
      contentContainerStyle={{
        alignItems: 'center',
        paddingBottom: 130,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Top failure banner */}
      <View
        style={[
          S.bannerBase,
          S.defeatBanner,
        ]}
      >
        <Skull
          size={22}
          color="#7A1F2C"
        />

        <Text
          style={{
            color: '#7A1F2C',
            fontSize: 14,
            fontWeight: '900',
            letterSpacing: 4,
            marginTop: 8,
          }}
        >
          MISSION FAILED
        </Text>

        <Text
          style={{
            color: 'rgba(255,160,170,0.7)',
            fontSize: 11,
            marginTop: 5,
            letterSpacing: 1,
            textTransform: 'uppercase',
          }}
        >
          Discipline collapsed
        </Text>
      </View>


      {/* Overseer section */}
      <View
        style={{
          marginTop: 26,
          alignItems: 'center',
          width: '100%',
        }}
      >
        <OverseerAvatar
          mood="disappointed"
          size={130}
          glowColor={C.redGlow}
          themeColor={themeColor}
        />

        {/* speech connector */}
        <View
          style={{
            width: 0,
            height: 0,
            borderLeftWidth: 18,
            borderRightWidth: 18,
            borderBottomWidth: 22,
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: '#341B22',
            marginTop: 12,
            marginBottom: -2,
          }}
        />

        {/* overseer verdict */}
        <View
          style={[
            S.cardRed,
            {width: '90%'},
          ]}
        >
          <Text
            style={{
              color: '#FF7C8C',
              fontWeight: '800',
              letterSpacing: 1.5,
              marginBottom: 14,
            }}
          >
            OVERSEER VERDICT
          </Text>

          <DialogueBubble
            text={currentVillainText}
            loading={loadingVoice}
            compact
            accent="#FF6B7A"
            backgroundColor="rgba(255,90,110,0.08)"
            borderColor="rgba(255,90,110,0.16)"
          />
        </View>
      </View>


      {/* stats row */}
      <View
        style={{
          width: '90%',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 22,
        }}
      >
        {/* Focus done */}
        <View style={S.victoryStatTile}>
          <View
            style={[
              S.victoryStatIconWrap,
              {backgroundColor: 'rgba(255,107,122,0.12)'},
            ]}
          >
            <Timer
              size={16}
              color="#FF6B7A"
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={S.victoryStatTitle}>
              Survived
            </Text>

            <Text
              style={[S.victoryStatNumber, {color: '#FF6B7A'}]}
            >
              {minutesElapsed(durationRef.current, secondsLeft)}
              m
            </Text>
          </View>
        </View>

        {/* Slips */}
        <View style={S.victoryStatTile}>
          <View
            style={[
              S.victoryStatIconWrap,
              {backgroundColor: 'rgba(255,107,122,0.12)'},
            ]}
          >
            <TriangleAlert
              size={16}
              color="#FF6B7A"
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={S.victoryStatTitle}>
              Slips
            </Text>

            <Text
              style={[
                S.victoryStatNumber,
                {color: '#FF6B7A'},
              ]}
            >
              {slipsCount}
            </Text>
          </View>
        </View>

        {/* Streak lost */}
        <View
          style={S.victoryStatTile}
        >
          <View
            style={[
              S.victoryStatIconWrap,
              {backgroundColor: 'rgba(224,62,62,0.12)'},
            ]}
          >
            <Flame
              size={16}
              color={C.red}
            />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={S.victoryStatTitle}>
              Streak
            </Text>

            <Text
              style={[
                S.victoryStatNumber,
                { color: C.red },
              ]}
            >
              Reset
            </Text>
          </View>
        </View>
      </View>

      {/* Try again button */}
      <Pressable
        disabled={actionLockRef.current}
        onPress={() => {
          if (actionLockRef.current) return;

          actionLockRef.current = true;

          resetSetupState();
          setScreen('setup');

          setTimeout(() => {
            actionLockRef.current =
              false;
          }, 300);
        }}
        style={[
          S.primaryBtn,
          {
            width: '90%',
            marginTop: 26,
            backgroundColor: 'rgba(224,62,62,0.2)',
          },
        ]}
      >
        <Swords
          size={18}
          color="white"
        />

        <Text
          style={{
            color: '#fff',
            fontWeight: '800',
            fontSize: 17,
            letterSpacing: 1,
          }}
        >
          TRY AGAIN
        </Text>
      </Pressable>
    </ScrollView>
  )
}