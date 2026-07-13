import { useEffect } from 'react';

import {
  getCheckinInterval,
} from '../utils/checkinUtils';

export const useTimer = ({
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
}) => {
  useEffect(() => {
    if (
      !sessionActive ||
      sessionPaused
    ) {
      return;
    }

    const updateTimer = () => {
      if (
        !sessionEndTimeRef.current
      ) {
        return;
      }

      const remainingMs =
        sessionEndTimeRef.current -
        Date.now();

      const nextSeconds =
        Math.max(
          0,
          Math.ceil(
            remainingMs / 1000
          )
        );

      secondsLeftRef.current =
        nextSeconds;

      setSecondsLeft(
        nextSeconds
      );

      const elapsedSeconds =
        durationRef.current * 60 -
        nextSeconds;

      const checkinMinutes =
        getCheckinInterval(
          durationRef.current,
          settings.tauntFrequency
        );

      const checkinSeconds =
        checkinMinutes * 60;

      if (
        elapsedSeconds >=
        lastCheckinRef.current +
          checkinSeconds
      ) {
        lastCheckinRef.current =
          elapsedSeconds;

        fetchVillainVoice(
          'checkin'
        );
      }

      if (
        nextSeconds === 0 &&
        !victoryHandledRef.current
      ) {
        handleVictory(false);
      }
    };

    updateTimer();

    const interval =
      setInterval(
        updateTimer,
        1000
      );

    return () =>
      clearInterval(
        interval
      );
  }, [
    sessionActive,
    sessionPaused,
    handleVictory,
  ]);
};