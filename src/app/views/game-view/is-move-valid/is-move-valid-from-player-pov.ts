import { LaneModel } from 'src/app/models/lane.model';
import { MoveModel } from 'src/app/models/move.model';

export function isMoveValidFromPlayerPov(lane: LaneModel, move: MoveModel) {
  const { LaneAdvantage, LastCardPlayed, Rows } = lane;
  const { Card, TargetRowIndex } = move;

  console.log(lane, move);

  return true;
}
