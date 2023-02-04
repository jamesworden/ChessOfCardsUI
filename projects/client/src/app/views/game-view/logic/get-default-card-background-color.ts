export function getDefaultCardBackgroundColor(
  laneIndex: number,
  rowIndex: number
) {
  const rowAndLaneIndexSum = laneIndex + rowIndex;
  const defaultBackgroundColor =
    rowAndLaneIndexSum % 2 === 0 ? 'var(--dark-green)' : 'var(--light-green)';

  return defaultBackgroundColor;
}
