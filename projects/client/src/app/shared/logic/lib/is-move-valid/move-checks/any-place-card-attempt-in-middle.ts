import { Move } from '@client/models';

export function anyPlaceCardAttemptInMiddle(move: Move) {
  for (const placeCardAttempt of move.PlaceCardAttempts) {
    if (placeCardAttempt.TargetRowIndex === 3) {
      return true;
    }
  }

  return false;
}
