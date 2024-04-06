import { Move } from '@shared/models';

export function placeCardAttemptsTargetDifferentLanes(move: Move) {
  const uniqueLaneIndexes = new Set<number>();

  for (const placeCardAttempt of move.PlaceCardAttempts) {
    uniqueLaneIndexes.add(placeCardAttempt.TargetLaneIndex);
  }

  const onDifferentLanes = uniqueLaneIndexes.size > 1;

  return onDifferentLanes;
}
