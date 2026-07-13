import { C } from "./colors";

export const DEFAULT_SETTINGS = {
  enabledPersonalities: [
    'sarcastic',
    'dramatic',
    'sleepy',
    'philosophical',
    'jerk',
    'corporate',
  ],
  
  cruelty: 2,

  tauntFrequency: 'normal',

  movementSensitivity: 'balanced',

  detectMovement: true,

  detectAppSwitch: true,

  detectScreenUnlock: true,

  defaultDuration: 25,

  slipCooldown: 5,

  accentColor: C.primary,

  reducedMotion: false,

  haptics: false,

  sounds: false,
};