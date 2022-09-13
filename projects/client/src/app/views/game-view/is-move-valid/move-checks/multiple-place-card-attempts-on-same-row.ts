import { MoveModel } from 'projects/client/src/app/models/move.model';

export function multiplePlaceCardAttemptsOnSameRow(move: MoveModel) {
  const targetRowIndexes = move.PlaceCardAttempts.map((p) => p.TargetRowIndex);
  const uniqueIndexes = new Set<number>();

  for (const index of targetRowIndexes) {
    uniqueIndexes.add(index);
  }

  const duplicateIndexes = uniqueIndexes.size < targetRowIndexes.length;

  return duplicateIndexes;
}
