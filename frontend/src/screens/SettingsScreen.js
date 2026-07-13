import React from 'react';

import {
  ScrollView,
  View,
  Text,
  Alert,
  Pressable,
} from 'react-native';

import {
  Brain,
  Eye,
  Database,
  Palette,
  Settings2,
  Cloud,
  ShieldAlert,
  Shield,
  RotateCcw,
} from 'lucide-react-native';

import { S } from '../styles/allStyles';
import { F } from '../constants/fonts';

import OverseerAvatar from '../components/OverseerAvatar';
// import SettingCard from '../components/SettingCard';
import SettingToggle from '../components/SettingToggle';
// import SettingButton from '../components/SettingButton';
import SettingSelector from '../components/SettingSelector';
import ConfirmModal from '../components/ConfirmModal';
import Pill from '../components/Pill';
import { C } from '../constants/colors';
import { PERSONALITIES } from '../constants/personalities';

export default function SettingsScreen({
  stats,
  settings,
  setSettings,
  level,
  hardResetFocusFoe,
  openMissionArchive,
  openMission,
  themeColor,
}) {
  const [showReset, setShowReset] = React.useState(false);

  const update = (
    key,
    value
  ) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const totalMissions =
    (stats?.completedSessions || 0) +
    (stats?.surrenderedSessions || 0);

  const winRate =
    totalMissions > 0
      ? Math.round(
          (
            stats.completedSessions /
            totalMissions
          ) * 100
        )
      : 0;

  const last =
    stats?.recentSessions?.[0];

  const togglePersonality =
    personality => {
      const current =
        settings.enabledPersonalities;
  
      if (
        current.includes(
          personality
        )
      ) {
        update(
          'enabledPersonalities',
          current.filter(
            p => p !== personality
          )
        );
      } else {
        update(
          'enabledPersonalities',
          [
            ...current,
            personality,
          ]
        );
      }
    };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 140,
      }}
    >
      {/* OVERSEER */}
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


      {/* Hero Section */}
      {/* <View style={S.settingsHero}>
        <OverseerAvatar
          mood="judging"
          size={95}
        />

        <Pill
          label="CORE ONLINE"
          color={themeColor}
        />

        <Text style={S.settingsHeroTitle}>
          OVERSEER
        </Text>

        <Text style={S.settingsHeroTitle}>
          CORE
        </Text>

        <Pill
          label={`OPERATIVE LVL ${level}`}
          color={themeColor}
        />
      </View> */}


      {/* Overseer Card */}
      <View style={[
          S.settingsCard,
          {
            shadowColor: themeColor,
          },
        ]}
      >
        <View style={S.settingsHeader}>
          <Brain
            size={16}
            color={themeColor}
          />

          <Text style={S.settingsHeaderText}>
            OVERSEER SETTINGS
          </Text>
        </View>

        <Text style={S.settingLabel}>
          AI PERSONALITY
        </Text>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
            marginTop: 12,
          }}
        >
          {PERSONALITIES.map(item => (
            <Pressable
              style={[
                S.personalityChip,
                {backgroundColor:
                  settings.enabledPersonalities.includes(
                    item.key
                  )
                    ? themeColor
                    : '#1B1D38',

                borderColor:
                  settings.enabledPersonalities.includes(
                    item.key
                  )
                    ? themeColor
                    : '#303650',
              }]}
              key={item.key}
              onPress={() =>
                togglePersonality(
                  item.key
                )
              }
            >
              <View>
                <Text style={S.personalityChipText}>
                  {item.title}
                </Text>

                <Text
                  style={{
                    color:
                      settings.enabledPersonalities.includes(item.key)
                        ? '#FFFFFFAA'
                        : C.muted,
                    fontSize: 11,
                    marginTop: 4,
                  }}
                >
                  {item.subtitle}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
        

  
        <Text style={S.settingLabel}>
          TAUNT FREQUENCY
        </Text>

        <SettingSelector
          options={[
            'Minimal',
            'Normal',
            'Aggressive',
          ]}
          value={settings.tauntFrequency}
          onChange={v =>
            update(
              'tauntFrequency',
              v
            )
          }
          themeColor={themeColor}
        />
      </View>


      {/* DETECTION */}
      <View style={[
          S.settingsCard,
          {
            shadowColor: themeColor,
          },
        ]}
      >
        <View style={S.settingsHeader}>
          <Eye
            size={16}
            color={themeColor}
          />

          <Text style={S.settingsHeaderText}>
            FOCUS DETECTION
          </Text>
        </View>

        <SettingSelector
          options={[
            'Lenient',
            'Balanced',
            'Strict',
          ]}
          value={
            settings.movementSensitivity
          }
          onChange={v =>
            update(
              'movementSensitivity',
              v
            )
          }
          themeColor={themeColor}
        />

        <SettingToggle
          label="Phone Lifted"
          value={settings.detectMovement}
          onChange={v =>
            update(
              'detectMovement',
              v
            )
          }
          themeColor={themeColor}
        />

        <SettingToggle
          label="Tab Switched"
          value={settings.detectAppSwitch}
          onChange={v =>
            update(
              'detectAppSwitch',
              v
            )
          }
          themeColor={themeColor}
        />

        <SettingToggle
          disabled
          label="Screen Unlock"
          value={settings.detectScreenUnlock}
          onChange={v =>
            update(
              'detectScreenUnlock',
              v
            )
          }
          themeColor={themeColor}
        />
      </View>


      {/* MISSION ARCHIVE */}
      <View style={[
          S.settingsCard,
          {
            shadowColor: themeColor,
          },
        ]}
      >
        <View style={S.settingsHeader}>
          <Database
            size={16}
            color={themeColor}
          />

          <Text style={S.settingsHeaderText}>
            MISSION ARCHIVE
          </Text>
        </View> 

        <Text style={S.archiveNumber}>
          {totalMissions}
        </Text>

        <Text style={S.archiveTitle}>
          RECORDS STORED
        </Text>

        <View style={S.lastMissionCard}>
          <Text style={S.lastMissionLabel}>
            LAST MISSION
          </Text>

          <Text style={S.lastMissionTask}>
            {last?.task || 'None'}
          </Text>

          <Text style={S.lastMissionMeta}>
            {last?.actualDuration || 0} Minutes
            {'  |  '}
            {last?.slips || 0} Slips
            {'  |  '}
            {last?.result || '-'}
          </Text>
        </View>

        <Pressable
          style={[
            S.archiveButton,
            {
              backgroundColor: `${themeColor}15`,
              borderColor: `${themeColor}40`,
            },
          ]}
          onPress={openMissionArchive}
        >
          <Text style={[S.archiveButtonText, {color: themeColor,}]}>
            [ VIEW ALL ]
          </Text>
        </Pressable>
      </View>


      {/* APPEARANCE */}
      <View style={[
          S.settingsCard,
          {
            shadowColor: themeColor,
          },
        ]}
      >
        <View style={S.settingsHeader}>
          <Palette
            size={16}
            color={themeColor}
          />

          <Text style={S.settingsHeaderText}>
            APPEARANCE
          </Text>
        </View>

        <Text style={S.settingLabel}>
          ACCENT COLOR
        </Text>

        <View style={S.colorRow}>
          {[
            '#7B61FF',
            '#FF5050',
            '#43B0FF',
            '#FFD93D',
          ].map(color => (
            <Pressable
              key={color}
              style={[
                S.colorCircle,
                {
                  backgroundColor: color,

                  borderWidth:
                    settings.accentColor === color
                      ? 4
                      : 1,

                  borderColor:
                    settings.accentColor === color
                      ? '#FFFFFF'
                      : 'rgba(255,255,255,0.15)',
                },
              ]}
              onPress={() =>
                update(
                  'accentColor',
                  color
                )
              }
            />
          ))}
        </View>
      </View>


      {/* System Card */}
      <View 
        style={[
          S.settingsCard,
          {
            shadowColor: themeColor,
          },
        ]}
      >
        <View style={S.settingsHeader}>
          <Settings2
            size={16}
            color={themeColor}
          />

          <Text style={S.settingsHeaderText}>
            SYSTEM
          </Text>
        </View>

        <SettingToggle
          label="Reduced Motion"
          value={
            settings.reducedMotion
          }
          onChange={v =>
            update(
              'reducedMotion',
              v
            )
          }
          themeColor={themeColor}
        />

        <SettingToggle
          label="Haptics"
          disabled
          value={
            settings.haptics
          }
          onChange={v =>
            update(
              'haptics',
              v
            )
          }
          themeColor={themeColor}
        />

        <SettingToggle
          label="Sound Effects"
          disabled
          value={
            settings.sounds
          }
          onChange={v =>
            update(
              'sounds',
              v
            )
          }
          themeColor={themeColor}
        />
      </View>


      {/* Sync and Reset */}
      <View
        style={{
          width: '90%',
          alignSelf: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 18,
        }}
      >
        <Pressable
          disabled
          style={[
            S.quickActionCard,
            {
              borderColor: `${themeColor}35`,
              shadowColor: themeColor,
            },
          ]}
        >
          <View
            style={[
              S.comingSoonBadge,
              {
                backgroundColor: themeColor,
              },
            ]}
          >
            <Text style={S.comingSoonText}>
              SOON
            </Text>
          </View>

          <Cloud
            size={28}
            color={themeColor}
          />

          <Text style={S.quickActionTitle}>
            Sync Data
          </Text>

          <Text style={S.quickActionSubtitle}>
            Cloud backup
          </Text>
        </Pressable>

        <Pressable
          style={S.quickActionCard}
          onPress={() =>
            setShowReset(true)
          }
        >
          <RotateCcw
            size={28}
            color="#FF7070"
          />

          <Text style={S.quickActionTitle}>
            Reset Core
          </Text>

          <Text style={S.quickActionSubtitle}>
            Erase progress
          </Text>
        </Pressable>
      </View>


      {/* Overseer File */}
      <View
        style={[
          S.overseerFile,
          {
            shadowColor: themeColor,
          },
        ]}
      >
        <Text style={[S.fileLabel, {color: themeColor,}]}>
          SECURITY CLEARANCE LEVEL {level}
        </Text>

        <Text style={S.fileTitle}>
          OVERSIGHT UNIT OMEGA
        </Text>

        <Text style={S.fileDescription}>
          "A high-intelligence focus
          supervisor designed to
          eliminate procrastination
          through psychological
          pressure and algorithmic
          surveillance."
        </Text>

        <View style={S.overseerStats}>
          <View>
            <Text style={S.fileMetric}>
              {totalMissions}
            </Text>

            <Text style={S.fileMetricLabel}>
              MISSIONS
            </Text>
          </View>

          <View>
            <Text style={S.fileMetric}>
              {(stats.totalFocusMinutes / 60)
                .toFixed(1)}
            </Text>

            <Text style={S.fileMetricLabel}>
              HOURS
            </Text>
          </View>

          <View>
            <Text style={S.fileMetric}>
              {winRate}%
            </Text>

            <Text style={S.fileMetricLabel}>
              SUCCESS
            </Text>
          </View>
        </View>
      </View>


      <ConfirmModal
        visible={showReset}
        title="RESET PROGRESS"
        message="The Overseer will erase all records."
        onCancel={() =>
          setShowReset(false)
        }
        onConfirm={() => {
          setShowReset(false);
          hardResetFocusFoe();
        }}
      />


      {/* DANGER ZONE */}
      {/* <SettingCard
        title="DANGER ZONE"
        icon={ShieldAlert}
      >
        <SettingButton
          title="RESET PROGRESS"
          danger
          onPress={() =>
            Alert.alert(
              'Reset Progress',
              'The Overseer will erase all records.',
              [
                {
                  text: 'Cancel',
                },
                {
                  text: 'Reset',
                  style:
                    'destructive',
                  onPress:
                    hardResetFocusFoe,
                },
              ]
            )
          }
        />
      </SettingCard> */}
    </ScrollView>
  );
}