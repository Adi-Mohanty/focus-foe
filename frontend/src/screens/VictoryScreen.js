import React from 'react';

import {
  ScrollView,
  View,
  Text,
  Pressable,
} from 'react-native';

import { C } from '../constants/colors';
import { S } from '../styles/allStyles';
import { Crown, Play, Timer, TriangleAlert, Zap } from 'lucide-react-native';

import OverseerAvatar from '../components/OverseerAvatar';
import DialogueBubble from '../components/DialogueBubble';
import XPBar from '../components/XPBar';

import { XP_PER_LEVEL } from '../constants/appConstants';

export default function VictoryScreen({
  duration,
  slipsCount,
  earnedXp,
  level,
  progress,
  xpInLevel,
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
      {/* Top success banner */}
      <View 
        style={[
          S.bannerBase,
          S.victoryBanner,
        ]}
      >
        <Crown
          size={22}
          color="#163A28"
        />
  
        <Text
          style={{
            color: '#163A28',
            fontSize: 14,
            fontWeight: '900',
            letterSpacing: 4,
            marginTop: 8,
          }}
        >
          MISSION COMPLETE
        </Text>
  
        <Text
          style={{
            color: 'rgba(22,58,40,0.7)',
            fontSize: 11,
            marginTop: 5,
            letterSpacing: 1,
            textTransform: 'uppercase',
          }}
        >
          Discipline prevailed
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
        {/* defeated villain */}
        <OverseerAvatar
          mood="impressed"
          size={130}
          glowColor="rgba(0,255,136,0.28)"
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
            borderBottomColor: '#1B2333',
            marginTop: 12,
            marginBottom: -2,
          }}
        />
  
        {/* overseer verdict */}
        <View
          style={[
            S.victoryCard,
            {
              width: '90%',
            },
          ]}
        >
          <Text
            style={{
              color: '#00FF88',
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
            accent="#00FF88"
            backgroundColor="rgba(0,255,136,0.06)"
            borderColor="rgba(0,255,136,0.14)"
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
        {/* Focus */}
        <View
          style={S.victoryStatTile}
        >
          <View
            style={
              S.victoryStatIconWrap
            }
          >
            <Timer
              size={16}
              color={themeColor}
            />
          </View>

          <View
            style={{
              flex: 1,
            }}
          >
            <Text
              style={
                S.victoryStatTitle
              }
              numberOfLines={1}
            >
              Focus
            </Text>

            <Text
              style={
                S.victoryStatNumber
              }
            >
              {duration}m
            </Text>
          </View>
        </View>

        {/* Slips */}
        <View
          style={S.victoryStatTile}
        >
          <View
            style={[
              S.victoryStatIconWrap,
              {
                backgroundColor: 'rgba(255,107,122,0.12)',
              },
            ]}
          >
            <TriangleAlert
              size={16}
              color="#FF6B7A"
            />
          </View>

          <View
            style={{
              flex: 1,
            }}
          >
            <Text
              style={
                S.victoryStatTitle
              }
            >
              Slips
            </Text>

            <Text
              style={[
                S.victoryStatNumber,
                {
                  color: '#FF6B7A',
                },
              ]}
            >
              {slipsCount}
            </Text>
          </View>
        </View>

        {/* XP */}
        <View
          style={[
            S.victoryStatTile,
            {
              borderColor: 'rgba(0,255,136,0.14)',
            },
          ]}
        >
          <View
            style={[
              S.victoryStatIconWrap,
              {
                backgroundColor: 'rgba(0,255,136,0.12)',
              },
            ]}
          >
            <Zap
              size={16}
              color="#00FF88"
            />
          </View>

          <View
            style={{
              flex: 1,
            }}
          >
            <Text
              style={
                S.victoryStatTitle
              }
            >
              XP
            </Text>

            <Text
              style={[
                S.victoryStatNumber,
                {
                  color: '#00FF88',
                },
              ]}
            >
              +{earnedXp}
            </Text>
          </View>
        </View>
      </View>
  
      {/* level progress */}
      <View
        style={[
          S.card,
          {
            width: '90%',
            marginTop: 18,
            padding: 20,
          },
        ]}
      >
        <Text
          style={{
            color: C.white,
            fontWeight: '700',
            fontSize: 16,
            marginBottom: 14,
          }}
        >
          Progress
        </Text>
  
        <XPBar
          progress={progress}
          level={level}
          themeColor={themeColor}
        />
  
        <Text
          style={{
            color: C.muted,
            marginTop: 10,
            fontSize: 12,
          }}
        >
          {xpInLevel}/
          {XP_PER_LEVEL} XP
          to next level
        </Text>
      </View>
  
      {/* new session button */}
      <Pressable
        disabled={
          actionLockRef.current
        }
        onPress={() => {
          if (actionLockRef.current) return;
  
          actionLockRef.current = true;

          resetSetupState();
          setScreen('setup');
          setTimeout(() => {
            actionLockRef.current = false;
          }, 300);
        }}
        style={[
          S.primaryBtn,
          {
            backgroundColor: themeColor,
            width: '90%',
            marginTop: 24,
          },
        ]}
      >
        <Play
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
          NEW SESSION
        </Text>
      </Pressable>
    </ScrollView>
  )
}