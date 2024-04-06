import { Move } from '@shared/models';

export function moveHasNoPlaceCardAttempts(move: Move) {
  return move.PlaceCardAttempts.length <= 0;
}
