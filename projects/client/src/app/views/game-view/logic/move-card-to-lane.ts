import { LaneModel } from '../../../models/lane.model';
import { PlaceCardAttemptModel } from '../../../models/place-card-attempt.model';

export function moveCardToLane(
  placeCardAttempt: PlaceCardAttemptModel,
  lanes: LaneModel[]
) {
  const { TargetLaneIndex, TargetRowIndex, Card } = placeCardAttempt;
  const targetLane = lanes[TargetLaneIndex];
  const targetRow = targetLane.Rows[TargetRowIndex];
  targetRow.push(Card);
}
