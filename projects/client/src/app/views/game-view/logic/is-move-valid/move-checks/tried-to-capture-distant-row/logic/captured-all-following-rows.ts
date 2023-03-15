import { PlaceCardAttempt } from 'projects/client/src/app/models/place-card-attempt.model';
import { PlayerGameView } from 'projects/client/src/app/models/player-game-view.model';
import { PlayerOrNone } from 'projects/client/src/app/models/player-or-none.model';

export function capturedAllFollowingRows(
  gameState: PlayerGameView,
  firstPlaceCardAttempt: PlaceCardAttempt,
  endIndex = 6
) {
  const { TargetLaneIndex, TargetRowIndex } = firstPlaceCardAttempt;
  const lane = gameState.Lanes[TargetLaneIndex];

  for (let i = endIndex; i > TargetRowIndex; i--) {
    const followingRow = lane.Rows[i];
    const followingRowNotOccupied = followingRow.length === 0;

    if (followingRowNotOccupied) {
      return false;
    }

    const topCard = followingRow[followingRow.length - 1];
    const topCardPlayedByPlayer = gameState.IsHost
      ? topCard.PlayedBy == PlayerOrNone.Host
      : topCard.PlayedBy == PlayerOrNone.Guest;

    if (!topCardPlayedByPlayer) {
      return false;
    }
  }

  return true;
}
