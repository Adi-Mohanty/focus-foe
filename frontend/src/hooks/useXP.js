import { useEffect } from 'react';
import AsyncStorage
  from '@react-native-async-storage/async-storage';

import {
  XP_STORAGE_KEY,
} from '../constants/appConstants';

export const useXP = ({
  xp,
  setXp,
}) => {
  useEffect(() => {
    AsyncStorage
      .getItem(
        XP_STORAGE_KEY
      )
      .then(stored => {
        if (stored) {
          setXp(
            Number(stored)
          );
        }
      });
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(
      XP_STORAGE_KEY,
      String(xp)
    );
  }, [xp]);
};