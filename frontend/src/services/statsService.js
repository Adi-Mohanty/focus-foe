export const updateDailyStreak = (
  currentStats,
  success = true
) => {
  const today =
    new Date()
      .toISOString()
      .split('T')[0];

  if (!success) {
    return {
      ...currentStats,
      lastActiveDate: today,
    };
  }

  const last =
    currentStats.lastActiveDate;

  let nextStreak =
    currentStats.dailyStreak || 0;

  if (!last) {
    nextStreak = 1;
  } else {
    const diff =
      Math.floor(
        (new Date(today) -
          new Date(last)) /
          86400000
      );

      if (diff === 0) {
        nextStreak =
          currentStats.dailyStreak;
      } else if (diff === 1) {
        nextStreak += 1;
      } else {
        nextStreak = 1;
      }
  }

  return {
    ...currentStats,
  
    dailyStreak: nextStreak,
  
    longestDailyStreak: Math.max(
      currentStats.longestDailyStreak || 0,
      nextStreak
    ),
  
    lastActiveDate: today,
  };
};


export const resetWeeklyStatsIfNeeded =
  currentStats => {
    const now =
      new Date();

    const currentWeek =
      `${now.getFullYear()}-${Math.ceil(
        now.getDate() / 7
      )}`;

    if (
      currentStats.weeklyResetKey ===
      currentWeek
    ) {
      return currentStats;
    }

    return {
      ...currentStats,
      weeklyResetKey: currentWeek,

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
  };