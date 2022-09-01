import { LaneModel } from 'src/app/models/lane.model';

export function allFollowingRowsOccupied(
  lane: LaneModel,
  targetRowIndex: number
) {
  for (let i = targetRowIndex + 1; i < lane.Rows.length; i++) {
    const followingLane = lane.Rows[i];
    const followingLaneNotOccupied = followingLane.length === 0;

    if (followingLaneNotOccupied) {
      return false;
    }
  }

  return true;
}
