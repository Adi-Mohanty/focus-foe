export function getMissionResultColor(result) {
    if (result === 'victory')
      return '#FFD84D';
  
    if (result === 'failure')
      return '#FF7070';
  
    return '#7B61FF';
  }
  
  export function formatMissionDate(timestamp) {
    return new Date(
      timestamp
    ).toLocaleDateString(
      undefined,
      {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }
    );
  }