import React from 'react';

import {
  ScrollView,
  View,
  Text,
  Pressable,
} from 'react-native';

import {
  Trophy,
  XCircle,
  Check,
  ArrowLeft,
  BarChart3,
  SlidersHorizontal,
} from 'lucide-react-native';

import { F } from '../constants/fonts';
import { C } from '../constants/colors';
import Pill from '../components/Pill';

import { S } from '../styles/allStyles';
import OverseerAvatar from '../components/OverseerAvatar';

export default function MissionDetailScreen({
  mission,
  goBack,
  level,
  themeColor,
}) {

  const success =
    mission.result === 'victory';

  return (
    <ScrollView
      contentContainerStyle={{
        paddingBottom: 140,
      }}
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

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginHorizontal: 24,
          marginBottom: 20,
          gap: 14,
        }}
      >
        <Pressable
          onPress={goBack}
          style={S.archiveBackButton}
        >
          <ArrowLeft
            size={20}
            color={themeColor}
          />
        </Pressable>

        <View
          style={[
            S.archiveSearch,
            {
              flex: 1,
              justifyContent: 'center',
            },
          ]}
        >
          <Text
            style={{
              color: C.white,
              fontWeight: '700',
              letterSpacing: 1,
            }}
          >
            MISSION DOSSIER
          </Text>
        </View>
      </View>

      <View style={S.detailHero}>
        <View
          style={[
            S.detailResultCircle,
            {
              borderColor:
                success
                  ? themeColor
                  : '#FF5A73',
            },
          ]}
        >
          {success ? (
            <Check
              size={32}
              color={themeColor}
            />
          ) : (
            <XCircle
              size={32}
              color="#FF5A73"
            />
          )}
        </View>

        <View
          style={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <Text
            style={[
              S.detailResult,
              {
                color:
                  success
                    ? themeColor
                    : '#FF5A73',
              },
            ]}
          >
            {mission.result.toUpperCase()}
          </Text>

          <Text style={S.detailTask}>
            {mission.task}
          </Text>

          <Text style={S.detailDate}>
            {new Date(
              mission.date
            ).toLocaleString()}
          </Text>
        </View>
      </View>

      <View style={S.detailCard}>
        <View style={S.detailHeader}>
          <BarChart3
            size={16}
            color={themeColor}
          />

          <Text style={S.detailHeaderText}>
            MISSION DATA
          </Text>
        </View>

        <View style={S.detailMetric}>
          <Text style={S.detailMetricLabel}>
            PLANNED DURATION
          </Text>

          <Text style={S.detailMetricValue}>
            {mission?.plannedDuration || 0}m
          </Text>
        </View>

        <View style={S.detailDivider} />

        <View style={S.detailMetric}>
          <Text style={S.detailMetricLabel}>
            ACTUAL DURATION
          </Text>

          <Text style={S.detailMetricValue}>
            {mission.actualDuration}m
          </Text>
        </View>

        <View style={S.detailDivider} />

        <View style={S.detailMetric}>
          <Text style={S.detailMetricLabel}>
            SLIPS
          </Text>

          <Text
            style={[
              S.detailMetricValue,
              {
                color:
                  mission.slips > 0
                    ? '#FFB4B4'
                    : themeColor,
              },
            ]}
          >
            {mission.slips}
          </Text>
        </View>

        <View style={S.detailDivider} />

        <View style={S.detailMetric}>
          <Text style={S.detailMetricLabel}>
            XP EARNED
          </Text>

          <Text
            style={[
              S.detailMetricValue,
              {
                color:
                  success
                    ? themeColor
                    : '#FF5A73',
              },
            ]}
          >
            +{mission.xp}
          </Text>
        </View>
      </View>

      <View
        style={[
          S.detailMessageCard,
          {
            borderColor: themeColor,
          },
        ]}
      >
        <View
          style={{
            flexDirection: 'row',
          }}
        >
          <OverseerAvatar
            mood={mission.mood}
            size={58}
            themeColor={themeColor}
          />

          <View
            style={{
              flex: 1,
              marginLeft: 18,
            }}
          >
            <Text style={S.assessmentLabel}>
              OVERSEER ASSESSMENT
            </Text>

            {mission.pendingAssessment && (
              <ActivityIndicator
                size="small"
                color={themeColor}
                style={{
                  marginBottom: 12,
                }}
              />
            )}

            <Text
              style={[
                S.detailMessage,
                mission.pendingAssessment && {
                  color: C.muted,
                  fontStyle: 'italic',
                },
              ]}  
            >
              {mission.message}
            </Text>
          </View>
        </View>
      </View>

      <View style={S.detailCard}>
        <View style={S.detailHeader}>
          <SlidersHorizontal
            size={16}
            color={themeColor}
          />

          <Text style={S.detailHeaderText}>
            MISSION CONDITIONS
          </Text>
        </View>

        <View style={S.conditionRow}>
          <View style={S.conditionCard}>
            <Text style={S.conditionLabel}>
              PERSONALITY
            </Text>

            <Text style={S.conditionValue}>
              {mission.personality}
            </Text>
          </View>

          <View style={S.conditionCard}>
            <Text style={S.conditionLabel}>
              CRUELTY
            </Text>

            <Text style={S.conditionValue}>
              {
                ['Kind','Spicy','Brutal'][
                  mission.cruelty - 1
                ]
              }
            </Text>
          </View>

          <View style={S.conditionCard}>
            <Text style={S.conditionLabel}>
              DETECTION
            </Text>

            <Text style={S.conditionValue}>
              {mission.detection}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}