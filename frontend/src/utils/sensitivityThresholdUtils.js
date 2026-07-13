export function getThreshold(
    sensitivity
  ) {
    switch (sensitivity) {
      case 'lenient':
        return 2.2;
  
      case 'strict':
        return 1.2;
  
      default:
        return 1.7;
    }
  }