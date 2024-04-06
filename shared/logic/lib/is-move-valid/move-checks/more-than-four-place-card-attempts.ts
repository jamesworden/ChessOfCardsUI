import { Move } from '@client/models';

export function moreThanFourPlaceCardAttempts(move: Move) {
  return move.PlaceCardAttempts.length > 4;
}
