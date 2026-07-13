export const checkAchievements = updatedStats => {
  const unlocked = {};

  // permanent
  unlocked.first_blood =
    updatedStats.completedSessions >= 1;

  unlocked.iron_will =
    updatedStats.zeroSlipSessions >= 3;

  unlocked.grinder =
    updatedStats.completedSessions >= 10;

  unlocked.centurion =
    updatedStats.completedSessions >= 100;

  unlocked.marathon =
    updatedStats.bestSessionMinutes >= 120;

  unlocked.monk =
    updatedStats.zeroSlipSessions >= 10;

  unlocked.xp_hunter =
    updatedStats.lifetimeXp >= 1000;

  // defendable
  unlocked.consistency_king =
    updatedStats.dailyStreak >= 5;

  unlocked.unbreakable =
    updatedStats.missionStreak >= 10;

  const totalSessions =
    updatedStats.completedSessions +
    updatedStats.surrenderedSessions;

  unlocked.diamond_mind =
    totalSessions > 0 &&
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
      mins => mins >= 30
    ).length >= 5;

  return unlocked;
};