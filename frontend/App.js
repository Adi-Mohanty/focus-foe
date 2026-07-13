import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
  StyleSheet,
  AppState,
  Dimensions,
  Image,
  Animated,
  Platform,
  ActivityIndicator,
} from 'react-native';

import {
  Skull,
  Timer,
  BarChart3,
  Settings,
  Shield,
  Moon,
  Flame,
  Crown,
  Gem,
  Star,
  TriangleAlert,
  Play,
  Swords,
  Zap,
  DoorOpen,
  ShieldUser,
} from 'lucide-react-native';

import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { C } from './src/constants/colors';
import { S } from './src/styles/allStyles';

import { getLevelProgress } from './src/utils/levelUtils';
import {
  formatTime,
  minutesElapsed,
  getDayKey,
} from './src/utils/timeUtils';
import { checkAchievements } from './src/services/achievementService';
import {
  fetchVillainVoiceApi,
} from './src/services/villainApi';

import { useXP } from './src/hooks/useXP';
import { useTimer } from './src/hooks/useTimer';
import { useStats } from './src/hooks/useStats';
import { useAccelerometer } from './src/hooks/useAccelerometer';

import useSettings from './src/hooks/useSettings';

import {
  XP_STORAGE_KEY,
  STATS_STORAGE_KEY,
  ACHIEVEMENTS_STORAGE_KEY,
  XP_PER_LEVEL,
  SLIP_COOLDOWN_MS,
} from './src/constants/appConstants';

import {
  PERSONALITIES,
  PERSONALITY_LABELS,
} from './src/constants/personalities';

import {updateDailyStreak} from './src/services/statsService';

import SetupScreen from './src/screens/SetupScreen';
import FocusScreen from './src/screens/FocusScreen';
import WeaknessScreen from './src/screens/WeaknessScreen';
import VictoryScreen from './src/screens/VictoryScreen';
import DefeatScreen from './src/screens/DefeatScreen';
import StatsScreen from './src/screens/StatsScreen';

import LoadingOverlay from './src/components/LoadingOverlay';
import SettingsScreen from './src/screens/SettingsScreen';

import MissionArchiveScreen from './src/screens/MissionArchiveScreen';
import MissionDetailScreen from './src/screens/MissionDetailScreen';

import { SETTINGS_KEY } from './src/services/settingsStorage';
import { getThreshold } from './src/utils/sensitivityThresholdUtils';

// ─── Sub-components ───────────────────────────────────────────────────────────
const DEFAULT_STATS = {
  version: 1,

  lastActiveDate: null,
  weeklyResetKey: null,

  completedSessions: 0,
  surrenderedSessions: 0,

  totalFocusMinutes: 0,
  totalSlips: 0,

  missionStreak: 0,
  longestMissionStreak: 0,

  dailyStreak: 0,
  longestDailyStreak: 0,

  zeroSlipSessions: 0,
  bestSessionMinutes: 0,

  lifetimeXp: 0,

  weeklyFocus: {
    mon: 0,
    tue: 0,
    wed: 0,
    thu: 0,
    fri: 0,
    sat: 0,
    sun: 0,
  },

  weeklySlips: {
    mon: 0,
    tue: 0,
    wed: 0,
    thu: 0,
    fri: 0,
    sat: 0,
    sun: 0,
  },

  recentSessions: [],
};



// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  // ── State (unchanged from original) ──
  const [screen, setScreen]                     = useState('setup');
  const [bottomTab, setBottomTab]               = useState('timer');
  const [taskName, setTaskName]                 = useState('');
  const [duration, setDuration]                 = useState(15);
  const [durationChosen, setDurationChosen]     = useState(false);
  const [secondsLeft, setSecondsLeft]           = useState(0);
  const [personality, setPersonality]           = useState('sarcastic');
  const [cruelty, setCruelty]                   = useState(2);
  const [slipsCount, setSlipsCount]             = useState(0);
  const [currentVillainText, setCurrentVillainText] = useState('');
  const [villainMood, setVillainMood]           = useState('judging');
  const [sessionActive, setSessionActive]       = useState(false);
  const [sessionPaused, setSessionPaused]       = useState(false);
  const [xp, setXp]                             = useState(0);
  const [loadingVoice, setLoadingVoice]         = useState(false);
  const [earnedXp, setEarnedXp]                 = useState(0);
  const [customDuration, setCustomDuration]     = useState('');
  const [transitionLoading, setTransitionLoading] = useState(false);
  const [loadingMessage, setLoadingMessage]     = useState('');
  const [stats, setStats]                       = useState(DEFAULT_STATS);
  const [achievements, setAchievements]         = useState({});
  const [statsLoaded, setStatsLoaded]           = useState(false); //Hydration flag
  const [selectedMission,setSelectedMission]    = useState(null);

  // Hooks
  const {
    settings,
    setSettings,
  } = useSettings();

  useXP({
    xp,
    setXp,
  });

  useStats({
    setStats,
    DEFAULT_STATS,
    onLoaded: () =>
      setStatsLoaded(true),
  });

  const primary = settings.accentColor || C.primary;

  // ── Refs (unchanged) ──
  const sessionRef         = useRef(false);
  const slipsRef           = useRef(0);
  const durationRef        = useRef(15);
  const secondsLeftRef     = useRef(0);
  const taskRef            = useRef('');
  const lastAccelRef       = useRef(null);
  const appStateRef        = useRef(AppState.currentState);
  const lastSlipAtRef      = useRef(0);
  const requestIdRef       = useRef(0);
  const sessionEndTimeRef  = useRef(null);
  const victoryHandledRef  = useRef(false);
  const lastActiveScreenRef = useRef('setup');
  const actionLockRef      = useRef(false);
  const lastCheckinRef     = useRef(0);
  const latestVoiceRef     = useRef('');
  const pendingMissionIdRef = useRef(null);

  const fallbackMessage = {
    victory:
      'The Overseer silently records your success.',
    surrender:
      'The Overseer marks this mission as failed.',
  };

  const { level, progress, xpInLevel } = getLevelProgress(xp);

  useEffect(() => {
    // const navigationScreens = [
    //   'stats',
    //   'settings',
    //   'archive',
    //   'mission',
    // ];
  
    // if (
    //   !navigationScreens.includes(
    //     screen
    //   )
    // ) {
    //   lastActiveScreenRef.current =
    //     screen;
    // }

    if (
      screen === 'setup' ||
      screen === 'focus'
    ) {
      lastActiveScreenRef.current =
        screen;
    }
  }, [screen]);

  useEffect(() => {
    if (!statsLoaded) {
      return;
    }
  
    AsyncStorage.setItem(
      STATS_STORAGE_KEY,
      JSON.stringify(stats)
    );
  }, [stats, statsLoaded]);
  
  // useEffect(() => {
  //   AsyncStorage.setItem(
  //     ACHIEVEMENTS_STORAGE_KEY,
  //     JSON.stringify(
  //       achievements
  //     )
  //   );
  // }, [achievements]);

  useEffect(() => {
    setAchievements(
      checkAchievements(stats)
    );
  }, [stats]);

  // useEffect(() => {
  //   console.log(
  //     'Stats changed:',
  //     stats
  //   );
  // }, [stats]);

  // ── API call ──
  const fetchVillainVoice =
  useCallback(
    async (
      phase,
      slipsOverride
    ) => {
      const requestId =
        ++requestIdRef.current;

      setLoadingVoice(
        true
      );

      setCurrentVillainText(
        ''
      );

      const selectedPersonality =
        personality ||
        settings.enabledPersonalities?.[0] ||
        'sarcastic';

      try {
        const data =
          await fetchVillainVoiceApi({
            phase,

            personality : selectedPersonality,

            task:
              taskRef.current,

            duration:
              durationRef.current,

            slips:
              slipsOverride ??
              slipsRef.current,

            minutesIn:
              minutesElapsed(
                durationRef.current,
                secondsLeftRef.current
              ),

            cruelty,
          });

        if (
          requestId !==
          requestIdRef.current
        ) {
          return;
        }

        setCurrentVillainText(
          data.text || ''
        );

        latestVoiceRef.current = data.text;

        if (
          pendingMissionIdRef.current
        ) {
          updateMissionAssessment(
            pendingMissionIdRef.current,
            data.text
          );
        
          pendingMissionIdRef.current =
            null;
        }

        if (
          phase ===
          'checkin'
        ) {
          const progress =
            minutesElapsed(
              durationRef.current,
              secondsLeftRef.current
            );

          const ratio =
            progress /
            Math.max(
              1,
              durationRef.current
            );

          if (
            slipsRef.current ===
              0 &&
            ratio > 0.45
          ) {
            setVillainMood(
              'threatened'
            );
          } else if (
            slipsRef.current >=
            2
          ) {
            setVillainMood(
              'mocking'
            );
          } else {
            setVillainMood(
              'suspicious'
            );
          }
        }
      } catch (
        err
      ) {
        console.log(
          err
        );

        setCurrentVillainText(
          'Even I got tired waiting for your attention span 😒'
        );

        if (pendingMissionIdRef.current) {
          updateMissionAssessment(
            pendingMissionIdRef.current,
            fallbackMessage[
              phase === 'victory'
                ? 'victory'
                : 'surrender'
            ]
          );
        
          pendingMissionIdRef.current = null;
        }
      } finally {
        setLoadingVoice(
          false
        );
      }
    },
    [
      cruelty,
      personality,
    ]
  );

  const hardResetFocusFoe =
  async () => {
    try {
      await AsyncStorage.multiRemove([
        XP_STORAGE_KEY,
        STATS_STORAGE_KEY,
        SETTINGS_KEY,
      ]);

      console.log(
        'FocusFoe reset complete'
      );

      // reset runtime state
      setXp(0);

      setStats(
        DEFAULT_STATS
      );

      setAchievements(
        {}
      );

      setEarnedXp(0);

      setTaskName('');

      setDuration(
        15
      );

      setSlipsCount(
        0
      );

      setCurrentVillainText(
        ''
      );

      setScreen('setup');
    } catch (
      err
    ) {
      console.log(
        'Reset failed:',
        err
      );
    }
  };

  // ── Session logic (unchanged) ──
  const startSession = useCallback(async () => {
    if (!taskName.trim()) return;
    setSessionActive(true);
    setVillainMood('mocking');
    setSessionPaused(false);
    setScreen('focus');
    setSlipsCount(0);
    slipsRef.current = 0;
    taskRef.current = taskName;
    durationRef.current = duration;
    victoryHandledRef.current = false;
    const totalSeconds = duration * 60;
    setSecondsLeft(totalSeconds);
    secondsLeftRef.current = totalSeconds;
    sessionEndTimeRef.current = Date.now() + totalSeconds * 1000;
    sessionRef.current = true;
    lastCheckinRef.current = 0;
    await fetchVillainVoice('start', 0);
  }, [duration, taskName, fetchVillainVoice]);

  const registerSlip = useCallback(async () => {
    if (!sessionRef.current || sessionPaused) return;
    const now = Date.now();
    if (now - lastSlipAtRef.current < SLIP_COOLDOWN_MS) return;
    lastSlipAtRef.current = now;
    const nextSlips = slipsRef.current + 1;
    slipsRef.current = nextSlips;
    setSlipsCount(nextSlips);

    // track slips live
    const day = getDayKey();
    setStats(prev => ({
      ...prev,
      totalSlips: prev.totalSlips + 1,
      weeklySlips: {...prev.weeklySlips,
        [day]:
          (prev.weeklySlips[day] || 0) + 1,
      },
    }));

    setSessionPaused(true);
    setScreen('weakness');
    await fetchVillainVoice('slip', nextSlips);
  }, [fetchVillainVoice, sessionPaused]);

  useAccelerometer({
    sessionActive,
    sessionPaused,
    sessionRef,
    lastAccelRef,
    registerSlip,
    movementThreshold:
      getThreshold(
        settings.movementSensitivity
      ),
    enabled:
      settings.detectMovement,
  });

  const resumeMission = useCallback(async () => {
    // console.log("Resume button was pressed.");
    setSessionPaused(false);
    setScreen('focus');
    sessionEndTimeRef.current = Date.now() + secondsLeftRef.current * 1000;
    setVillainMood('annoyed');
    await fetchVillainVoice('checkin');
  }, [fetchVillainVoice]);

  const awardVictoryXp = useCallback(
    (slips, duration) => {
      let gained = Math.max(10, duration * 2);

      // slip penalty
      gained -= slips * 5;
      gained =Math.max(10, gained);
      setXp(prev => prev + gained);
      setEarnedXp(gained);

      return gained;
    },
    []
  );

  
  const resetSetupState = useCallback(() => {
    setTaskName('');
    taskRef.current = '';

    setDuration(15);
    durationRef.current = 15;
    setDurationChosen(false);
    setCustomDuration('');

    setSlipsCount(0);
    slipsRef.current = 0;

    setSecondsLeft(0);
    secondsLeftRef.current = 0;

    setCurrentVillainText('');
    setVillainMood('judging');
    setPersonality('sarcastic');
    setCruelty(2);

    victoryHandledRef.current = false;
  }, []);

  const saveMission = useCallback(mission => {
    setStats(prev => ({
      ...prev,
  
      recentSessions: [
        mission,
        ...prev.recentSessions,
      ].slice(0, 500),
    }));
  }, []);

  const updateMissionAssessment =
  useCallback(
    (
      missionId,
      message
    ) => {
      setStats(prev => ({
        ...prev,

        recentSessions:
          prev.recentSessions.map(
            m =>
              m.id === missionId
                ? {
                    ...m,

                    message,

                    pendingAssessment:
                      false,
                  }
                : m
          ),
      }));
    },
    []
  );

  const createMission = ({
    result,
    xp,
    actualDuration,
  }) => ({
    id: Date.now(),
  
    date: Date.now(),
  
    completedAt:
      Date.now(),
  
    task:
      taskRef.current,
  
    plannedDuration:
      durationRef.current,
  
    actualDuration,
  
    slips:
      slipsRef.current,
  
    xp,
  
    result,
  
    missionEfficiency:
      Math.max(
        0,
        Math.round(
          (
            (actualDuration -
              slipsRef.current * 2) /
            durationRef.current
          ) * 100
        )
      ),
  
    personality,
  
    cruelty,
  
    mood:
      villainMood,
  
    detection:
      settings.movementSensitivity,
  
    tauntFrequency:
      settings.tauntFrequency,
  
    accentColor:
      settings.accentColor,
  
    pendingAssessment:
      false,
  
    message:
      latestVoiceRef.current ||
      '',
  });

  const handleVictory = useCallback(
    async (
      forced = false
    ) => {
      if (
        victoryHandledRef.current ||
        actionLockRef.current
      ) {
        return;
      }

      actionLockRef.current = true;
      victoryHandledRef.current = true;

      setTransitionLoading(true);
      setLoadingMessage('OVERSEER EVALUATING PERFORMANCE');
      setVillainMood('impressed');

      try {
        const aiPromise =
          fetchVillainVoice(
            'victory',
            slipsRef.current
          );

        const aiFinished =
          await Promise.race([
            aiPromise.then(
              () => true
            ),

            new Promise(resolve =>
              setTimeout(
                () =>
                  resolve(false),
                5000
              )
            ),
          ]);

        const gained =
          awardVictoryXp(
            slipsRef.current,
            durationRef.current
          );

        const mission =
          createMission({
        
            result:
              'victory',
        
            xp:
              gained,
        
            actualDuration:
              durationRef.current,
          });

        if (aiFinished) {
          mission.message =
            latestVoiceRef.current;
        } else {
          mission.pendingAssessment = true;
        
          mission.message = 'The Overseer is preparing its report...';
        
          pendingMissionIdRef.current = mission.id;
        }

        const day = getDayKey();

        setStats(prev => {
          const streakStats = updateDailyStreak(prev,true );

          const updatedStats = {
            ...streakStats,

            completedSessions:
              prev.completedSessions + 1,

            missionStreak:
              prev.missionStreak + 1,
          
            longestMissionStreak:
              Math.max(
                prev.longestMissionStreak,
                prev.missionStreak + 1
              ),

            totalFocusMinutes:
              prev.totalFocusMinutes +
              durationRef.current,

            zeroSlipSessions:
              slipsRef.current ===
              0
                ? prev.zeroSlipSessions +
                  1
                : prev.zeroSlipSessions,

            bestSessionMinutes:
              Math.max(
                prev.bestSessionMinutes,
                durationRef.current
              ),

            lifetimeXp:
            prev.lifetimeXp +
              gained,

            weeklyFocus:
              {
                ...prev.weeklyFocus,
                [day]:
                  (prev.weeklyFocus[day] || 0) + durationRef.current,
              },

            recentSessions: [
              mission,
              ...prev.recentSessions,
            ].slice(0,500)
          };

          return updatedStats;
        });

        sessionRef.current =
          false;

        setSessionActive(
          false
        );

        setSessionPaused(
          false
        );

        setScreen(
          'victory'
        );
      } finally {
        setTransitionLoading(
          false
        );

        actionLockRef.current =
          false;
      }
    },
    [
      awardVictoryXp,
      fetchVillainVoice,
    ]
  );

  const handleSurrender = useCallback(
    async () => {
      if (
        actionLockRef.current
      ) {
        return;
      }

      actionLockRef.current = true;

      setTransitionLoading(true);
      setLoadingMessage('THE OVERSEER IS RECORDING YOUR FAILURE');
      setVillainMood('disappointed');

      try {
        const aiPromise =
          fetchVillainVoice(
            'surrender'
          );

        const aiFinished =
          await Promise.race([
            aiPromise.then(
              () => true
            ),

            new Promise(resolve =>
              setTimeout(
                () =>
                  resolve(false),
                5000
              )
            ),
          ]);

        const mission =
          createMission({
        
            result:
              'failure',
        
            xp:0,
        
            actualDuration:
              minutesElapsed(
                durationRef.current,
                secondsLeftRef.current
              ),
          });

        if (aiFinished) {
          mission.message =
            latestVoiceRef.current;
        } else {
          mission.pendingAssessment = true;
        
          mission.message = 'The Overseer is preparing its report...';
        
          pendingMissionIdRef.current = mission.id;
        }

        setStats(prev => {
          const updatedStats = {
            ...prev,

            surrenderedSessions:
              prev.surrenderedSessions +
              1,

            missionStreak: 0,

            recentSessions: [
              mission,
              ...prev.recentSessions,
            ].slice(0,500)
          };

          return updatedStats;
        })

        sessionRef.current = false;

        setSessionActive(false);
        setSessionPaused(false);
        setScreen('defeat');
      } finally {
        setTransitionLoading(
          false
        );

        actionLockRef.current =
          false;
      }
    },
    [
      fetchVillainVoice,
    ]
  );

  useTimer({
    sessionActive,
    sessionPaused,
    sessionEndTimeRef,
    secondsLeftRef,
    durationRef,
    settings,
    lastCheckinRef,
    fetchVillainVoice,
    setSecondsLeft,
    victoryHandledRef,
    handleVictory,
  });


  // ── AppState ──
  useEffect(() => {
    const sub =
      AppState.addEventListener(
        'change',
        async (
          nextState
        ) => {
          const prev =
            appStateRef.current;
  
          appStateRef.current =
            nextState;
  
          if (
            !sessionRef.current ||
            sessionPaused
          ) {
            return;
          }
  
          // Only count actual app switching
          if (
            settings.detectAppSwitch &&
            prev === 'active' &&
            nextState === 'background'
          )
          {
            registerSlip();
          }
        }
      );
  
    return () =>
      sub.remove();
  }, [
    registerSlip,
    sessionPaused,
  ]);

  // ─── SCREENS ───────────────────────────────────────────────────────────────


  // ── Bottom nav ──
  const activeTab =
    ['setup', 'focus'].includes(screen)
      ? 'timer'
      : screen === 'stats'
      ? 'stats'
      : ['settings', 'archive', 'mission'].includes(screen)
      ? 'settings'
      : null;
  
  const renderBottomNav = () => {
    if (
      ['weakness',
       'victory',
       'defeat'].includes(screen)
    ) {
      return null;
    }

    const tabs = [
      {
        id: 'timer',
        label: 'TIMER',
        icon: Timer,
        onPress:
          () => {
            setScreen(
              lastActiveScreenRef.current ||
              'setup'
            );
          },
      },

      {
        id: 'stats',
        label: 'STATS',
        icon: BarChart3,
        onPress:
          () => {
            setScreen('stats');
          },
      },

      {
        id: 'settings',
        label: 'SETTINGS',
        icon: Settings,
        onPress:
          () => {
            setScreen('settings');
          },
      },
    ];

    return (
      <View
        style={S.bottomNav}
      >
        {tabs.map(
          tab => {
            const active = activeTab === tab.id;
            const Icon = tab.icon;

            return (
              <Pressable
                key={tab.id}
                onPress={tab.onPress}
                style={S.bottomNavItem}
              >
                <View
                  style={[
                    S.bottomIconWrap,
                    active && {
                      backgroundColor: `${primary}20`,
                      borderRadius: 7 ,
                    },
                  ]}
                >
                  <Icon
                    size={18}
                    color={active ? primary : C.mutedDim}
                  />
                </View>

                <Text
                  style={[
                    S.bottomNavLabel,
                    active && {color: primary},
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          }
        )}
      </View>
    );
  };


  // ── Render ──
  return (
    <View style={S.root}>
      <StatusBar style="light" />
      {screen === 'setup' && (
        <SetupScreen
          taskName={taskName}
          setTaskName={setTaskName}
          duration={duration}
          setDuration={setDuration}
          durationChosen={durationChosen}
          setDurationChosen={setDurationChosen}
          customDuration={customDuration}
          setCustomDuration={setCustomDuration}
          personality={personality}
          setPersonality={setPersonality}
          settings={settings}
          cruelty={cruelty}
          setCruelty={setCruelty}
          startSession={startSession}
          currentVillainText={currentVillainText}
          loadingVoice={loadingVoice}
          level={level}
          themeColor={primary}
        />
      )}

      {screen === 'focus' && (
        <FocusScreen
          taskName={taskName}
          duration={duration}
          secondsLeft={secondsLeft}
          slipsCount={slipsCount}
          villainMood={villainMood}
          currentVillainText={currentVillainText}
          loadingVoice={loadingVoice}
          handleSurrender={handleSurrender}
          actionLockRef={actionLockRef}
          themeColor={primary}
        />
      )}

      {screen === 'weakness' && (
        <WeaknessScreen
          secondsLeft={secondsLeft}
          slipsCount={slipsCount}
          currentVillainText={currentVillainText}
          loadingVoice={loadingVoice}
          resumeMission={resumeMission}
          handleSurrender={handleSurrender}
          actionLockRef={actionLockRef}
          themeColor={primary}
        />
      )}

      {screen === 'victory' && (
        <VictoryScreen
          duration={duration}
          slipsCount={slipsCount}
          earnedXp={earnedXp}
          level={level}
          progress={progress}
          xpInLevel={xpInLevel}
          currentVillainText={currentVillainText}
          loadingVoice={loadingVoice}
          resetSetupState={resetSetupState}
          setScreen={setScreen}
          actionLockRef={actionLockRef}
          themeColor={primary}
        />
      )}

      {screen === 'defeat' && (
        <DefeatScreen
          secondsLeft={secondsLeft}
          slipsCount={slipsCount}
          durationRef={durationRef}
          currentVillainText={currentVillainText}
          loadingVoice={loadingVoice}
          resetSetupState={resetSetupState}
          setScreen={setScreen}
          actionLockRef={actionLockRef}
          themeColor={primary}
        />
      )}

      {screen === 'stats'    && 
        <StatsScreen
          stats={stats}
          achievements={achievements}
          xp={xp}
          level={level}
          progress={progress}
          xpInLevel={xpInLevel}
          themeColor={primary}
        />
      }

      {
        screen === 'settings' &&
        (
          <SettingsScreen
            stats={stats}
            settings={settings}
            setSettings={setSettings}
            level={level}
            hardResetFocusFoe={
              hardResetFocusFoe
            }
            openMissionArchive={() =>
              setScreen(
                'archive'
              )
            }
            openMission={mission => {
              setSelectedMission(mission);
              setScreen('mission');
            }}
            themeColor={primary}
          />
        )
      }

      {
        screen === 'archive' &&
        (
          <MissionArchiveScreen
            stats={stats}
            themeColor={primary}
            openMission={mission => {
              setSelectedMission(mission);
              setScreen('mission');
            }}
            goBack={() => {
              setScreen('settings');
            }}
            level={level}
          />
        )
      }

      {
        screen === 'mission' &&
        selectedMission &&
        (
          <MissionDetailScreen
            mission={selectedMission}
            themeColor={primary}
            goBack={() =>
              setScreen('archive')
            }
            level={level}
          />
        )
      }

      {renderBottomNav()}

      <LoadingOverlay
        transitionLoading={transitionLoading}
        loadingMessage={loadingMessage}
        villainMood={villainMood}
        themeColor={primary}
        reducedMotion={
          settings.reducedMotion
        }
      />
    </View>
  );
}