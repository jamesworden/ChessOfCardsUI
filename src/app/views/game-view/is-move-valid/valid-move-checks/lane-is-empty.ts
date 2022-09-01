import { LaneModel } from 'src/app/models/lane.model';

export function laneIsEmpty(targetLane: LaneModel) {
  return !targetLane.LastCardPlayed;
}
