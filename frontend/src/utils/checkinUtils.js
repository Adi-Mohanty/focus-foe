export function getCheckinInterval(
    duration,
    frequency
  ) {
    switch (frequency) {
      case 'minimal':
        // 1–2 taunts
        return Math.max(
          duration * 0.5,
          10
        );
  
      case 'aggressive':
        // every 10% but minimum 4 min
        return Math.max(
          duration * 0.1,
          4
        );
  
      case 'normal':
      default:
        // roughly 4–5 taunts
        return Math.max(
          duration * 0.25,
          5
        );
    }
  }