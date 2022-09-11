import { LaneModel } from 'projects/client/src/app/models/lane.model';
import { PlayerOrNoneModel } from 'projects/client/src/app/models/player-or-none-model';

export function allFollowingRowsTopCardPlayedByPlayer(
  lane: LaneModel,
  targetRowIndex: number,
  isPlayerHost: boolean
) {
  for (let i = lane.Rows.length - 1; i > targetRowIndex; i--) {
    const followingRow = lane.Rows[i];
    const followingRowNotOccupied = followingRow.length == 0;

    if (followingRowNotOccupied) {
      return false;
    }

    const topCard = followingRow[followingRow.length - 1];
    const topCardPlayedByPlayer = isPlayerHost
      ? topCard.PlayedBy == PlayerOrNoneModel.Host
      : topCard.PlayedBy == PlayerOrNoneModel.Guest;

    if (!topCardPlayedByPlayer) {
      return false;
    }
  }

  return true;
}
