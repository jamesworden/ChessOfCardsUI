import { LaneModel } from 'src/app/models/lane.model';
import { PlayerOrNoneModel } from 'src/app/models/player-or-none-model';

export function allHostPovPreviousOpponentSideRowsOccupied(
  lane: LaneModel,
  targetRowIndex: number
) {
  const startCheckForPrevRowIndex = 5;

  for (let i = startCheckForPrevRowIndex; i <= targetRowIndex; i++) {
    const previousRow = lane.Rows[i - 1];
    const previousRowOccupied = previousRow.some(
      (row) => row.PlayedBy == PlayerOrNoneModel.Host
    );

    if (!previousRowOccupied) {
      return false;
    }
  }

  return true;
}
