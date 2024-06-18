import { Lane, PlaceCardAttempt } from '@shared/models';

export function moveCardToLane(
  placeCardAttempt: PlaceCardAttempt,
  lanes: Lane[]
) {
  const {
    targetLaneIndex: TargetLaneIndex,
    targetRowIndex: TargetRowIndex,
    card: Card,
  } = placeCardAttempt;
  const targetLane = lanes[TargetLaneIndex];
  const targetRow = targetLane.rows[TargetRowIndex];
  targetRow.push(Card);
}
