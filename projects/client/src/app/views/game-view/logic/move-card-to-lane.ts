import { Lane } from '../../../models/lane.model';
import { PlaceCardAttempt } from '../../../models/place-card-attempt.model';

export function moveCardToLane(
  placeCardAttempt: PlaceCardAttempt,
  lanes: Lane[]
) {
  const { TargetLaneIndex, TargetRowIndex, Card } = placeCardAttempt;
  const targetLane = lanes[TargetLaneIndex];
  const targetRow = targetLane.Rows[TargetRowIndex];
  targetRow.push(Card);
}
