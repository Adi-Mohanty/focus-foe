import React from 'react';

import {
  ScrollView,
  View,
  Text,
} from 'react-native';

import {
  ShieldUser,
  Timer,
  Flame,
  Shield,
  Zap,
} from 'lucide-react-native';

import {
  Modal,
  Pressable,
} from 'react-native';

import { C } from '../constants/colors';
import { F } from '../constants/fonts';
import { S } from '../styles/allStyles';

import OverseerAvatar from '../components/OverseerAvatar';
import Pill from '../components/Pill';
import StatsTile from '../components/StatsTile';

import { ACHIEVEMENT_CONFIG } from '../constants/achievements';
import { XP_PER_LEVEL } from '../constants/appConstants';

export default function StatsScreen({
  stats,
  achievements,
  xp,
  level,
  progress,
  xpInLevel,
  themeColor,
}) {
    const [selectedAchievement,setSelectedAchievement] = React.useState(null);

    if (!stats) {
      return null;
    }

    const totalSessions = stats.completedSessions + stats.surrenderedSessions;
    const hoursFocused = (stats.totalFocusMinutes / 60).toFixed(1);

    const ModalIcon = selectedAchievement?.icon;

    const CHAOS_WEIGHT = 5;

    const winRate =
      totalSessions > 0
        ? Math.round(
            (stats.completedSessions /
              totalSessions) *
              100
          )
        : 0;

    const avgSession =
      stats.completedSessions > 0
        ? Math.round(
            stats.totalFocusMinutes /
              stats.completedSessions
          )
        : 0;

    const orderedDays = [
      'mon',
      'tue',
      'wed',
      'thu',
      'fri',
      'sat',
      'sun',
    ];
    
    const weeklyFocus =
      orderedDays.map(
        day => stats.weeklyFocus[day] || 0
      );
    
    const weeklySlips =
      orderedDays.map(
        day => stats.weeklySlips[day] || 0
      );

    const maxFocus =
      Math.max(
        ...weeklyFocus,
        1
      );

    const maxCombined =
      Math.max(
        ...weeklyFocus,
        ...weeklySlips.map(s => s * CHAOS_WEIGHT),
        1
      );

    const days = [ 'M', 'T', 'W', 'T', 'F', 'S', 'S'];

    return totalSessions === 0 ? (
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingBottom: 120,
          }}
        >
          <OverseerAvatar
            mood="judging"
            size={140}
            themeColor={themeColor}
          />
      
          <Text
            style={{
              color: C.white,
              fontSize: 26,
              fontWeight: '900',
              marginTop: 20,
            }}
          >
            No Data Yet
          </Text>
      
          <Text
            style={{
              color: C.muted,
              textAlign: 'center',
              lineHeight: 24,
              marginTop: 12,
              width: '80%',
            }}
          >
            Complete your first focus mission and the
            Overseer will begin judging your discipline.
          </Text>
        </ScrollView>
      ) : (
        <ScrollView
          contentContainerStyle={{paddingBottom: 140}}
          showsVerticalScrollIndicator={false}
        >
          {/* Top Nav */}
          <View
            style={S.topBarCompact}
          >
            <OverseerAvatar
              mood="judging"
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

          {/* HERO PROFILE CARD */}
          <View
            style={[S.statsHeroCard, {borderColor: `${themeColor}30`, shadowColor: themeColor,}]}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <View
                style={[
                  S.rankOrb,
                  {backgroundColor: themeColor,},
                ]}
              >
                <ShieldUser
                  size={28}
                  color="#fff"
                />
              </View>

              <View
                style={{
                  marginLeft: 16,
                }}
              >
                <Text
                  style={{
                    color: C.muted,
                    fontSize: 12,
                  }}
                >
                  YOUR RANK
                </Text>

                <Text
                  style={{
                    color: C.white,
                    fontSize: 28,
                    fontWeight: '900',
                  }}
                >
                  Level {level}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 24,
              }}
            >
              <View>
                <Text
                  style={S.heroMetricLabel}
                >
                  XP
                </Text>

                <Text
                  style={S.heroMetricValue}
                >
                  {xp}
                </Text>
              </View>

              <View>
                <Text
                  style={S.heroMetricLabel}
                >
                  WIN RATE
                </Text>

                <Text
                  style={S.heroMetricValue}
                >
                  {winRate}%
                </Text>
              </View>

              <View>
                <Text
                  style={S.heroMetricLabel}
                >
                  STREAK
                </Text>

                <Text
                  style={S.heroMetricValue}
                >
                  {stats.missionStreak}
                </Text>
              </View>
            </View>
          </View>

          {/* XP Progress */}
          <View
            style={S.statsCard}
          >
            <Text
              style={S.sectionTitle}
            >
              XP Progress
            </Text>

            <View
              style={{
                height: 12,
                borderRadius: 999,
                backgroundColor: `${themeColor}15`,
                overflow: 'hidden',
                marginTop: 18,
              }}
            >
              <View
                style={{
                  width: `${progress * 100}%`,
                  height: '100%',
                  backgroundColor: themeColor,
                }}
              />
            </View>

            <Text
              style={{
                color: C.muted,
                marginTop: 10,
              }}
            >
              {xpInLevel} / {XP_PER_LEVEL}{' '}XP
            </Text>
          </View>

          {/* Analytics */}
          <View
            style={S.statsSection}
          >
            <Text
              style={S.sectionTitle}
            >
              Session Analytics
            </Text>

            <View
              style={S.analyticsGrid}
            >
              <StatsTile
                icon={Timer}
                label="Sessions"
                value={stats.completedSessions + stats.surrenderedSessions}
                themeColor={themeColor}
              />

              <StatsTile
                icon={Flame}
                label="Hours"
                value={hoursFocused}
                themeColor={themeColor}
              />

              <StatsTile
                icon={Shield}
                label="Win Rate"
                value={`${winRate}%`}
                themeColor={themeColor}
              />

              <StatsTile
                icon={Zap}
                label="Avg Session"
                value={`${avgSession}m`}
                themeColor={themeColor}
              />
            </View>
          </View>

          {/* Focus Streak */}
          <View
            style={S.statsCard}
          >
            <Text
              style={S.sectionTitle}
            >
              Focus Streak
            </Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 18,
              }}
            >
              <View>
                <Text style={S.heroMetricLabel}>
                  MISSION
                </Text>

                <Text style={S.bigMetric}>
                  {stats.missionStreak}
                </Text>
              </View>

              <View>
                <Text style={S.heroMetricLabel}>
                  BEST MISSION
                </Text>

                <Text style={S.bigMetric}>
                  {stats.longestMissionStreak}
                </Text>
              </View>
            </View>
          </View>


          <View style={S.statsCard}>
            <Text style={S.sectionTitle}>
              Daily Discipline
            </Text>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginTop: 18,
              }}
            >
              <View>
                <Text style={S.heroMetricLabel}>
                  CURRENT
                </Text>

                <Text style={S.bigMetric}>
                  {stats.dailyStreak}
                </Text>
              </View>

              <View>
                <Text style={S.heroMetricLabel}>
                  BEST
                </Text>

                <Text style={S.bigMetric}>
                  {stats.longestDailyStreak}
                </Text>
              </View>
            </View>
          </View>


          {/* Weekly Focus */}
          <View
            style={S.statsCard}
          >
            <Text
              style={S.sectionTitle}
            >
              Weekly Conquest
            </Text>

            <View
              style={S.graphRow}
            >
              {weeklyFocus.map(
                (val, i) => (
                  <View
                    key={i}
                    style={S.graphCol}
                  >
                    <View
                      style={[
                        S.graphBar,
                        {
                          backgroundColor: themeColor,
                          shadowColor: themeColor,
                        },
                        {
                          height:
                            Math.max(
                              12,
                              (val / maxFocus) * 90
                            ),
                        },
                      ]}
                    />

                    <Text
                      style={S.graphDay}
                    >
                      {days[i]}
                    </Text>
                  </View>
                )
              )}
            </View>
          </View>

          {/* Slip vs Focus */}
          <View
            style={S.statsCard}
          >
            <Text
              style={S.sectionTitle}
            >
              Discipline vs Chaos
            </Text>

            <View
              style={S.graphRow}
            >
              {weeklyFocus.map(
                (val, i) => (
                  <View
                    key={i}
                    style={S.graphCol}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'flex-end',
                        gap: 3,
                      }}
                    >
                      <View
                        style={[
                          S.graphBarFocus,
                          {
                            backgroundColor: themeColor,
                          },
                          {
                            height:
                              Math.max(
                                8,
                                (val / maxCombined) * 70
                              ),
                          },
                        ]}
                      />

                      <View
                        style={[
                          S.graphBarSlip,
                          {
                            height:
                              Math.max(
                                6,
                                ((weeklySlips[i] * CHAOS_WEIGHT) / maxCombined) * 70,
                              ),
                          },
                        ]}
                      />
                    </View>

                    <Text
                      style={S.graphDay}
                    >
                      {days[i]}
                    </Text>
                  </View>
                )
              )}
            </View>
          </View>

          {/* Achievement Vault */}
          <View
            style={S.statsSection}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <Text
                style={S.sectionTitle}
              >
                Achievement Vault
              </Text>

              <Pill
                label={`${Object.values(achievements || {}).filter(Boolean).length}/${Object.keys(ACHIEVEMENT_CONFIG).length}`}
                color={themeColor}
              />
            </View>

            <View
              style={S.achievementGrid}
            >
              {Object.entries(ACHIEVEMENT_CONFIG).map(
                ([key,config]) => {
                  const unlocked = achievements?.[key] ?? false;
                  const Icon = config.icon;

                  return (
                    // <View
                    //   key={key}
                    //   style={[
                    //     S.achievementCard,
                    //     unlocked && S.achievementUnlocked,
                    //   ]}
                    // >
                    //   <View
                    //     style={[
                    //       S.achievementIconWrap,
                    //       unlocked && { backgroundColor: 'rgba(123,97,255,0.18)'},
                    //     ]}
                    //   >
                    //     <Icon
                    //       size={22}
                    //       color={unlocked ? themeColor : '#5B5F87'}
                    //     />
                    //   </View>

                    //   <View
                    //     style={{
                    //       marginTop: 10,
                    //       alignItems: 'center',
                    //       paddingHorizontal: 8,
                    //     }}
                    //   >
                    //     <Text
                    //       numberOfLines={2}
                    //       style={[
                    //         S.achievementTitle,
                    //         unlocked && {
                    //           color: C.white,
                    //         },
                    //       ]}
                    //     >
                    //       {config.title}
                    //     </Text>

                    //     <Text
                    //       numberOfLines={2}
                    //       style={S.achievementDesc}
                    //     >
                    //       {config.description}
                    //     </Text>
                    //   </View>

                    //   {/* defendable */}
                    //   {!config.permanent && (
                    //     <View
                    //       style={S.defendBadge}
                    //     >
                    //       <Shield
                    //         size={10}
                    //         color="#FFB84D"
                    //       />

                    //       <Text
                    //         style={{
                    //           color: '#FFB84D',
                    //           fontSize: 9,
                    //           fontWeight: '700',
                    //         }}
                    //       >
                    //         DEFEND
                    //       </Text>
                    //     </View>
                    //   )}

                    //   {!unlocked && (
                    //     <View
                    //       style={S.lockedOverlay}
                    //     />
                    //   )}
                    // </View>

                    <Pressable
                      key={key}
                      onPress={() =>
                        setSelectedAchievement({
                          ...config,
                          unlocked,
                        })
                      }
                      style={[{
                        width: '23%',
                        aspectRatio: 1,
                        marginBottom: 12,
                        borderRadius: 14,
                        borderWidth: 0.6,
                        borderColor: 'rgba(255,255,255,0.05)',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor:
                          unlocked
                            ? '#1C1F38'
                            : '#141625',
                      },
                      unlocked && {
                        borderColor: themeColor,
                        backgroundColor: `${themeColor}12`,
                      },
                      ]}
                    >
                      <Icon
                        size={22}
                        color={
                          unlocked
                            ? themeColor
                            : '#555'
                        }
                      />

                      <Text
                        numberOfLines={1}
                        style={{
                          color:
                            unlocked
                              ? C.white
                              : '#666',
                          fontSize: 10,
                          marginTop: 8,
                          textAlign: 'center',
                        }}
                      >
                        {config.title}
                      </Text>
                    </Pressable>
                  );
                }
              )}
            </View>
          </View>

          <Modal
            visible={!!selectedAchievement}
            transparent
            animationType="fade"
          >
            <Pressable
              style={{
                flex: 1,
                backgroundColor:
                  'rgba(0,0,0,0.7)',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 24,
              }}
              onPress={() =>
                setSelectedAchievement(null)
              }
            >
              {selectedAchievement && (
                <View
                  style={{
                    width:'88%',
                    borderRadius:32,
                    padding:28,
                    backgroundColor:'#171D2B',
                    borderWidth:1,
                    borderColor: themeColor,
                  }}
                >

                  <View
                    style={{
                      alignItems:'center',
                    }}
                  >
                    <View
                      style={{
                        width:80,
                        height:80,
                        borderRadius:999,
                        backgroundColor:
                          selectedAchievement.unlocked
                            ? `${themeColor}30`
                            : 'rgba(255,255,255,0.05)',

                        justifyContent:'center',
                        alignItems:'center',
                      }}
                    >
                      <ModalIcon
                        size={40}
                        color={
                          selectedAchievement.unlocked
                            ? themeColor
                            : '#555'
                        }
                      />
                    </View>

                    <Text
                      style={{
                        color:C.white,
                        fontSize:24,
                        fontWeight:'900',
                        marginTop:18,
                      }}
                    >
                      {selectedAchievement.title}
                    </Text>

                    <Text
                      style={{
                        color:C.muted,
                        textAlign:'center',
                        lineHeight:24,
                        marginTop:14,
                      }}
                    >
                      {selectedAchievement.description}
                    </Text>

                    <View
                      style={{
                        marginTop:22,
                        paddingHorizontal:18,
                        paddingVertical:10,
                        borderRadius:999,
                        backgroundColor:
                          selectedAchievement.unlocked
                            ? 'rgba(74,222,128,0.12)'
                            : 'rgba(255,90,115,0.12)',
                      }}
                    >
                      <Text
                        style={{
                          color:
                            selectedAchievement.unlocked
                              ? '#4ADE80'
                              : '#FF6B7A',
                          fontWeight:'700',
                        }}
                      >
                        {selectedAchievement.unlocked
                          ? 'UNLOCKED'
                          : 'LOCKED'}
                      </Text>
                    </View>

                    {!selectedAchievement.permanent && (
                      <View
                        style={{
                          marginTop:14,
                          flexDirection:'row',
                          alignItems:'center',
                          gap:8,
                        }}
                      >
                          <Shield
                            size={14}
                            color="#FFB84D"
                          />

                          <Text
                            style={{
                              color:"#FFB84D",
                              fontWeight:'700',
                            }}
                          >
                            DEFENDABLE ACHIEVEMENT
                          </Text>
                      </View>
                    )}
                  </View>
                </View>
              )}
            </Pressable>
          </Modal>
        </ScrollView>
      );
  };