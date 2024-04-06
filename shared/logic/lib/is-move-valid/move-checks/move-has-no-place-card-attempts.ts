import { Move } from '@client/models';

export function moveHasNoPlaceCardAttempts(move: Move) {
  return move.PlaceCardAttempts.length <= 0;
}
