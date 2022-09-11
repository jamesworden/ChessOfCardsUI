import { MoveModel } from 'projects/client/src/app/models/move.model';

export function moveOnDifferentLanes(move: MoveModel) {
  const uniqueLaneIndexes = new Set<number>();

  for (const placeCardAttempt of move.PlaceCardAttempts) {
    uniqueLaneIndexes.add(placeCardAttempt.TargetLaneIndex);
  }

  const onDifferentLanes = uniqueLaneIndexes.size > 1;

  return onDifferentLanes;
}
