import { LaneModel } from 'src/app/models/lane.model';

export function cloneLaneToHostPov(lane: LaneModel) {
  let clonedRows = [...lane.Rows];
  clonedRows = clonedRows.reverse();

  let clonedLane: LaneModel = {
    LaneAdvantage: lane.LaneAdvantage,
    LastCardPlayed: lane.LastCardPlayed,
    Rows: clonedRows,
  };

  return clonedLane;
}
