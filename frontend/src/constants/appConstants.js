import Constants from 'expo-constants';

const LOCAL_API =
  'http://10.76.43.47:3001';

const PROD_API =
  'https://clever-wonder-production-94c5.up.railway.app';

export const API_BASE =
  Constants.expoConfig?.extra?.useLocalBackend
    ? LOCAL_API
    : PROD_API;
    
export const XP_STORAGE_KEY = '@focusfoe/xp';
export const STATS_STORAGE_KEY = '@focusfoe/stats';
export const ACHIEVEMENTS_STORAGE_KEY = '@focusfoe/achievements';
export const APP_KEY = 'FocusFoe_7dfA51!IK92@RlY';
export const XP_PER_LEVEL = 100;
export const ACCEL_MOVEMENT_THRESHOLD = 1.7;
export const SLIP_COOLDOWN_MS = 5000;
export const CHECKIN_INTERVAL_MS = 10 * 60 * 1000;