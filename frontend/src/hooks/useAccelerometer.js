import { useEffect } from 'react';
import { Accelerometer } from 'expo-sensors';

export const useAccelerometer = ({
  sessionActive,
  sessionPaused,
  sessionRef,
  lastAccelRef,
  registerSlip,
  movementThreshold,
  enabled,
}) => {
  useEffect(() => {
    if (!sessionActive) return;

    Accelerometer.setUpdateInterval(
      250
    );

    const sub =
      Accelerometer.addListener(
        ({ x, y, z }) => {
          if (
            !sessionRef.current ||
            sessionPaused
          ) {
            return;
          }

          const last =
            lastAccelRef.current;

          lastAccelRef.current = {
            x,
            y,
            z,
          };

          if (!last) return;

          const delta =
            Math.sqrt(
              (x - last.x) ** 2 +
              (y - last.y) ** 2 +
              (z - last.z) ** 2
            );

          if (
            enabled &&
            delta >
              movementThreshold
          ) {
            registerSlip();
          }
        }
      );

    return () => sub.remove();
  }, [
    sessionActive,
    sessionPaused,
    registerSlip,
  ]);
};