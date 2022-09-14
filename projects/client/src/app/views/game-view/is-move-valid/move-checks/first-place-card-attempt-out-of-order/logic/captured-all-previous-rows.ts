import { LaneModel } from 'projects/client/src/app/models/lane.model';
import { PlayerOrNoneModel } from 'projects/client/src/app/models/player-or-none-model';

export function capturedAllPreviousRows(
  lane: LaneModel,
  targetRowIndex: number,
  isPlayerHost: boolean
) {
  for (let i = 0; i < targetRowIndex; i++) {
    const previousRow = lane.Rows[i];
    const previousRowNotOccupied = previousRow.length == 0;

    if (previousRowNotOccupied) {
      return false;
    }

    const topCard = previousRow[previousRow.length - 1];
    const topCardPlayedByPlayer = isPlayerHost
      ? topCard.PlayedBy == PlayerOrNoneModel.Host
      : topCard.PlayedBy == PlayerOrNoneModel.Guest;

    if (!topCardPlayedByPlayer) {
      return false;
    }
  }

  return true;
}
