import { MoveModel } from 'projects/client/src/app/models/move.model';

/**
 *
 * @returns true if the row indexes of the place card attempts are non-consecutive.
 * The index '3' can be ignored because users shouldn't be able to place a card
 * on the middle row.
 *
 * Example: if my place card attempts are on rows 1, 2, and 4, this would return false
 * as they are in order and ignoring the index 3.
 */
export function nonConsecutivePlaceCardAttempts(move: MoveModel) {
  const targetRowIndexes = move.PlaceCardAttempts.map((p) => p.TargetRowIndex);

  if (targetRowIndexes.length < 2) {
    return false;
  }

  if (duplicateNumbers(targetRowIndexes)) {
    return false;
  }

  return nonConsecutiveNumbers(targetRowIndexes);
}

function duplicateNumbers(numbers: number[]) {
  const uniqueNumbers = new Set<number>();

  for (const number of numbers) {
    uniqueNumbers.add(number);
  }

  return uniqueNumbers.size < numbers.length;
}

function nonConsecutiveNumbers(numbers: number[]) {
  const ascendingNumbers = numbers.sort((a, b) => a - b);
  let prevNumber: number = -1;

  for (let i = 0; i < ascendingNumbers.length; i++) {
    const number = ascendingNumbers[i];
    if (prevNumber === -1) {
      prevNumber = number;
      continue;
    }

    const middleRowIndexSkipped = number === 4 && prevNumber === 2;
    if (middleRowIndexSkipped) {
      continue;
    }

    const differential = Math.abs(number - prevNumber);
    if (differential > 1) {
      return true;
    }
  }

  return false;
}
