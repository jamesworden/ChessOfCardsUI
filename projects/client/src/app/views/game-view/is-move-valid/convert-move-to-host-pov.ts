import * as _ from 'lodash';
import { MoveModel } from 'projects/client/src/app/models/move.model';

export function convertMoveToHostPov(move: MoveModel) {
  for (const placeCardAttempt of move.PlaceCardAttempts) {
    placeCardAttempt.TargetLaneIndex = 4 - placeCardAttempt.TargetLaneIndex;
    placeCardAttempt.TargetRowIndex = 6 - placeCardAttempt.TargetRowIndex;
  }

  return move;
}
