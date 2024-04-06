import { Lane, PlaceCardAttempt } from '@client/models';

export function moveCardToLane(
  placeCardAttempt: PlaceCardAttempt,
  lanes: Lane[]
) {
  const { TargetLaneIndex, TargetRowIndex, Card } = placeCardAttempt;
  const targetLane = lanes[TargetLaneIndex];
  const targetRow = targetLane.Rows[TargetRowIndex];
  targetRow.push(Card);
}
