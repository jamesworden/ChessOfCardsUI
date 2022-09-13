import { MoveModel } from 'projects/client/src/app/models/move.model';

/**
 *
 * @returns true if the row indexes of the place card attempts are non-consecutive.
 * The index '3' can be ignored because users shouldn't be able to place a card
 * on the middle row.
 *
 * Example: if my place card attempts are on rows 1, 2, and 4, this would return false
 * as they are in order and ignoring the index 3. (4, 2, and 1 would also work as the
 * function should sort the place card attempts by row.)
 */
export function nonConsecutivePlaceCardAttempts(move: MoveModel) {
  const targetRowIndexes = move.PlaceCardAttempts.map((p) => p.TargetRowIndex);

  if (targetRowIndexes.length < 2) {
    return false;
  }

  let prevRowIndex = targetRowIndexes[0];
  const ascendingRowIndexes = targetRowIndexes.sort((a, b) => a - b);

  for (let i = 0; i < ascendingRowIndexes.length; i++) {
    const rowIndex = ascendingRowIndexes[i];
    const middleRowIndexSkipped = rowIndex === 4 && prevRowIndex === 2;
    const differenceBetweenRows = Math.abs(rowIndex - prevRowIndex);

    if (!middleRowIndexSkipped && differenceBetweenRows > 1) {
      return true;
    }

    prevRowIndex = rowIndex;
  }

  return false;
}
