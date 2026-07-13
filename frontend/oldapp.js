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
  import Slider from '@react-native-community/slider';
  import { Accelerometer } from 'expo-sensors';
  import Svg, { Circle } from 'react-native-svg';
  
  // ─── Constants ────────────────────────────────────────────────────────────────
  
  const { width, height } = Dimensions.get('window');
  
  const API_BASE = 'http://10.30.132.47:3001';
  const XP_STORAGE_KEY = '@focusfoe/xp';
  const STATS_STORAGE_KEY = '@focusfoe/stats';
  const ACHIEVEMENTS_STORAGE_KEY = '@focusfoe/achievements';
  const XP_PER_LEVEL = 100;
  const ACCEL_MOVEMENT_THRESHOLD = 1.7;
  const SLIP_COOLDOWN_MS = 5000;
  const CHECKIN_INTERVAL_MS = 10 * 60 * 1000;
  
  // ─── Design Tokens ────────────────────────────────────────────────────────────
  
  const C = {
    bg:           '#111125',   // void base
    bgLow:        '#1A1A2E',   // surface-container-low
    bgCard:       '#252540',   // surface-container
    bgCardHigh:   '#28283d',   // surface-container-high
    border:       '#484555',   // outline-variant
    borderSub:    'rgba(255,255,255,0.07)',
    primary:      '#7B61FF',   // purple
    primaryGlow:  'rgba(123,97,255,0.35)',
    primaryFaint: 'rgba(123,97,255,0.12)',
    onSurface:    '#e2e0fc',
    muted:        '#928ea1',
    mutedDim:     '#6B6B8A',
    red:          '#E03E3E',
    redFaint:     'rgba(224,62,62,0.15)',
    redGlow:      'rgba(224,62,62,0.4)',
    gold:         '#f0c110',
    goldFaint:    'rgba(240,193,16,0.12)',
    green:        '#00FF88',
    white:        '#F0EBD8',   // warm white
  };
  
  // ─── Fonts (Expo uses system fonts; we approximate with fontWeight) ───────────
  // To use Syne/Geist: add expo-font + useFonts hook. For now we use system.
  
  const F = {
    villain: { fontWeight: '800', letterSpacing: -0.5 },   // Syne 800
    headline: { fontWeight: '700' },                        // Syne 700
    body: { fontWeight: '400' },
    label: { fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' },
    mono: { fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '600', letterSpacing: 2 },
  };
  
  // ─── Assets ───────────────────────────────────────────────────────────────────
  
  const OVERSEERS = {
    idle: require('./assets/overseer/idle.png'),
    judging: require('./assets/overseer/judging.png'),
    angry: require('./assets/overseer/angry.png'),
    mocking: require('./assets/overseer/mocking.png'),
    annoyed: require('./assets/overseer/annoyed.png'),
    suspicious: require('./assets/overseer/suspicious.png'),
    threatened: require('./assets/overseer/threatened.png'),
    impressed: require('./assets/overseer/impressed.png'),
    disappointed: require('./assets/overseer/disappointed.png'),
    defeated: require('./assets/overseer/defeated.png'),
    celebrating: require('./assets/overseer/celebrating.png'),
  };
  
  // ─── Helpers ──────────────────────────────────────────────────────────────────
  
  const PERSONALITIES = ['sarcastic', 'dramatic', 'sleepy', 'philosophical'];
  const PERSONALITY_LABELS = {
    sarcastic:    'SARCASTIC',
    dramatic:     'DRAMATIC',
    sleepy:       'SLEEPY',
    philosophical:'PHILOSOPHICAL',
  };
  
  function minutesElapsed(durationMinutes, secondsLeft) {
    const elapsed = durationMinutes * 60 - secondsLeft;
    return Math.max(0, Math.floor(elapsed / 60));
  }
  
  function getLevelProgress(totalXp) {
    const level = Math.floor(totalXp / XP_PER_LEVEL) + 1;
    const xpInLevel = totalXp % XP_PER_LEVEL;
    return { level, xpInLevel, progress: xpInLevel / XP_PER_LEVEL };
  }
  
  function formatTime(totalSeconds) {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  
  // ─── Sub-components ───────────────────────────────────────────────────────────
  
  /** Glowing overseer avatar in circular frame */
  function OverseerAvatar({
    mood,
    size = 120,
    glowColor,
  }) {
    const pulse =
      useRef(
        new Animated.Value(1)
      ).current;
  
    useEffect(() => {
      const anim =
        Animated.loop(
          Animated.sequence([
            Animated.timing(
              pulse,
              {
                toValue: 1.04,
                duration: 2000,
                useNativeDriver: true,
              }
            ),
  
            Animated.timing(
              pulse,
              {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
              }
            ),
          ])
        );
  
      anim.start();
  
      return () =>
        anim.stop();
    }, []);
  
    const gc =
      glowColor ||
      C.primaryGlow;
  
    return (
      <Animated.View
        style={{
          transform: [{scale: pulse}],
          alignItems: 'center',
        }}
      >
        {/* glow */}
        <View
          style={{
            position: 'absolute',
            width: size + 28,
            height: size + 28,
            borderRadius: (size + 28) / 2,
            backgroundColor: gc,
            top: -14,
            left: -14,
            opacity: 0.32,
          }}
        />
  
        {/* ring */}
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: 3,
            borderColor: glowColor ? C.red : C.primary,
            backgroundColor: '#fff',
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            source={
              OVERSEERS[
                mood
              ] ||
              OVERSEERS.idle
            }
            style={{
              width:
                size *
                1.34,
  
              height:
                size *
                1.34,
            }}
            resizeMode="contain"
          />
        </View>
      </Animated.View>
    );
  }
  
  /** SVG ring timer */
  function TimerRing({ secondsLeft, totalSeconds, size = 220 }) {
    const r = (size - 20) / 2;
    const circ = 2 * Math.PI * r;
    const pct = totalSeconds > 0 ? secondsLeft / totalSeconds : 0;
    const offset = circ * (1 - pct);
    const isDanger = pct < 0.25 && pct > 0;
    const strokeColor = isDanger ? C.red : C.primary;
  
    return (
      <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={size} height={size} style={{ position: 'absolute', transform: [{ rotate: '-90deg' }] }}>
          {/* track */}
          <Circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={C.bgCardHigh} strokeWidth={10} />
          {/* progress */}
          <Circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke={strokeColor} strokeWidth={10}
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round"
          />
        </Svg>
        <View style={{ alignItems: 'center' }}>
          <Text style={[F.mono, { color: C.onSurface, fontSize: 48, lineHeight: 56 }]}>
            {formatTime(secondsLeft)}
          </Text>
          <Text style={[F.label, { color: C.muted, fontSize: 10, marginTop: 4 }]}>
            REMAINING
          </Text>
        </View>
      </View>
    );
  }
  
  /** Villain dialogue speech bubble */
  function DialogueBubble({
    text,
    loading,
    accent = C.primary,
    backgroundColor = C.bgCard,
    borderColor = C.borderSub,
    textColor = C.white,
    compact = false,
  }) {
    return (
      <View
        style={[
          S.bubble,
          {
            backgroundColor,
            borderColor,
            borderLeftColor: accent,
            marginHorizontal: compact ? 0 : 20,
          },
        ]}
      >
        {loading ? (
          <View
            style={{
              flexDirection: 'row',
              gap: 6,
              justifyContent: 'center',
              paddingVertical: 4,
            }}
          >
            {[0, 1, 2].map(i => (
              <View
                key={i}
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 99,
                  backgroundColor: accent,
                  opacity: 0.7,
                }}
              />
            ))}
          </View>
        ) : (
          <Text
            style={[
              F.villain,
              {
                color: textColor,
                fontSize: 16,
                lineHeight: 26,
                fontStyle: 'italic',
              },
            ]}
          >
            {text}
          </Text>
        )}
      </View>
    );
  }
  
  /** Small pill badge */
  function Pill({ label, color = C.primary, bg }) {
    return (
      <View style={{
        paddingHorizontal: 12, paddingVertical: 4,
        borderRadius: 99,
        borderWidth: 1,
        borderColor: color,
        backgroundColor: bg || `${color}18`,
      }}>
        <Text style={[F.label, { color, fontSize: 10 }]}>{label}</Text>
      </View>
    );
  }
  
  /** XP progress bar */
  function XPBar({ progress, level }) {
    return (
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
          <Text style={[F.label, { color: C.primary, fontSize: 10 }]}>LVL {level}</Text>
          <Text style={[F.label, { color: C.mutedDim, fontSize: 10 }]}>LVL {level + 1}</Text>
        </View>
        <View style={{ height: 5, backgroundColor: C.bgCardHigh, borderRadius: 99, overflow: 'hidden' }}>
          <View style={{ width: `${progress * 100}%`, height: '100%', backgroundColor: C.primary, borderRadius: 99 }} />
        </View>
      </View>
    );
  }
  
  /** Label caps text */
  function Label({ children, color, style }) {
    return <Text style={[F.label, { color: color || C.muted, fontSize: 11 }, style]}>{children}</Text>;
  }
  
  const DEFAULT_STATS = {
    version: 1,
  
    lastActiveDate: null,
    weeklyResetKey: null,
  
    completedSessions: 0,
    surrenderedSessions: 0,
  
    totalFocusMinutes: 0,
    totalSlips: 0,
  
    currentStreak: 0,
    longestStreak: 0,
  
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
  
  const ACHIEVEMENT_CONFIG = {
    first_blood: {
      title: 'First Blood',
      description:
        'Complete your first mission.',
      icon: Flame,
      permanent: true,
    },
  
    iron_will: {
      title: 'Iron Will',
      description:
        '3 zero-slip sessions.',
      icon: Shield,
      permanent: true,
    },
  
    night_owl: {
      title: 'Night Owl',
      description:
        'Win after 11 PM.',
      icon: Moon,
      permanent: true,
    },
  
    dawn_warrior: {
      title: 'Dawn Warrior',
      description:
        'Win before 6 AM.',
      icon: Star,
      permanent: true,
    },
  
    grinder: {
      title: 'Grinder',
      description:
        '10 completed sessions.',
      icon: Zap,
      permanent: true,
    },
  
    centurion: {
      title: 'Centurion',
      description:
        '100 victories.',
      icon: Crown,
      permanent: true,
    },
  
    marathon: {
      title: 'Marathon',
      description:
        '2+ hour session.',
      icon: Timer,
      permanent: true,
    },
  
    monk: {
      title: 'Focus Monk',
      description:
        '10 zero-slip wins.',
      icon: Shield,
      permanent: true,
    },
  
    phoenix: {
      title: 'Phoenix',
      description:
        'Win after surrender.',
      icon: Flame,
      permanent: true,
    },
  
    slip_survivor: {
      title:
        'Slip Survivor',
      description:
        'Win despite 5 slips.',
      icon:
        TriangleAlert,
      permanent: true,
    },
  
    deep_diver: {
      title:
        'Deep Diver',
      description:
        '3 sessions over 90m.',
      icon: Gem,
      permanent: true,
    },
  
    xp_hunter: {
      title:
        'XP Hunter',
      description:
        '1000 lifetime XP.',
      icon: Gem,
      permanent: true,
    },
  
    consistency_king:
      {
        title:
          'Consistency King',
        description:
          'Maintain 5 streak.',
        icon:
          Crown,
        permanent:
          false,
      },
  
    discipline_guardian:
      {
        title:
          'Discipline Guardian',
        description:
          'Average ≤1 slip.',
        icon:
          Shield,
        permanent:
          false,
      },
  
    firekeeper: {
      title:
        'Firekeeper',
      description:
        '30m/day for 5 days.',
      icon:
        Flame,
        permanent:
        false,
    },
  
    diamond_mind:
      {
        title:
          'Diamond Mind',
        description:
          '90%+ win rate.',
        icon:
          Gem,
        permanent:
          false,
      },
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
  
    const { level, progress, xpInLevel } = getLevelProgress(xp);
  
    useEffect(() => {
      if (
        screen !== 'stats'
      ) {
        lastActiveScreenRef.current =
          screen;
      }
    }, [screen]);
  
    // ── XP persistence (unchanged) ──
    useEffect(() => {
      AsyncStorage.getItem(XP_STORAGE_KEY).then(stored => {
        if (stored) setXp(Number(stored));
      });
    }, []);
  
    useEffect(() => {
      AsyncStorage.setItem(XP_STORAGE_KEY, String(xp));
    }, [xp]);
  
    useEffect(() => {
      async function loadStats() {
        try {
          const savedStats =
            await AsyncStorage.getItem(
              STATS_STORAGE_KEY
            );
    
          const savedAchievements =
            await AsyncStorage.getItem(
              ACHIEVEMENTS_STORAGE_KEY
            );
    
          if (savedStats) {
            const parsed =
              JSON.parse(
                savedStats
              );
    
            // merge schema safely
            setStats({
              ...DEFAULT_STATS,
              ...parsed,
    
              weeklyFocus: {
                ...DEFAULT_STATS.weeklyFocus,
                ...(parsed.weeklyFocus ||
                  {}),
              },
    
              weeklySlips: {
                ...DEFAULT_STATS.weeklySlips,
                ...(parsed.weeklySlips ||
                  {}),
              },
            });
          }
    
          if (
            savedAchievements
          ) {
            setAchievements(
              JSON.parse(
                savedAchievements
              )
            );
          }
        } catch (
          err
        ) {
          console.log(
            'Stats load error:',
            err
          );
        }
      }
    
      loadStats();
    }, []);
  
    useEffect(() => {
      AsyncStorage.setItem(
        STATS_STORAGE_KEY,
        JSON.stringify(
          stats
        )
      );
    }, [stats]);
    
    useEffect(() => {
      AsyncStorage.setItem(
        ACHIEVEMENTS_STORAGE_KEY,
        JSON.stringify(
          achievements
        )
      );
    }, [achievements]);
  
    // ── API call (unchanged) ──
    const fetchVillainVoice = useCallback(async (phase, slipsOverride) => {
      const requestId = ++requestIdRef.current;
  
      // Immediately update UI
      setLoadingVoice(true);
      setCurrentVillainText('');
  
      const controller =
        new AbortController();
  
      const timeout =
        setTimeout(
          () =>
            controller.abort(),
          3500
        );
  
      try {
        const res = await fetch(`${API_BASE}/api/villain-voice`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phase,
            personality,
            task: taskRef.current,
            duration: durationRef.current,
            slips: slipsOverride ?? slipsRef.current,
            minutesIn: minutesElapsed(durationRef.current, secondsLeftRef.current),
            cruelty,
          }),
        });
        const data = await res.json();
        if (requestId !== requestIdRef.current) return;
        setCurrentVillainText(data.text || '');
  
        // Dynamic emotional reactions
        if (phase === 'checkin') {
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
  
          // user doing well
          if (
            slipsRef.current === 0 &&
            ratio > 0.45
          ) {
            setVillainMood(
              'threatened'
            );
          }
  
          // user struggling
          else if (
            slipsRef.current >= 2
          ) {
            setVillainMood(
              'mocking'
            );
          }
  
          // neutral monitoring
          else {
            setVillainMood(
              'suspicious'
            );
          }
        }
      } catch (err) {
        console.log(err);
        setCurrentVillainText(
          "Even I got tired waiting for your attention span 😒"
        );
      } finally {
        setLoadingVoice(false);
      }
    }, [cruelty, personality]);
  
    const hardResetFocusFoe =
    async () => {
      try {
        await AsyncStorage.multiRemove([
          XP_STORAGE_KEY,
          STATS_STORAGE_KEY,
          ACHIEVEMENTS_STORAGE_KEY,
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
        setBottomTab('timer');
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
      await fetchVillainVoice('start', 0);
    }, [duration, taskName, fetchVillainVoice]);
  
    const getDayKey = () => {
      const days = [
        'sun',
        'mon',
        'tue',
        'wed',
        'thu',
        'fri',
        'sat',
      ];
  
      return days[
        new Date().getDay()
      ];
    };
  
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
            prev
              .weeklySlips[
              day
            ] + 1,
        },
      }));
  
      setSessionPaused(true);
      setScreen('weakness');
      await fetchVillainVoice('slip', nextSlips);
    }, [fetchVillainVoice, sessionPaused]);
  
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
  
    const resetWeeklyStatsIfNeeded =
    useCallback(
      currentStats => {
        const now =
          new Date();
  
        const currentWeek =
          `${now.getFullYear()}-${Math.ceil(
            now.getDate() /
              7
          )}`;
  
        if (
          currentStats.weeklyResetKey ===
          currentWeek
        ) {
          return currentStats;
        }
  
        return {
          ...currentStats,
  
          weeklyResetKey:
            currentWeek,
  
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
        };
      },
      []
    );
  
    const updateStreak =
    useCallback(
      (
        currentStats,
        success = true
      ) => {
        const today =
          new Date()
            .toISOString()
            .split(
              'T'
            )[0];
  
        // surrender resets
        if (
          !success
        ) {
          return {
            ...currentStats,
  
            currentStreak: 0,
  
            lastActiveDate:
              today,
          };
        }
  
        const last =
          currentStats.lastActiveDate;
  
        let nextStreak =
          currentStats.currentStreak;
  
        if (
          !last
        ) {
          nextStreak =
            1;
        } else {
          const diff =
            Math.floor(
              (
                new Date(
                  today
                ) -
                new Date(
                  last
                )
              ) /
                86400000
            );
  
          if (
            diff ===
            0
          ) {
            nextStreak =
              currentStats.currentStreak;
          } else if (
            diff ===
            1
          ) {
            nextStreak +=
              1;
          } else {
            nextStreak =
              1;
          }
        }
  
        return {
          ...currentStats,
  
          currentStreak:
            nextStreak,
  
          longestStreak:
            Math.max(
              currentStats.longestStreak,
              nextStreak
            ),
  
          lastActiveDate:
            today,
        };
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
        setVillainMood('defeated');
  
        try {
          await fetchVillainVoice(
            'victory',
            slipsRef.current
          );
  
          const gained =
            awardVictoryXp(
              slipsRef.current,
              durationRef.current
            );
  
          const day =
            getDayKey();
  
          const updatedStats =
            {
              ...stats,
  
              completedSessions:
                stats.completedSessions +
                1,
  
              totalFocusMinutes:
                stats.totalFocusMinutes +
                durationRef.current,
  
              currentStreak:
                stats.currentStreak +
                1,
  
              longestStreak:
                Math.max(
                  stats.longestStreak,
                  stats.currentStreak +
                    1
                ),
  
              zeroSlipSessions:
                slipsRef.current ===
                0
                  ? stats.zeroSlipSessions +
                    1
                  : stats.zeroSlipSessions,
  
              bestSessionMinutes:
                Math.max(
                  stats.bestSessionMinutes,
                  durationRef.current
                ),
  
              lifetimeXp:
                stats.lifetimeXp +
                gained,
  
              weeklyFocus:
                {
                  ...stats.weeklyFocus,
  
                  [day]:
                    stats
                      .weeklyFocus[
                      day
                    ] +
                    durationRef.current,
                },
  
              recentSessions:
                [
                  {
                    date:
                      Date.now(),
  
                    duration:
                      durationRef.current,
  
                    slips:
                      slipsRef.current,
  
                    result:
                      'victory',
                  },
  
                  ...stats.recentSessions,
                ].slice(
                  0,
                  30
                ),
            };
  
          setStats(
            updatedStats
          );
  
          checkAchievements(
            updatedStats
          );
  
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
        stats,
        awardVictoryXp,
        fetchVillainVoice,
        checkAchievements,
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
        setVillainMood('celebrating');
  
        try {
          await fetchVillainVoice(
            'surrender'
          );
  
          const updatedStats =
            {
              ...stats,
  
              surrenderedSessions:
                stats.surrenderedSessions +
                1,
  
              currentStreak:
                0,
  
              recentSessions:
                [
                  {
                    date:
                      Date.now(),
  
                    duration:
                      minutesElapsed(
                        durationRef.current,
                        secondsLeftRef.current
                      ),
  
                    slips:
                      slipsRef.current,
  
                    result:
                      'surrender',
                  },
  
                  ...stats.recentSessions,
                ].slice(
                  0,
                  30
                ),
            };
  
          setStats(updatedStats);
          checkAchievements(updatedStats);
  
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
        stats,
        fetchVillainVoice,
        resetSetupState,
        checkAchievements,
      ]
    );
  
    const checkAchievements = useCallback(
      (
        updatedStats
      ) => {
        const unlocked =
          {};
  
        // permanent
  
        unlocked.first_blood =
          updatedStats.completedSessions >=
          1;
  
        unlocked.iron_will =
          updatedStats.zeroSlipSessions >=
          3;
  
        unlocked.grinder =
          updatedStats.completedSessions >=
          10;
  
        unlocked.centurion =
          updatedStats.completedSessions >=
          100;
  
        unlocked.marathon =
          updatedStats.bestSessionMinutes >=
          120;
  
        unlocked.monk =
          updatedStats.zeroSlipSessions >=
          10;
  
        unlocked.xp_hunter =
          updatedStats.lifetimeXp >=
          1000;
  
        // defendable
  
        unlocked.consistency_king =
          updatedStats.currentStreak >=
          5;
  
        const totalSessions =
          updatedStats.completedSessions +
          updatedStats.surrenderedSessions;
  
        unlocked.diamond_mind =
          totalSessions >
            0 &&
          updatedStats.completedSessions /
            totalSessions >=
            0.9;
  
        unlocked.discipline_guardian =
          updatedStats.totalSlips /
            Math.max(
              1,
              updatedStats.completedSessions
            ) <=
          1;
  
        unlocked.firekeeper =
          Object.values(
            updatedStats.weeklyFocus
          ).filter(
            mins =>
              mins >=
              30
          ).length >=
          5;
  
        setAchievements(
          unlocked
        );
      },
      []
    );
  
    // ── Timer effect (unchanged) ──
    useEffect(() => {
      if (!sessionActive || sessionPaused) return;
      const updateTimer = () => {
        if (!sessionEndTimeRef.current) return;
        const remainingMs = sessionEndTimeRef.current - Date.now();
        const nextSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
        secondsLeftRef.current = nextSeconds;
        setSecondsLeft(nextSeconds);
        if (nextSeconds === 0 && !victoryHandledRef.current) handleVictory(false);
      };
      updateTimer();
      const interval = setInterval(updateTimer, 1000);
      return () => clearInterval(interval);
    }, [sessionActive, sessionPaused, handleVictory]);
  
    // ── Accelerometer (unchanged) ──
    useEffect(() => {
      if (!sessionActive) return;
      Accelerometer.setUpdateInterval(250);
      const sub = Accelerometer.addListener(({ x, y, z }) => {
        if (!sessionRef.current || sessionPaused) return;
        const last = lastAccelRef.current;
        lastAccelRef.current = { x, y, z };
        if (!last) return;
        const delta = Math.sqrt((x - last.x) ** 2 + (y - last.y) ** 2 + (z - last.z) ** 2);
        if (delta > ACCEL_MOVEMENT_THRESHOLD) registerSlip();
      });
      return () => sub.remove();
    }, [sessionActive, sessionPaused, registerSlip]);
  
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
              prev ===
                'active' &&
              nextState ===
                'background'
            ) {
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
  
    const renderSetupScreen = () => (
      <ScrollView
        contentContainerStyle={{ paddingBottom: 130 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={S.topBarCompact}>
          <OverseerAvatar
            mood="idle"
            size={38}
          />
  
          <Text
            style={[
              F.villain,
              {
                color: C.primary,
                fontSize: 18,
              },
            ]}
          >
            FOCUSFOE
          </Text>
  
          <Pill
            label={
              PERSONALITY_LABELS[
                personality
              ]
            }
            color={C.primary}
          />
        </View>
  
        {/* Overseer + speech bubble */}
        <View style={{ alignItems: 'center', marginTop: 8, marginBottom: 24 }}>
          <OverseerAvatar mood="judging" size={120} />
          {/* speech tail */}
          <View style={S.speechTail} />
          <DialogueBubble
            text={
              currentVillainText ||
              'Another futile attempt at productivity? How adorable.'
            }
            loading={loadingVoice}
            accent={C.primary}
            backgroundColor="rgba(123,97,255,0.08)"
            borderColor="rgba(123,97,255,0.14)"
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
                    active &&
                      S.durationCardActive,
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
          {[
            {
              key: 'sarcastic',
              title: 'Sarcastic',
              subtitle: 'Dry humor',
            },
            {
              key: 'dramatic',
              title: 'Dramatic',
              subtitle: 'Cinematic villain',
            },
            {
              key: 'sleepy',
              title: 'Sleepy',
              subtitle: 'Lazy roasting',
            },
            {
              key: 'philosophical',
              title: 'Philosophical',
              subtitle: 'Existential',
            },
          ].map(item => {
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
                  active &&
                    S.personalityCardActive,
                ]}
              >
                <Text
                  style={{
                    color:
                      active
                        ? C.primary
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
          minimumTrackTintColor={C.primary}
          maximumTrackTintColor={C.bgCardHigh}
          thumbTintColor={C.primary}
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
          style={[S.primaryBtn, !taskName.trim() && { opacity: 0.35 }]}
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
    );
  
    // ── Focus screen ──
    const renderFocusScreen =
    () => {
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
            />
  
            <Text
              style={[
                F.villain,
                {
                  color:
                    C.primary,
                  fontSize:
                    18,
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
                  : C.primary
              }
            />
          </View>
  
          {/* task */}
          <View
            style={{
              paddingHorizontal:
                24,
              marginTop: 12,
            }}
          >
            <Text
              style={{
                color:
                  C.muted,
                fontSize:
                  12,
                letterSpacing:
                  2,
                textTransform:
                  'uppercase',
              }}
            >
              CURRENT MISSION
            </Text>
  
            <Text
              style={{
                color:
                  C.white,
                fontSize:
                  28,
                fontWeight:
                  '900',
                marginTop:
                  8,
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
                  : C.primary
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
              alignItems:
                'center',
              marginTop:
                34,
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
  
    // ── Weakness screen ──
    const renderWeaknessScreen = () => (
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
    );
  
    // ── Victory screen ──
    const renderVictoryScreen = () => (
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
            mood="defeated"
            size={130}
            glowColor="rgba(0,255,136,0.28)"
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
                color={C.primary}
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
    );
  
    // ── Defeat screen ──
    const renderDefeatScreen = () => (
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
            mood="celebrating"
            size={130}
            glowColor={C.redGlow}
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
                {backgroundColor: 'rgba(123,97,255,0.12)'},
              ]}
            >
              <Timer
                size={16}
                color={C.primary}
              />
            </View>
  
            <View style={{ flex: 1 }}>
              <Text style={S.victoryStatTitle}>
                Survived
              </Text>
  
              <Text
                style={S.victoryStatNumber}
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
            style={[
              S.victoryStatTile,
              {borderColor: 'rgba(224,62,62,0.15)'},
            ]}
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
              backgroundColor: '#7B61FF',
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
    );
  
    const StatsTile =
    ({
      icon: Icon,
      label,
      value,
    }) => (
      <View
        style={
          S.analyticsTile
        }
      >
        <View
          style={
            S.analyticsIcon
          }
        >
          <Icon
            size={18}
            color={
              C.primary
            }
          />
        </View>
  
        <Text
          style={
            S.analyticsValue
          }
        >
          {value}
        </Text>
  
        <Text
          style={
            S.analyticsLabel
          }
        >
          {label}
        </Text>
      </View>
    );
  
    // ── Stats screen ──
    const renderStatsScreen = () => {
      const totalSessions = stats.completedSessions + stats.surrenderedSessions;
      const hoursFocused = (stats.totalFocusMinutes / 60).toFixed(1);
  
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
  
      const weeklyFocus =
        Object.values(
          stats.weeklyFocus
        );
  
      const weeklySlips =
        Object.values(
          stats.weeklySlips
        );
  
      const maxFocus =
        Math.max(
          ...weeklyFocus,
          1
        );
  
      const maxCombined =
        Math.max(
          ...weeklyFocus,
          ...weeklySlips.map(s => s * 15),
          1
        );
  
      const days = [ 'M', 'T', 'W', 'T', 'F', 'S', 'S'];
  
      return stats.completedSessions ===
          0 &&
        stats.surrenderedSessions ===
          0 ? (
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
              />
  
              <Text
                style={[
                  F.villain,
                  {
                    color: C.primary,
                    fontSize: 18,
                  },
                ]}
              >
                STATS
              </Text>
  
              <Pill
                label={`LV ${level}`}
                color={C.primary}
              />
            </View>
  
            {/* HERO PROFILE CARD */}
            <View
              style={S.statsHeroCard}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <View
                  style={S.rankOrb}
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
                    {stats.currentStreak}
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
                  backgroundColor: '#242448',
                  overflow: 'hidden',
                  marginTop: 18,
                }}
              >
                <View
                  style={{
                    width: `${progress * 100}%`,
                    height: '100%',
                    backgroundColor: C.primary,
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
                />
  
                <StatsTile
                  icon={Flame}
                  label="Hours"
                  value={hoursFocused}
                />
  
                <StatsTile
                  icon={Shield}
                  label="Win Rate"
                  value={`${winRate}%`}
                />
  
                <StatsTile
                  icon={Zap}
                  label="Avg Session"
                  value={`${avgSession}m`}
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
                  <Text
                    style={S.heroMetricLabel}
                  >
                    CURRENT
                  </Text>
  
                  <Text
                    style={S.bigMetric}
                  >
                    {stats.currentStreak}
                  </Text>
                </View>
  
                <View>
                  <Text
                    style={S.heroMetricLabel}
                  >
                    LONGEST
                  </Text>
  
                  <Text
                    style={S.bigMetric}
                  >
                    {stats.longestStreak}
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
                                  8,
                                  ((weeklySlips[i] * 15) / maxCombined) * 70,
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
                  label={`${Object.values(achievements).filter(Boolean).length}/${Object.keys(ACHIEVEMENT_CONFIG).length}`}
                  color={C.primary}
                />
              </View>
  
              <View
                style={S.achievementGrid}
              >
                {Object.entries(ACHIEVEMENT_CONFIG).map(
                  ([key,config]) => {
                    const unlocked = achievements[key];
                    const Icon = config.icon;
  
                    return (
                      <View
                        key={key}
                        style={[
                          S.achievementCard,
                          unlocked && S.achievementUnlocked,
                        ]}
                      >
                        <View
                          style={[
                            S.achievementIconWrap,
                            unlocked && { backgroundColor: 'rgba(123,97,255,0.18)'},
                          ]}
                        >
                          <Icon
                            size={22}
                            color={unlocked ? C.primary : '#5B5F87'}
                          />
                        </View>
  
                        <View
                          style={{
                            marginTop: 10,
                            alignItems: 'center',
                            paddingHorizontal: 8,
                          }}
                        >
                          <Text
                            numberOfLines={2}
                            style={[
                              S.achievementTitle,
                              unlocked && {
                                color: C.white,
                              },
                            ]}
                          >
                            {config.title}
                          </Text>
  
                          <Text
                            numberOfLines={2}
                            style={S.achievementDesc}
                          >
                            {config.description}
                          </Text>
                        </View>
  
                        {/* defendable */}
                        {!config.permanent && (
                          <View
                            style={S.defendBadge}
                          >
                            <Shield
                              size={10}
                              color="#FFB84D"
                            />
  
                            <Text
                              style={{
                                color: '#FFB84D',
                                fontSize: 9,
                                fontWeight: '700',
                              }}
                            >
                              DEFEND
                            </Text>
                          </View>
                        )}
  
                        {!unlocked && (
                          <View
                            style={S.lockedOverlay}
                          />
                        )}
                      </View>
                    );
                  }
                )}
              </View>
            </View>
          </ScrollView>
        );
    };
  
    // ── Bottom nav ──
    const renderBottomNav = () => {
      if (screen === 'weakness') return null;
  
      const tabs = [
        {
          id: 'timer',
          label: 'TIMER',
          icon: Timer,
          onPress:
            () => {
              setBottomTab('timer');
              if (screen === 'stats') {
                setScreen(lastActiveScreenRef.current);
              }
            },
        },
  
        {
          id: 'stats',
          label: 'STATS',
          icon: BarChart3,
          onPress:
            () => {
              setBottomTab('stats');
              setScreen('stats');
            },
        },
  
        {
          id: 'settings',
          label: 'SETTINGS',
          icon: Settings,
          onPress:
            () => {
              // future settings
            },
        },
      ];
  
      return (
        <View
          style={S.bottomNav}
        >
          {tabs.map(
            tab => {
              const active = bottomTab === tab.id;
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
                      active && S.bottomIconWrapActive,
                    ]}
                  >
                    <Icon
                      size={18}
                      color={active ? C.primary : C.mutedDim}
                    />
                  </View>
  
                  <Text
                    style={[
                      S.bottomNavLabel,
                      active && {color: C.primary},
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
  
    const renderLoadingOverlay = () => (
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
        <View
          style={S.loadingGlow}
        />
  
        <View
          style={S.loadingCard}
        >
          <View
            style={S.loadingPill}
          >
            <Shield
              size={13}
              color={C.primary}
            />
  
            <Text
              style={S.loadingPillText}
            >
              OVERSEER ACTIVE
            </Text>
          </View>
  
          <OverseerAvatar
            mood={villainMood || 'judging'}
            size={90}
            glowColor={
              villainMood === 'celebrating' ||
              villainMood === 'angry'
                ? C.redGlow
                : C.primaryGlow
            }
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
              color={C.primary}
            />
  
            <Text
              style={S.loadingDotsText}
            >
              PLEASE WAIT
            </Text>
          </View>
        </View>
      </View>
    );
  
    // ── Render ──
    return (
      <View style={S.root}>
        <StatusBar style="light" />
        {screen === 'setup'    && renderSetupScreen()}
        {screen === 'focus'    && renderFocusScreen()}
        {screen === 'weakness' && renderWeaknessScreen()}
        {screen === 'victory'  && renderVictoryScreen()}
        {screen === 'defeat'   && renderDefeatScreen()}
        {screen === 'stats'    && renderStatsScreen()}
        {renderBottomNav()}
        {renderLoadingOverlay()}
      </View>
    );
  }
  
  
  
  // ─── Styles ───────────────────────────────────────────────────────────────────
  
  const S = StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: C.bg,
    },
  
    // ── Navigation ──
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: Platform.OS === 'ios' ? 44 : 20,
      paddingBottom: 8,
    },
  
    topBarCompact: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: Platform.OS === 'ios' ? 42 : 18,
      paddingBottom: 4,
      marginBottom: 20,
    },
  
    bottomNav: {
      position: 'absolute',
      bottom: 18,
      left: 18,
      right: 18,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'rgba(18,20,38,0.96)',
      borderRadius: 26,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.06)',
      paddingVertical: 8,
      paddingHorizontal: 10,
      shadowColor: '#000',
      shadowOpacity: 0.22,
      shadowRadius: 20,
      shadowOffset: {
        width: 0,
        height: 10,
      },
      elevation: 20,
    },
    
    bottomNavItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    bottomIconWrap: {
      width: 34,
      height: 34,
      borderRadius: 7 ,
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    bottomIconWrapActive: {
      backgroundColor: 'rgba(123,97,255,0.12)',
      borderRadius: 7 ,
    },
    
    bottomNavLabel: {
      marginTop: 3,
      fontSize: 9,
      fontWeight: '700',
      letterSpacing: 0.8,
      color: C.mutedDim,
    },
  
  
    // ── Cards ──
    card: {
      backgroundColor: C.bgCard,
      borderWidth: 1,
      borderColor: C.borderSub,
      borderRadius: 16,
      padding: 16,
      marginHorizontal: 20,
    },
  
    cardGlow: {
      backgroundColor: C.bgCard,
      borderWidth: 1,
      borderColor: 'rgba(123,97,255,0.22)',
      borderRadius: 16,
      padding: 16,
      marginHorizontal: 20,
      shadowColor: C.primary,
      shadowOpacity: 0.12,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 0 },
    },
  
    cardRed: {
      backgroundColor: '#1a0e1e',
      borderWidth: 1,
      borderColor: 'rgba(224,62,62,0.35)',
      borderRadius: 16,
      padding: 18,
      shadowColor: C.red,
      shadowOpacity: 0.2,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 0 },
    },
  
    // ── Dialogue bubble ──
    bubble: {
      borderLeftWidth: 3,
      borderWidth: 1,
      borderRadius: 16,
      borderTopLeftRadius: 4,
      paddingVertical: 16,
      paddingHorizontal: 16,
    },
  
    speechTail: {
      width: 0,
      height: 0,
      borderLeftWidth: 12,
      borderRightWidth: 12,
      borderBottomWidth: 14,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      borderBottomColor: C.bgCard,
      marginBottom: -1,
      marginTop: 8,
    },
  
  
    // ── Inputs ──
    input: {
      backgroundColor: C.bgLow,
      borderWidth: 1,
      borderColor: C.border,
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 15,
      color: C.onSurface,
      fontSize: 16,
      marginHorizontal: 20,
    },
  
  
    // ── Setup Screen Cards ──
    durationCard: {
      flex: 1,
      height: 62,
      borderRadius: 16,
      backgroundColor: C.bgCard,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: C.borderSub,
    },
  
    durationCardActive: {
      backgroundColor: C.primary,
      borderColor: C.primary,
    },
  
    personalityCard: {
      width: '47%',
      padding: 18,
      borderRadius: 24,
      backgroundColor: C.bgCard,
      borderWidth: 1,
      borderColor: C.borderSub,
    },
  
    personalityCardActive: {
      borderColor: C.primary,
      backgroundColor: C.primaryFaint,
    },
  
    // ── Loading Overlay Styles ──
    loadingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(8,10,20,0.96)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
    },
  
    loadingGlow: {
      position: 'absolute',
      width: 380,
      height: 380,
      borderRadius: 999,
      backgroundColor: 'rgba(123,97,255,0.08)',
    },
  
    loadingCard: {
      width: '86%',
      borderRadius: 34,
      paddingVertical: 34,
      paddingHorizontal: 26,
      alignItems: 'center',
      backgroundColor: '#171D2B',
      borderWidth: 1,
      borderColor: 'rgba(123,97,255,0.16)',
      shadowColor: '#7B61FF',
      shadowOpacity: 0.22,
      shadowRadius: 30,
      shadowOffset: {
        width: 0,
        height: 14,
      },
      elevation: 20,
    },
  
    loadingPill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 14,
      paddingVertical: 8,
      marginBottom: 24,
      borderRadius: 999,
      backgroundColor: 'rgba(123,97,255,0.12)',
      borderWidth: 1,
      borderColor: 'rgba(123,97,255,0.24)',
    },
  
    loadingPillText: {
      color: C.primary,
      fontSize: 11,
      fontWeight: '800',
      letterSpacing: 1.5,
    },
  
    loadingTitle: {
      color: C.white,
      fontSize: 18,
      fontWeight: '900',
      textAlign: 'center',
      marginTop: 18,
      letterSpacing: 0.5,
    },
  
    loadingSubtitle: {
      color: C.muted,
      fontSize: 14,
      textAlign: 'center',
      lineHeight: 22,
      marginTop: 12,
      paddingHorizontal: 16,
    },
  
    loadingDotsWrap: {
      marginTop: 28,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
  
    loadingDotsText: {
      color: C.primary,
      fontWeight: '700',
      letterSpacing: 1,
    },
  
  
    // ── Buttons ──
    primaryBtn: {
      backgroundColor: C.primary,
      height: 58,
      borderRadius: 24,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      marginHorizontal: 20,
      marginTop: 20,
      shadowColor: C.primary,
      shadowOpacity: 0.45,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 4 },
    },
  
    surrenderBtn: {
      width: '100%',
      height: 72,
      borderRadius: 28,
      borderWidth: 2,
      borderColor: '#FF5A73',
      backgroundColor: 'rgba(255,60,90,0.08)',
      marginTop: 16,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
  
    focusQuitBtn: {
      height: 58,
      borderRadius: 22,
      borderWidth: 1.5,
      borderColor: 'rgba(255,90,115,0.25)',
      backgroundColor: 'rgba(255,60,90,0.08)',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    ghostBtn: {
      paddingHorizontal: 28,
      paddingVertical: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: C.border,
    },
  
  
    // ── Weakness Screen Styles ──
    weaknessBanner: {
      width: '100%',
      backgroundColor: '#B10016',
      borderBottomWidth: 2,
      borderBottomColor: '#6B000E',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop:
        Platform.OS === 'ios'
          ? 56
          : 42,
      paddingBottom: 18,
      shadowColor: '#ff0026',
      shadowOpacity: 0.4,
      shadowRadius: 30,
      shadowOffset: {
        width: 0,
        height: 8,
      },
      elevation: 20,
    },
  
    warningPill: {
      backgroundColor: '#34161B',
      borderWidth: 2,
      borderColor: '#FF506B',
      borderRadius: 18,
      paddingVertical: 6,
      paddingHorizontal: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      shadowColor: '#ff3355',
      shadowOpacity: 0.35,
      shadowRadius: 18,
      elevation: 14,
      position: 'relative',
    },
    
    warningText: {
      color: C.red,
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 1,
    },
    
    resumeBtn: {
      height: 58,
      borderRadius: 24,
      backgroundColor: C.primary,
      width: '100%',
      marginTop: 24,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 10,
    },
  
    // ── Victory Screen Styles ──
    // victoryTopBanner: {
    //   width: '100%',
    //   backgroundColor: '#00D97E',
    //   borderBottomWidth: 2,
    //   borderBottomColor: '#00A962',
    //   alignItems: 'center',
    //   justifyContent: 'center',
    //   paddingTop: Platform.OS === 'ios' ? 58 : 44,
    //   paddingBottom: 22,
    //   shadowColor: '#00FF88',
    //   shadowOpacity: 0.35,
    //   shadowRadius: 30,
    //   shadowOffset: {
    //     width: 0,
    //     height: 8,
    //   },
    //   elevation: 20,
    // },
  
    bannerBase: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop:
        Platform.OS === 'ios'
          ? 58
          : 44,
      paddingBottom: 22,
      borderBottomWidth: 2,
      elevation: 20,
      shadowOpacity: 0.35,
      shadowRadius: 30,
      shadowOffset: {
        width: 0,
        height: 8,
      },
    },
  
    victoryBanner: {
      backgroundColor: '#00D97E',
      borderBottomColor: '#00A962',
      shadowColor: '#00FF88',
    },
    
    defeatBanner: {
      backgroundColor: '#A72837',
      borderBottomColor: '#7A1F2C',
      shadowColor: '#FF506B',
    },
    
    victoryCard: {
      backgroundColor: '#18262B',
      borderWidth: 1,
      borderColor: 'rgba(0,255,136,0.22)',
      borderRadius: 24,
      padding: 22,
      shadowColor: '#00FF88',
      shadowOpacity: 0.15,
      shadowRadius: 20,
      shadowOffset: {
        width: 0,
        height: 0,
      },
    },
    
    victoryStatTile: {
      width: '31.5%',
      minHeight: 72,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#171D2B',
      borderRadius: 20,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.06)',
      paddingHorizontal: 8,
      paddingVertical: 10,
      shadowColor: '#000',
      shadowOpacity: 0.14,
      shadowRadius: 8,
      shadowOffset: {
        width: 0,
        height: 4,
      },
      elevation: 5,
    },
    
    victoryStatIconWrap: {
      width: 30,
      height: 30,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(123,97,255,0.12)',
      marginRight: 8,
    },
    
    victoryStatTitle: {
      color: 'rgba(255,255,255,0.58)',
      fontSize: 10,
      fontWeight: '700',
      letterSpacing: 0.3,
    },
    
    victoryStatNumber: {
      color: '#fff',
      fontWeight: '900',
      fontSize: 15,
      marginTop: 2,
    },
  
    // ── Stats Screen Styles ──
    statsSection: {
      width: '90%',
      alignSelf: 'center',
      marginTop: 24,
    },
  
    statsCard: {
      width: '90%',
      alignSelf: 'center',
      backgroundColor: '#171D2B',
      borderRadius: 28,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.05)',
      padding: 22,
      marginTop: 18,
    },
  
    statsHeroCard: {
      width: '90%',
      alignSelf: 'center',
      marginTop: 18,
      backgroundColor: '#171D2B',
      borderRadius: 32,
      padding: 24,
      borderWidth: 1,
      borderColor: 'rgba(123,97,255,0.16)',
      shadowColor: '#7B61FF',
      shadowOpacity: 0.18,
      shadowRadius: 22,
      shadowOffset: {
        width: 0,
        height: 12,
      },
      elevation: 10,
    },
  
    rankOrb: {
      width: 72,
      height: 72,
      borderRadius: 999,
      backgroundColor: C.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
  
    heroMetricLabel: {
      color: 'rgba(255,255,255,0.5)',
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 0.6,
    },
  
    heroMetricValue: {
      color: C.white,
      fontSize: 20,
      fontWeight: '900',
      marginTop: 6,
    },
  
    sectionTitle: {
      color: C.white,
      fontSize: 18,
      fontWeight: '800',
    },
  
    bigMetric: {
      color: C.white,
      fontSize: 34,
      fontWeight: '900',
      marginTop: 4,
    },
  
    /* analytics */
    analyticsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginTop: 16,
    },
  
    analyticsTile: {
      width: '48%',
      backgroundColor: '#171D2B',
      borderRadius: 22,
      paddingVertical: 20,
      alignItems: 'center',
      marginBottom: 14,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.05)',
    },
  
    analyticsIcon: {
      width: 42,
      height: 42,
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(123,97,255,0.14)',
    },
  
    analyticsValue: {
      color: C.white,
      fontSize: 22,
      fontWeight: '900',
      marginTop: 12,
    },
  
    analyticsLabel: {
      color: C.muted,
      fontSize: 12,
      marginTop: 4,
    },
  
    /* graphs */
    graphRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      marginTop: 24,
    },
  
    graphBar: {
      width: 20,
      borderRadius: 999,
      backgroundColor: C.primary,
      shadowColor: C.primary,
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 8,
    },
    
    graphBarFocus: {
      width: 10,
      borderRadius: 999,
      backgroundColor: C.primary,
    },
    
    graphBarSlip: {
      width: 10,
      borderRadius: 999,
      backgroundColor: '#FF6B7A',
    },
    
    graphCol: {
      alignItems: 'center',
      flex: 1,
      minHeight: 110,
      justifyContent: 'flex-end',
    },
  
    graphDay: {
      color: C.muted,
      fontSize: 11,
      marginTop: 10,
    },
  
    /* achievements */
    achievementGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
  
    achievementCard: {
      width: width < 380 ? '48%' : '31%',
      aspectRatio: 1,
      borderRadius: 24,
      backgroundColor: '#171D2B',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.05)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 14,
      overflow: 'hidden',
    },
  
    achievementUnlocked: {
      borderColor: 'rgba(123,97,255,0.25)',
      backgroundColor: 'rgba(123,97,255,0.06)',
    },
  
    achievementIconWrap: {
      width: 44,
      height: 44,
      borderRadius: 14,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.05)',
    },
  
    achievementTitle: {
      color: '#6A6E92',
      fontSize: 11,
      fontWeight: '700',
      textAlign: 'center',
      marginTop: 10,
      paddingHorizontal: 8,
    },
  
    achievementDesc: {
      color: 'rgba(255,255,255,0.42)',
      fontSize: 9,
      textAlign: 'center',
      marginTop: 4,
      lineHeight: 12,
    },
  
    lockedOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(10,10,25,0.35)',
    },
  
    defendBadge: {
      position: 'absolute',
      top: 8,
      right: 8,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: 'rgba(255,184,77,0.1)',
      borderRadius: 999,
      paddingHorizontal: 6,
      paddingVertical: 4,
    },
  });