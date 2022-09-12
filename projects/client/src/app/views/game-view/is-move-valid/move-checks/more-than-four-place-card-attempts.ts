import { MoveModel } from 'projects/client/src/app/models/move.model';

export function moreThanFourPlaceCardAttempts(move: MoveModel) {
  return move.PlaceCardAttempts.length > 4;
}
