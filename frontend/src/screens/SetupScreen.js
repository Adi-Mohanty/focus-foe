import React from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
} from 'react-native';
import Slider from '@react-native-community/slider';
import {
  Zap,
} from 'lucide-react-native';

import { C } from '../constants/colors';
import { F } from '../constants/fonts';
import { S } from '../styles/allStyles';

import OverseerAvatar from '../components/OverseerAvatar';
import DialogueBubble from '../components/DialogueBubble';
import Pill from '../components/Pill';
import Label from '../components/Label';

import {
  PERSONALITIES,
} from '../constants/personalities';
import { PERSONALITY_LABELS } from '../constants/personalities';

export default function SetupScreen({
  taskName,
  setTaskName,
  duration,
  setDuration,
  durationChosen,
  setDurationChosen,
  customDuration,
  setCustomDuration,
  personality,
  setPersonality,
  settings,
  cruelty,
  setCruelty,
  startSession,
  currentVillainText,
  loadingVoice,
  level,
  themeColor,
}) {
  const available =
    settings.enabledPersonalities;

  const visibleCards =
    PERSONALITIES.filter(p =>
      available.includes(p.key)
    );

    return (
      <ScrollView
        contentContainerStyle={{ paddingBottom: 130 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={S.topBarCompact}>
          <OverseerAvatar
            mood="idle"
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
            label={`LV ${level}`}
            color={themeColor}
          />
        </View>

        {/* Overseer + speech bubble */}
        <View style={{ alignItems: 'center', marginTop: 8, marginBottom: 24 }}>
          <OverseerAvatar mood="judging" size={120} themeColor={themeColor} />
          {/* speech tail */}
          <View style={[S.speechTail, {borderBottomColor: `${themeColor}35`,}]} />
          <DialogueBubble
            text={
              currentVillainText ||
              'Another futile attempt at productivity? How adorable.'
            }
            loading={loadingVoice}
            accent={themeColor}
            backgroundColor={`${themeColor}15`}
            borderColor={`${themeColor}20`}
          />
        </View>

        {/* Mission objective */}
        <Label style={{ marginBottom: 8, marginLeft: 20 }}>Mission Objective</Label>
        <TextInput
          value={taskName}
          onChangeText={setTaskName}
          placeholder="What are you working on?"
          placeholderTextColor={C.mutedDim}
          style={S.input}
        />

        {/* Duration */}
        <Label
          style={{
            marginTop: 24,
            marginBottom: 8,
            marginLeft: 20,
          }}
        >
          Lockdown Duration
        </Label>

        <TextInput
          keyboardType="numeric"
          value={customDuration}
          onChangeText={(v) => {
            setCustomDuration(v);

            const parsed =
              Number(v);

            if (
              parsed > 0
            ) {
              setDuration(parsed);
              setDurationChosen(true);
            }
          }}
          placeholder="Custom duration in minutes"
          placeholderTextColor={
            C.mutedDim
          }
          style={[
            S.input,
            {
              marginBottom: 14,
            },
          ]}
        />

        <View
          style={{
            flexDirection:
              'row',
            gap: 12,
            marginHorizontal:
              20,
          }}
        >
          {[15, 30, 45, 90].map(
            d => {
              const active =
                duration === d;

              return (
                <Pressable
                  key={d}
                  onPress={() => {
                    setDuration(d);
                    setDurationChosen(true);
                    setCustomDuration('');
                  }}
                  style={[
                    S.durationCard,
                    active && {
                      backgroundColor: themeColor,
                      borderColor: themeColor,
                    },
                  ]}
                >
                  <Text
                    style={[
                      F.villain,
                      {
                        fontSize: 24,
                        color: active ? '#fff' : C.onSurface,
                      },
                    ]}
                  >
                    {d}
                  </Text>

                  <Text
                    style={{
                      color: active ? '#ddd' : C.muted,
                      fontSize: 12,
                    }}
                  >
                    MIN
                  </Text>
                </Pressable>
              );
            }
          )}
        </View>

        {/* Villain Disposition */}
        <Label style={{ marginTop: 24, marginBottom: 8, marginLeft: 20 }}>Villain Disposition</Label>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            marginHorizontal: 20,
            gap: 12,
          }}
        >
          {visibleCards.map(item => {
            const active = personality === item.key;

            return (
              <Pressable
                key={item.key}
                onPress={() =>
                  setPersonality(
                    item.key
                  )
                }
                style={[
                  S.personalityCard,
                  active && {
                    borderColor: themeColor,
                    backgroundColor: `${themeColor}22`,
                  }
                ]}
              >
                <Text
                  style={{
                    color:
                      active
                        ? themeColor
                        : C.onSurface,
                    fontWeight: '700',
                    fontSize: 16,
                  }}
                >
                  {
                    item.title
                  }
                </Text>

                <Text
                  style={{
                    color:
                      C.muted,
                    fontSize:
                      12,
                    marginTop:
                      4,
                  }}
                >
                  {
                    item.subtitle
                  }
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Cruelty */}
        <Label style={{ marginTop: 24, marginBottom: 8, marginLeft: 20 }}>Cruelty Level</Label>
        <Slider
          minimumValue={1}
          maximumValue={3}
          step={1}
          value={cruelty}
          onValueChange={setCruelty}
          minimumTrackTintColor={themeColor}
          maximumTrackTintColor={C.bgCardHigh}
          thumbTintColor={themeColor}
          style={{ marginHorizontal: 4 }}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2, marginHorizontal: 20 }}>
          <Text style={[F.label, { fontSize: 10, color: '#4ade80' }]}>KIND</Text>
          <Text style={[F.label, { fontSize: 10, color: C.gold }]}>SPICY</Text>
          <Text style={[F.label, { fontSize: 10, color: C.red }]}>BRUTAL</Text>
        </View>

        {/* CTA */}
        <Pressable
          onPress={startSession}
          disabled={!taskName.trim()}
          style={[S.primaryBtn, { backgroundColor: themeColor, shadowColor: themeColor }, !taskName.trim() && { opacity: 0.35 }]}
        >
          <Zap
            size={17}
            color={
              C.white
            }
          />
          <Text style={[F.villain, { color: '#fff', fontSize: 17, letterSpacing: 1 }]}>
            BEGIN SESSION
          </Text>
        </Pressable>

        <Label style={{ textAlign: 'center', marginTop: 12 }}>Resistance is futile</Label>
      </ScrollView>
    )
}