import AsyncStorage from '@react-native-async-storage/async-storage';

export const SETTINGS_KEY =
  'FOCUSFOE_SETTINGS';

export async function loadSettings(
  defaults
) {
  try {
    const saved =
      await AsyncStorage.getItem(
        SETTINGS_KEY
      );

    if (!saved) {
      return defaults;
    }

    return {
      ...defaults,
      ...JSON.parse(saved),
    };
  } catch {
    return defaults;
  }
}

export async function saveSettings(
  settings
) {
  try {
    await AsyncStorage.setItem(
      SETTINGS_KEY,
      JSON.stringify(settings)
    );
  } catch (err) {
    console.log(
      'Settings save error:',
      err
    );
  }
}