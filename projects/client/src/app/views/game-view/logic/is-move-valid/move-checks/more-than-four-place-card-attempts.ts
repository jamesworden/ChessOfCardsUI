import { Move } from 'projects/client/src/app/models/move.model';

export function moreThanFourPlaceCardAttempts(move: Move) {
  return move.PlaceCardAttempts.length > 4;
}
