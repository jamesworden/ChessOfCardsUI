import { Move } from '@shared/models';

export function moreThanFourPlaceCardAttempts(move: Move) {
  return move.PlaceCardAttempts.length > 4;
}
