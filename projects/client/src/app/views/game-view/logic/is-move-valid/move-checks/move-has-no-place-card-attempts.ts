import { Move } from 'projects/client/src/app/models/move.model';

export function moveHasNoPlaceCardAttempts(move: Move) {
  return move.PlaceCardAttempts.length <= 0;
}
