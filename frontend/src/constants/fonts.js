import { Platform } from 'react-native';

export const F = {
    villain: { fontWeight: '800', letterSpacing: -0.5 },   // Syne 800
    headline: { fontWeight: '700' },                        // Syne 700
    body: { fontWeight: '400' },
    label: { fontWeight: '700', letterSpacing: 1.5, textTransform: 'uppercase' },
    mono: { fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontWeight: '600', letterSpacing: 2 },
  };