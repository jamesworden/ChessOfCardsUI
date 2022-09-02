import * as _ from 'lodash';
import { MoveModel } from 'src/app/models/move.model';

export function convertMoveToHostPov(move: MoveModel) {
  move.TargetLaneIndex = 4 - move.TargetLaneIndex;
  move.TargetRowIndex = 6 - move.TargetRowIndex;

  return move;
}
