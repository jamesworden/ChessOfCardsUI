import { MoveModel } from 'projects/client/src/app/models/move.model';

export function moveHasNoPlaceCardAttempts(move: MoveModel) {
  return move.PlaceCardAttempts.length <= 0;
}
