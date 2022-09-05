import { LaneModel } from 'src/app/models/lane.model';
import { PlayerOrNoneModel } from 'src/app/models/player-or-none-model';

export function allHostPovPreviousRowsOccupied(
  lane: LaneModel,
  targetRowIndex: number
) {
  for (let i = 0; i < targetRowIndex; i++) {
    const previousRow = lane.Rows[i];

    const previousRowOccupied = previousRow.some(
      (row) => row.PlayedBy == PlayerOrNoneModel.Host
    );

    if (!previousRowOccupied) {
      return false;
    }
  }

  return true;
}
