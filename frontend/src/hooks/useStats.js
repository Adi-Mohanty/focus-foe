import { useEffect } from 'react';
import AsyncStorage
  from '@react-native-async-storage/async-storage';

import {
  STATS_STORAGE_KEY,
  ACHIEVEMENTS_STORAGE_KEY,
} from '../constants/appConstants';

export const useStats = ({
  setStats,
  DEFAULT_STATS,
  onLoaded,
}) => {
  useEffect(() => {
    async function loadStats() {
      try {
        const savedStats =
          await AsyncStorage.getItem(
            STATS_STORAGE_KEY
          );

        // const savedAchievements =
        //   await AsyncStorage.getItem(
        //     ACHIEVEMENTS_STORAGE_KEY
        //   );

        if (savedStats) {
          const parsed =
            JSON.parse(savedStats);

          // console.log(
          //   'Loaded stats from storage:',
          //   parsed
          // );

          setStats({
            ...DEFAULT_STATS,
            ...parsed,

            weeklyFocus: {
              ...DEFAULT_STATS.weeklyFocus,
              ...(parsed.weeklyFocus || {}),
            },

            weeklySlips: {
              ...DEFAULT_STATS.weeklySlips,
              ...(parsed.weeklySlips || {}),
            },
          });
        }

        // if (savedAchievements) {
        //   setAchievements(
        //     JSON.parse(
        //       savedAchievements
        //     )
        //   );
        // }
      } catch (err) {
        console.log(
          'Stats load error:',
          err
        );
      } finally {
        onLoaded?.();
      }
    }

    loadStats();
  }, []);
};