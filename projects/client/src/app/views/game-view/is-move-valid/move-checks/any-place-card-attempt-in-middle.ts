import { MoveModel } from 'projects/client/src/app/models/move.model';

export function anyPlaceCardAttemptInMiddle(move: MoveModel) {
  for (const placeCardAttempt of move.PlaceCardAttempts) {
    if (placeCardAttempt.TargetRowIndex === 3) {
      return true;
    }
  }

  return false;
}
