import { LaneModel } from 'src/app/models/lane.model';

export function allPreviousRowsOccupied(
  lane: LaneModel,
  targetRowIndex: number
) {
  for (let i = 0; i < targetRowIndex; i++) {
    const previousLane = lane.Rows[i];
    const previousLaneNotOccupied = previousLane.length === 0;

    if (previousLaneNotOccupied) {
      return false;
    }
  }

  return true;
}
