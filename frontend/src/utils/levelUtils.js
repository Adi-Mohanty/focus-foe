import { XP_PER_LEVEL } from '../constants/appConstants';

export function getLevelProgress(totalXp) {
  const level = Math.floor(totalXp / XP_PER_LEVEL) + 1;
  const xpInLevel = totalXp % XP_PER_LEVEL;

  return {
    level,
    xpInLevel,
    progress: xpInLevel / XP_PER_LEVEL,
  };
}