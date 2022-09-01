import { MoveModel } from 'src/app/models/move.model';

export function cloneMoveToHostPov(move: MoveModel) {
  const clonedMove: MoveModel = {
    Card: move.Card,
    TargetLaneIndex: 4 - move.TargetLaneIndex,
    TargetRowIndex: 6 - move.TargetRowIndex,
  };

  return clonedMove;
}
