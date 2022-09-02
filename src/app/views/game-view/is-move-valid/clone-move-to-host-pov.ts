import * as _ from 'lodash';
import { MoveModel } from 'src/app/models/move.model';

export function cloneMoveToHostPov(move: MoveModel) {
  const clonedMove: MoveModel = _.cloneDeep(move);
  clonedMove.TargetLaneIndex = 4 - clonedMove.TargetLaneIndex;
  clonedMove.TargetRowIndex = 6 - clonedMove.TargetRowIndex;

  return clonedMove;
}
